import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import HealthScoreScreen from './HealthScoreScreen';

export default function FamilyMemberScoreScreen({ member }: { member: any }) {
  const { popScreen, pushScreen } = useNavigation();
  
  const [colorStart, colorEnd] = member.color.split(' ').map((c: string) => c.replace('from-[', '').replace('to-[', '').replace(']', ''));

  return (
    <div className="min-h-full w-full bg-[#0A0A0A] text-white pb-10 font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-[#0A0A0A]/80 backdrop-blur-md">
        <button onClick={popScreen} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">{member.name}'s Vibe</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 pt-6 pb-24 flex flex-col items-center">
        
        {/* Cute Greeting */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1A1A] px-6 py-3 rounded-full border border-white/10 mb-8 flex items-center gap-2"
        >
          <Sparkles size={16} style={{ color: colorEnd }} />
          <span className="text-sm font-medium">Doing great today!</span>
        </motion.div>

        {/* Cute Bouncing Score */}
        <motion.div 
          animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative w-56 h-56 mb-10"
        >
          <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 bg-gradient-to-br ${member.color}`} />
          <div className={`w-full h-full rounded-[48px] rotate-3 bg-gradient-to-br ${member.color} p-1.5 shadow-2xl`}>
            <div className="w-full h-full rounded-[42px] bg-[#13131A] flex flex-col items-center justify-center -rotate-3">
              <span className="text-[80px] font-black tracking-tighter leading-none" style={{ color: colorEnd }}>{member.score}</span>
              <span className="text-sm font-bold text-white/50 uppercase tracking-widest mt-2">Health Score</span>
            </div>
          </div>
        </motion.div>

        {/* Eclectic Cards */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 -rotate-2 shadow-lg">
            <div className="text-4xl mb-3">😴</div>
            <div className="text-sm font-bold text-white/50">Sleep</div>
            <div className="text-2xl font-black text-white">7.5h</div>
            <div className="text-xs text-[#00D4AA] mt-1 font-medium bg-[#00D4AA]/10 inline-block px-2 py-1 rounded-full">Perfect!</div>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 rotate-2 shadow-lg">
            <div className="text-4xl mb-3">🏃‍♀️</div>
            <div className="text-sm font-bold text-white/50">Activity</div>
            <div className="text-2xl font-black text-white">8.4k</div>
            <div className="text-xs text-[#FFB347] mt-1 font-medium bg-[#FFB347]/10 inline-block px-2 py-1 rounded-full">Almost there</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 rotate-1 col-span-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center text-3xl">💊</div>
              <div>
                <div className="font-bold text-lg">Medications</div>
                <div className="text-sm text-white/50">All taken today!</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center">
              <Check className="text-[#00D4AA]" size={20} strokeWidth={3} />
            </div>
          </motion.div>
        </div>

        {/* Detailed View Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => pushScreen({ id: `health-score-${member.name}`, component: <HealthScoreScreen /> })}
          className={`w-full py-5 rounded-[24px] bg-gradient-to-r ${member.color} font-bold text-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 text-white`}
        >
          See Detailed Report <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
