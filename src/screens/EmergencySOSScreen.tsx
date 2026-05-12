import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const HOSPITALS = [
  { name: 'Apollo Spectra Hospital',   address: 'HSR Layout, Bengaluru',      distance: '1.2 km', phone: '080-48531111' },
  { name: 'Manipal Hospital',          address: 'Sarjapur Rd, Bengaluru',     distance: '2.8 km', phone: '080-25023333' },
  { name: 'Fortis Hospital',           address: 'Bannerghatta Rd, Bengaluru', distance: '3.5 km', phone: '080-66214444' },
];

export default function EmergencySOSScreen() {
  const { popScreen } = useNavigation();
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!activated) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [activated, countdown]);

  return (
    <div className="min-h-screen bg-[#120000] text-white flex flex-col relative overflow-hidden">
      {/* BG pulsing orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF2020]/30 rounded-full blur-3xl pointer-events-none"
      />

      {/* Header */}
      <div className="relative z-10 px-4 pt-14 pb-4 flex items-center">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#FF4B4B]" />
          <span className="font-bold text-[#FF4B4B] uppercase tracking-widest text-sm">Emergency SOS</span>
        </div>
      </div>

      {/* Main SOS button */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <AnimatePresence mode="wait">
          {!activated ? (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <p className="text-[#FF6B6B] text-sm font-bold uppercase tracking-widest mb-8">Hold to activate</p>

              <motion.button
                whileTap={{ scale: 0.94 }}
                onTouchStart={() => setActivated(true)}
                onClick={() => setActivated(true)}
                className="relative w-44 h-44 rounded-full flex items-center justify-center"
              >
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2 + i * 0.15], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute inset-0 rounded-full border-2 border-[#FF2020]"
                  />
                ))}
                <div className="w-44 h-44 rounded-full bg-[#FF2020] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,32,32,0.6)] relative z-10">
                  <Phone size={44} className="text-white mb-1" />
                  <span className="font-display text-2xl font-bold text-white">SOS</span>
                </div>
              </motion.button>

              <p className="text-[#8B8FA8] text-sm mt-8 text-center max-w-[240px] leading-relaxed">
                Tap to call emergency services (112) and alert your emergency contacts.
              </p>
            </motion.div>
          ) : countdown > 0 ? (
            <motion.div key="counting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-44 h-44 rounded-full bg-[#FF2020] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(255,32,32,0.8)] mb-8"
              >
                <span className="font-mono text-6xl font-bold text-white">{countdown}</span>
                <span className="text-white/80 text-sm font-bold">Calling 112</span>
              </motion.div>

              <p className="text-white text-lg font-bold mb-6">Calling emergency services...</p>

              <button
                onClick={() => { setActivated(false); setCountdown(5); }}
                className="px-8 h-12 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div key="calling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-44 h-44 rounded-full bg-[#FF2020] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(255,32,32,1)] mb-6"
              >
                <Phone size={52} className="text-white" />
              </motion.div>
              <p className="text-[#FF6B6B] font-bold text-xl mb-2">Connected to 112</p>
              <p className="text-[#8B8FA8] text-sm mb-6">Stay on the line. Help is on the way.</p>
              <a
                href="tel:112"
                className="w-full h-14 rounded-full bg-[#FF2020] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(255,32,32,0.5)]"
              >
                <Phone size={20} /> Call 112 Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nearby hospitals */}
      <div className="relative z-10 px-4 pb-10">
        <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Nearest Hospitals</p>
        <div className="space-y-2">
          {HOSPITALS.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF2020]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[#FF6B6B]" />
                </div>
                <div>
                  <p className="font-bold text-sm">{h.name}</p>
                  <p className="text-[#8B8FA8] text-xs">{h.address} · {h.distance}</p>
                </div>
              </div>
              <a
                href={`tel:${h.phone}`}
                className="w-9 h-9 rounded-full bg-[#FF2020]/20 flex items-center justify-center shrink-0"
              >
                <Phone size={14} className="text-[#FF6B6B]" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
