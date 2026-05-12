import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, User, HeartPulse, MoreVertical } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

const FAMILY_MEMBERS = [
  { id: 1, name: 'Priya Verma', relation: 'Wife', age: 30, blood: 'A+', avatar: 'https://picsum.photos/seed/priya/200/200' },
  { id: 2, name: 'Aarav Verma', relation: 'Son', age: 8, blood: 'O+', avatar: 'https://picsum.photos/seed/aarav/200/200' },
  { id: 3, name: 'Sunita Verma', relation: 'Mother', age: 62, blood: 'B+', avatar: 'https://picsum.photos/seed/sunita/200/200' },
];

export default function FamilyMembersScreen() {
  const { popScreen } = useNavigation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Family Members</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-4 py-6 space-y-4">
        {FAMILY_MEMBERS.map((member, i) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-3xl border border-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#8B8FA8]">
                  <span className="bg-white/5 px-2 py-0.5 rounded-md">{member.relation}</span>
                  <span>{member.age} yrs</span>
                  <span>•</span>
                  <span className="flex items-center text-[#FF6B6B]"><HeartPulse size={12} className="mr-1" /> {member.blood}</span>
                </div>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B8FA8] hover:bg-white/5">
              <MoreVertical size={18} />
            </button>
          </motion.div>
        ))}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-white/10 text-[#8B8FA8] font-bold flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add Family Member
        </motion.button>
      </div>
    </div>
  );
}
