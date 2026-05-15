import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, Mail, ArrowLeft, Eye, EyeOff, ShieldCheck, HeartPulse, ChevronRight,
} from 'lucide-react';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { saveUserProfile } from '../services/firestoreService';

type Step = 'landing' | 'phone' | 'otp' | 'email';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-phone-number':       'Enter a valid 10-digit mobile number.',
  'auth/invalid-verification-code':  'Incorrect OTP. Please try again.',
  'auth/code-expired':               'OTP expired. Please resend.',
  'auth/too-many-requests':          'Too many attempts. Please wait and try again.',
  'auth/email-already-in-use':       'This email is already registered. Try signing in.',
  'auth/wrong-password':             'Incorrect password.',
  'auth/user-not-found':             'No account found with this email.',
  'auth/weak-password':              'Password must be at least 6 characters.',
  'auth/invalid-email':              'Enter a valid email address.',
  'auth/invalid-credential':         'Incorrect email or password.',
  'auth/network-request-failed':     'Network error. Check your connection.',
};
const firebaseError = (code: string) =>
  FIREBASE_ERRORS[code] ?? 'Something went wrong. Please try again.';

export default function WelcomeScreen() {
  const [step, setStep]       = useState<Step>('landing');
  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef    = useRef<RecaptchaVerifier | null>(null);
  const otpRefs         = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP box when step changes to otp
  useEffect(() => {
    if (step === 'otp') setTimeout(() => otpRefs.current[0]?.focus(), 150);
  }, [step]);

  const clearError = () => setError('');

  const setupRecaptcha = () => {
    if (recaptchaRef.current) return;
    recaptchaRef.current = new RecaptchaVerifier(auth!, 'recaptcha-container', {
      size: 'invisible',
    });
  };

  // ── Phone OTP ───────────────────────────────────────────────────────────────

  const sendOtp = async () => {
    if (phone.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    setLoading(true); clearError();
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth!, '+91' + phone, recaptchaRef.current!);
      confirmationRef.current = result;
      setStep('otp');
    } catch (err: any) {
      setError(firebaseError(err.code));
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter the complete 6-digit OTP.'); return; }
    setLoading(true); clearError();
    try {
      const result = await confirmationRef.current!.confirm(code);
      const u = result.user;
      const isNew = u.metadata.creationTime === u.metadata.lastSignInTime;
      await saveUserProfile(u.uid, {
        name:        u.displayName ?? '',
        phone:       '+91' + phone,
        email:       '',
        ...(isNew && { createdAt: new Date().toISOString() }),
      });
    } catch (err: any) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    recaptchaRef.current?.clear();
    recaptchaRef.current = null;
    setOtp(['', '', '', '', '', '']);
    setStep('phone');
    clearError();
  };

  // ── Email ───────────────────────────────────────────────────────────────────

  const handleEmail = async () => {
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    if (isSignUp && !name.trim())   { setError('Please enter your name.'); return; }
    setLoading(true); clearError();
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth!, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
        await saveUserProfile(result.user.uid, {
          name:      name.trim(),
          email:     email.trim(),
          phone:     '',
          createdAt: new Date().toISOString(),
        });
      } else {
        const result = await signInWithEmailAndPassword(auth!, email.trim(), password);
        await saveUserProfile(result.user.uid, { email: email.trim() });
      }
    } catch (err: any) {
      setError(firebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── OTP box helpers ─────────────────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    clearError();
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length) {
      const next = digits.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(next);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  // ── Shared back ─────────────────────────────────────────────────────────────

  const goBack = () => {
    setError('');
    if (step === 'otp') { setStep('phone'); setOtp(['', '', '', '', '', '']); return; }
    setStep('landing');
    setPhone(''); setEmail(''); setPassword(''); setName('');
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* reCAPTCHA invisible container */}
      <div id="recaptcha-container" />

      {/* Background orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-72 h-72 rounded-full bg-[#6C63FF]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-72 h-72 rounded-full bg-[#00D4AA]/20 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* ── LANDING ─────────────────────────────────────────────────────── */}
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[390px] flex flex-col items-center"
          >
            {/* Logo */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(108,99,255,0.35)]">
              <HeartPulse size={44} className="text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-center mb-2">HealthSphere</h1>
            <p className="text-[#8B8FA8] text-center text-sm mb-12 max-w-[260px] leading-relaxed">
              Your personal health companion — one app for everything health.
            </p>

            {/* Auth options */}
            <div className="w-full space-y-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setStep('phone'); clearError(); }}
                className="w-full glass-card flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#6C63FF]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">Continue with Mobile Number</p>
                  <p className="text-[#8B8FA8] text-xs mt-0.5">OTP verification on your +91 number</p>
                </div>
                <ChevronRight size={16} className="text-[#8B8FA8]" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setStep('email'); clearError(); }}
                className="w-full glass-card flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-[#00D4AA]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm">Continue with Email</p>
                  <p className="text-[#8B8FA8] text-xs mt-0.5">Sign in or create a new account</p>
                </div>
                <ChevronRight size={16} className="text-[#8B8FA8]" />
              </motion.button>
            </div>

            <p className="text-[#8B8FA8] text-[11px] text-center mt-10 px-4 leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        )}

        {/* ── PHONE ───────────────────────────────────────────────────────── */}
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[390px]"
          >
            <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-8">
              <ArrowLeft size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/20 flex items-center justify-center mb-5">
              <Phone size={22} className="text-[#6C63FF]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Enter Mobile Number</h2>
            <p className="text-[#8B8FA8] text-sm mb-8">We'll send a 6-digit OTP to verify your number.</p>

            <label className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider block mb-2">
              Mobile Number
            </label>
            <div className="flex items-center glass-card rounded-2xl px-4 py-4 border border-white/10 mb-4 focus-within:border-[#6C63FF]/60 transition-colors">
              <span className="text-[#8B8FA8] font-bold mr-3 text-sm border-r border-white/10 pr-3">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); clearError(); }}
                onKeyDown={e => e.key === 'Enter' && sendOtp()}
                placeholder="98765 43210"
                className="flex-1 bg-transparent text-base text-white placeholder:text-[#8B8FA8] outline-none"
                inputMode="numeric"
                autoFocus
              />
            </div>

            {error && <p className="text-[#FF6B6B] text-xs mb-4 font-medium">{error}</p>}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={sendOtp}
              disabled={loading || phone.length !== 10}
              className="w-full py-4 rounded-2xl bg-primary-gradient font-bold text-sm disabled:opacity-40 transition-opacity"
            >
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </motion.button>
          </motion.div>
        )}

        {/* ── OTP ─────────────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[390px]"
          >
            <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-8">
              <ArrowLeft size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/20 flex items-center justify-center mb-5">
              <ShieldCheck size={22} className="text-[#00D4AA]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Enter OTP</h2>
            <p className="text-[#8B8FA8] text-sm mb-8">
              6-digit code sent to{' '}
              <span className="text-white font-bold">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
            </p>

            {/* OTP boxes */}
            <div className="flex gap-3 justify-between mb-6" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  maxLength={1}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-white/5 outline-none transition-all
                    ${digit ? 'border-[#6C63FF] text-white' : 'border-white/10 text-white'}
                    focus:border-[#6C63FF] focus:bg-[#6C63FF]/10`}
                />
              ))}
            </div>

            {error && <p className="text-[#FF6B6B] text-xs mb-4 font-medium">{error}</p>}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={verifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-4 rounded-2xl bg-primary-gradient font-bold text-sm disabled:opacity-40 transition-opacity mb-4"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </motion.button>

            <button onClick={resendOtp} className="w-full text-center text-sm text-[#8B8FA8] hover:text-white transition-colors py-2">
              Didn't receive OTP?{' '}
              <span className="text-[#6C63FF] font-bold">Resend</span>
            </button>
          </motion.div>
        )}

        {/* ── EMAIL ───────────────────────────────────────────────────────── */}
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[390px]"
          >
            <button onClick={goBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-8">
              <ArrowLeft size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/20 flex items-center justify-center mb-5">
              <Mail size={22} className="text-[#00D4AA]" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[#8B8FA8] text-sm mb-8">
              {isSignUp ? 'Sign up with your email to get started.' : 'Sign in to your HealthSphere account.'}
            </p>

            <div className="space-y-3 mb-4">
              {/* Name (sign-up only) */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); clearError(); }}
                      placeholder="Full Name"
                      className="w-full glass-card rounded-2xl px-4 py-4 text-base text-white placeholder:text-[#8B8FA8] outline-none border border-white/10 focus:border-[#6C63FF]/60 bg-transparent transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                placeholder="Email Address"
                autoFocus={!isSignUp}
                className="w-full glass-card rounded-2xl px-4 py-4 text-base text-white placeholder:text-[#8B8FA8] outline-none border border-white/10 focus:border-[#6C63FF]/60 bg-transparent transition-colors"
              />

              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError(); }}
                  onKeyDown={e => e.key === 'Enter' && handleEmail()}
                  placeholder="Password"
                  className="w-full glass-card rounded-2xl px-4 py-4 pr-12 text-base text-white placeholder:text-[#8B8FA8] outline-none border border-white/10 focus:border-[#6C63FF]/60 bg-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8FA8]"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-[#FF6B6B] text-xs mb-4 font-medium">{error}</p>}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleEmail}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary-gradient font-bold text-sm disabled:opacity-40 transition-opacity mb-4"
            >
              {loading ? (isSignUp ? 'Creating Account…' : 'Signing In…') : (isSignUp ? 'Create Account' : 'Sign In')}
            </motion.button>

            <button
              onClick={() => { setIsSignUp(p => !p); clearError(); setName(''); setPassword(''); }}
              className="w-full text-center text-sm text-[#8B8FA8] hover:text-white transition-colors py-2"
            >
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span className="text-[#6C63FF] font-bold">{isSignUp ? 'Sign In' : 'Sign Up'}</span>
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
