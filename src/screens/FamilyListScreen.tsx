import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import FamilyMemberScoreScreen from './FamilyMemberScoreScreen';

export const FAMILY_MEMBERS = [
  { name: 'Rahul', relation: 'Self', score: 78, color: 'from-[#6C63FF] to-[#00D4AA]', goal: 'Reduce blood pressure' },
  { name: 'Sneha', relation: 'Spouse', score: 92, color: 'from-[#00D4AA] to-[#A8FF78]', goal: 'Maintain active lifestyle' },
  { name: 'Kamla', relation: 'Mother', score: 65, color: 'from-[#FFB347] to-[#FF6B6B]', goal: 'Improve joint mobility' },
];

export default function FamilyListScreen() {
  const { popScreen, pushScreen } = useNavigation();

  return (
    <div className="min-h-full w-full bg-[#0A0A0A] text-white pb-10 font-sans">
      <style>{`
        @keyframes spinY {
          0% { transform: perspective(400px) rotateY(0deg); }
          100% { transform: perspective(400px) rotateY(360deg); }
        }
        .crown-3d {
          display: inline-block;
          animation: spinY 3s linear infinite;
          transform-style: preserve-3d;
        }
      `}</style>
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-[#0A0A0A]/80 backdrop-blur-md">
        <button onClick={popScreen} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Family Health</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 pt-4 space-y-4">
        {[...FAMILY_MEMBERS].sort((a, b) => b.score - a.score).map((member, i) => (
          <motion.button
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => pushScreen({ id: `family-${member.name}`, component: <FamilyMemberScoreScreen member={member} /> })}
            className="w-full bg-[#141414] border border-white/5 rounded-[32px] p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} p-[2px] relative`}>
                {i === 0 && (
                  <div className="absolute -top-4 -right-3 text-3xl crown-3d drop-shadow-lg">👑</div>
                )}
                <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center font-display font-bold text-xl">
                  {member.name[0]}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-sm text-white/50 font-medium">{member.relation}</p>
                <p className="text-xs text-white/70 mt-1">Goal: {member.goal}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-black" style={{ color: member.color.split(' ')[1].replace('to-[', '').replace(']', '') }}>
                  {member.score}
                </div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Rank #{i + 1}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <ArrowRight size={16} className="text-white/50" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
