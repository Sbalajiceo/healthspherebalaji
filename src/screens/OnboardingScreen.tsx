import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Heart, Activity, Moon, Brain, Dumbbell, Apple, Droplets, HeartPulse } from 'lucide-react';

const GOALS = [
  { id: 'bp',        label: 'Blood Pressure',  icon: HeartPulse, color: 'from-[#FF6B6B] to-[#FF4B4B]' },
  { id: 'diabetes',  label: 'Diabetes',         icon: Droplets,   color: 'from-[#FFB347] to-[#FF9F7F]' },
  { id: 'weight',    label: 'Weight Loss',      icon: Activity,   color: 'from-[#6C63FF] to-[#8B83FF]' },
  { id: 'sleep',     label: 'Better Sleep',     icon: Moon,       color: 'from-[#00C9A7] to-[#00D4AA]' },
  { id: 'stress',    label: 'Stress Relief',    icon: Brain,      color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { id: 'fitness',   label: 'Stay Fit',         icon: Dumbbell,   color: 'from-[#A8FF78] to-[#78FFD6]' },
  { id: 'nutrition', label: 'Eat Healthy',      icon: Apple,      color: 'from-[#FFB347] to-[#A8FF78]' },
  { id: 'general',   label: 'General Wellness', icon: Heart,      color: 'from-[#6C63FF] to-[#00D4AA]' },
];

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Sandeep');
  const [age, setAge] = useState('26');
  const [goals, setGoals] = useState<string[]>(['bp']);

  const toggleGoal = (id: string) =>
    setGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleComplete = () => {
    localStorage.setItem('hs_onboarded', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col max-w-[390px] mx-auto relative overflow-hidden">
      {/* BG orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#6C63FF]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00D4AA]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Step dots */}
      <div className="flex justify-center gap-2 pt-16 pb-4 relative z-10">
        {[1, 2, 3].map(s => (
          <motion.div
            key={s}
            animate={{ width: s === step ? 24 : 8, opacity: s <= step ? 1 : 0.3 }}
            className="h-2 rounded-full bg-primary-gradient"
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 pb-10 relative z-10">
        <AnimatePresence mode="wait">

          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-20 h-20 rounded-2xl bg-primary-gradient flex items-center justify-center mb-8 shadow-[0_8px_32px_rgba(108,99,255,0.4)]"
                >
                  <Heart size={36} className="text-white" />
                </motion.div>

                <h1 className="font-display text-4xl font-bold mb-3 leading-tight">
                  Welcome to<br />HealthSphere
                </h1>
                <p className="text-[#8B8FA8] text-base mb-10 leading-relaxed">
                  India's smartest health companion. Let's set up your profile.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-2 block">Your Name</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sandeep"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white text-lg font-medium focus:outline-none focus:border-[#6C63FF]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-2 block">Age</label>
                    <input
                      value={age}
                      onChange={e => setAge(e.target.value)}
                      type="number"
                      placeholder="26"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white text-lg font-medium focus:outline-none focus:border-[#6C63FF]/60 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(108,99,255,0.3)] disabled:opacity-40"
              >
                Continue <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold mt-4 mb-2">Your Health Goals</h2>
                <p className="text-[#8B8FA8] text-sm mb-8">Select all that apply. We'll personalise your experience.</p>

                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map(goal => {
                    const sel = goals.includes(goal.id);
                    const Icon = goal.icon;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-2xl flex flex-col items-start text-left border transition-all ${sel ? 'bg-white/10 border-white/30' : 'glass-card border-white/5'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-3`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        <span className={`text-sm font-bold leading-tight ${sel ? 'text-white' : 'text-white/70'}`}>{goal.label}</span>
                        {sel && <div className="mt-2 w-4 h-4 rounded-full bg-[#00D4AA] flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(3)}
                disabled={goals.length === 0}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(108,99,255,0.3)] disabled:opacity-40 mt-8"
              >
                Continue <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.1 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(108,99,255,0.4)] relative"
              >
                <motion.div className="absolute inset-0 rounded-full bg-[#6C63FF]/30 animate-ping" />
                <Heart size={52} className="text-white relative z-10" />
              </motion.div>

              <h2 className="font-display text-4xl font-bold mb-3">You're all set, {name}!</h2>
              <p className="text-[#8B8FA8] text-base mb-10 leading-relaxed max-w-[280px]">
                Your personalised health dashboard is ready. Family, appointments, medicines — all in one place.
              </p>

              <div className="w-full glass-card rounded-2xl p-5 border border-white/10 mb-10 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Your Health Goals</p>
                <div className="flex flex-wrap gap-2">
                  {goals.map(id => {
                    const g = GOALS.find(x => x.id === id);
                    if (!g) return null;
                    return (
                      <span key={id} className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#6C63FF]/20 text-[#A89CFF] border border-[#6C63FF]/30">
                        {g.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
              >
                Enter HealthSphere <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
