import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MessageCircle, Video, Lock, MapPin, Clock } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import ChatScreen from './ChatScreen';

export default function WaitingRoomScreen({ doctor }: { doctor: any }) {
  const { popScreen, pushScreen } = useNavigation();
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#0D0D1A] via-[#111120] to-[#0A0A0F] text-white flex flex-col overflow-hidden font-sans">

      {/* Ambient blobs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-[#6C63FF]/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-[100px] right-[-80px] w-80 h-80 bg-[#00D4AA]/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center px-4 pt-4 pb-2">
        <button
          onClick={popScreen}
          className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="ml-3 text-base font-semibold text-white/80">Waiting Room</span>
      </header>

      {/* Doctor card */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-6 px-6">
        {/* Avatar with pulsing rings */}
        <div className="relative mb-6">
          <motion.div
            animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border-2 border-[#00D4AA]"
          />
          <motion.div
            animate={{ scale: [1, 2.1], opacity: [0.25, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
            className="absolute inset-0 rounded-full border border-[#6C63FF]"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            className="w-28 h-28 rounded-full p-[3px]"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}
          >
            <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center text-4xl font-bold">
              {doctor.initials}
            </div>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-1"
        >
          {doctor.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#8B8FA8] text-sm mb-4"
        >
          {doctor.spec}
        </motion.p>

        {/* Info chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 flex-wrap justify-center"
        >
          {doctor.hospital && (
            <div className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-full px-3 py-1.5 text-xs text-[#D1D5DB]">
              <MapPin size={12} className="text-[#6C63FF]" />
              {doctor.hospital}
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-full px-3 py-1.5 text-xs text-[#D1D5DB]">
            <Clock size={12} className="text-[#00D4AA]" />
            {doctor.appointmentTime}
          </div>
        </motion.div>
      </div>

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mx-5 rounded-2xl border border-white/8 p-5"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB347] shadow-[0_0_8px_#FFB347]" />
          <span className="text-sm font-semibold text-[#FFB347]">Appointment Scheduled</span>
        </div>
        <p className="text-[13px] text-[#8B8FA8] leading-relaxed">
          Your consultation with {doctor.name} is confirmed for{' '}
          <span className="text-white font-medium">{doctor.appointmentTime}</span>.
          You can message the doctor now while you wait.
        </p>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, type: 'spring', damping: 22 }}
        className="relative z-10 px-5 pb-10"
      >
        <div className="flex gap-4">
          {/* Chat button — active */}
          <button
            onClick={() => pushScreen({ id: `chat-${doctor.name}`, component: <ChatScreen doctor={doctor} /> })}
            className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border border-[#00D4AA]/30 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.18), rgba(0,212,170,0.12))' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C63FF, #00D4AA)' }}>
              <MessageCircle size={22} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Chat</span>
            <span className="text-[11px] text-[#00D4AA]">Message now</span>
          </button>

          {/* Attend Call — locked */}
          <button
            onClick={showToast}
            className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/8 opacity-45"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center relative">
              <Video size={22} className="text-white/60" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1A1A24] border border-white/20 flex items-center justify-center">
                <Lock size={10} className="text-white/50" />
              </div>
            </div>
            <span className="text-sm font-semibold text-white/60">Attend Call</span>
            <span className="text-[11px] text-[#8B8FA8]">{doctor.appointmentTime}</span>
          </button>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-[#1A1A2E] border border-white/15 rounded-2xl px-5 py-3 z-50 whitespace-nowrap shadow-xl"
          >
            <p className="text-sm text-white font-medium">Call opens on {doctor.appointmentTime}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
