import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import ChatScreen from './ChatScreen';

export default function WaitingRoomScreen({ doctor }: { doctor: any }) {
  const { popScreen, pushScreen } = useNavigation();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background animated blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6C63FF]/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00D4AA]/20 rounded-full blur-3xl"
      />

      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] p-1 shadow-[0_0_40px_rgba(0,212,170,0.3)]">
            <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center text-5xl font-bold font-display">
              {doctor.initials}
            </div>
          </div>
          
          {/* Pulsing rings */}
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-[#00D4AA] pointer-events-none"
          />
          <motion.div 
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-[#6C63FF] pointer-events-none"
          />
        </motion.div>

        <h1 className="font-display text-3xl font-bold mb-2">{doctor.name}</h1>
        <p className="text-[#8B8FA8] text-lg mb-12">{doctor.spec}</p>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-12 max-w-sm w-full">
          <h2 className="text-xl font-bold text-white mb-2">Waiting Room</h2>
          <p className="text-[#00D4AA] font-medium text-lg">Coming up in 5 mins{dots}</p>
          <p className="text-[#8B8FA8] text-sm mt-4">Please ensure you have a stable internet connection and are in a quiet environment.</p>
        </div>

        <div className="flex items-center gap-8">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={popScreen}
            className="w-16 h-16 rounded-full bg-[#FF4B4B] flex items-center justify-center shadow-[0_0_20px_rgba(255,75,75,0.4)]"
          >
            <PhoneOff size={28} className="text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => pushScreen({ id: 'chat', component: <ChatScreen doctor={doctor} /> })}
            className="w-20 h-20 rounded-full bg-[#00D4AA] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,170,0.5)]"
          >
            <Video size={32} className="text-black" />
          </motion.button>
        </div>
        
        <div className="flex gap-14 mt-4 text-sm font-bold text-[#8B8FA8]">
          <span>Reject</span>
          <span className="text-[#00D4AA]">Attend Call</span>
        </div>
      </div>
    </div>
  );
}
