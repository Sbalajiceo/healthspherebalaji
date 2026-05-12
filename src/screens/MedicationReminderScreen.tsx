import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Settings, Check, X, Pill, ScanLine, SlidersHorizontal, Camera } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import AddMedicationScreen from './AddMedicationScreen';

export default function MedicationReminderScreen() {
  const { popScreen, pushScreen } = useNavigation();
  const [medications, setMedications] = useState<any[]>([]);
  const [showAddChoice, setShowAddChoice] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medications');
    if (saved) {
      setMedications(JSON.parse(saved));
    }
  }, []);

  const handleAddMedication = (med: any) => {
    setMedications(prev => {
      const newMeds = [...prev, med];
      localStorage.setItem('medications', JSON.stringify(newMeds));
      return newMeds;
    });
  };

  const toggleTaken = (id: string) => {
    setMedications(meds => {
      const newMeds = meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
      localStorage.setItem('medications', JSON.stringify(newMeds));
      return newMeds;
    });
  };

  const openAddForm = () => {
    setShowAddChoice(false);
    pushScreen({
      id: 'add-medication',
      component: <AddMedicationScreen onAdd={handleAddMedication} />
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Reminders</h1>
        </div>
        {medications.length > 0 && (
          <button 
            onClick={() => setShowAddChoice(true)}
            className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {medications.length === 0 ? (
        <div className="px-5 py-12 flex flex-col items-center justify-center text-center h-[70vh]">
          <div className="w-64 h-64 mb-8 relative flex items-center justify-center">
            {/* Blister Pack */}
            <div className="absolute w-48 h-24 bg-white/10 rounded-xl transform rotate-[-5deg] border border-white/10 backdrop-blur-sm">
              <div className="absolute top-2 left-4 w-6 h-6 text-[#FF6B6B] font-bold text-2xl flex items-center justify-center">+</div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-x-4 gap-y-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-3 h-6 bg-[#FF6B6B] rounded-full shadow-inner" />
                ))}
              </div>
            </div>
            
            {/* Pill Bottle */}
            <div className="absolute bottom-4 w-20 h-28 bg-gradient-to-br from-[#00D4AA] to-[#008A70] rounded-xl flex flex-col items-center justify-end pb-2 shadow-lg z-10">
              <div className="absolute -top-6 w-16 h-8 bg-white rounded-t-lg shadow-sm" />
              <div className="w-14 h-14 bg-white/90 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                <div className="absolute bottom-2 right-2 w-4 h-2 bg-white rounded-full shadow-sm rotate-45" />
                <div className="w-6 h-6 border-4 border-[#E5E7EB] rounded-full opacity-50" />
              </div>
            </div>

            {/* Band-aid */}
            <div className="absolute top-4 w-24 h-8 bg-gradient-to-r from-[#FFB347] to-[#FF9F7F] rounded-full transform rotate-[-5deg] flex items-center justify-center gap-3 shadow-md">
              <div className="w-2 h-2 rounded-full bg-black/20" />
              <div className="w-2 h-2 rounded-full bg-black/20" />
              <div className="w-2 h-2 rounded-full bg-black/20" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl font-bold mb-3">No Medications!</h2>
          <p className="text-[#8B8FA8] text-sm mb-10 max-w-[280px] leading-relaxed">
            You have 0 medications setup. Kindly setup a new one manually or scan with AI!
          </p>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddChoice(true)}
            className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
          >
            Add Medication <Plus size={20} className="ml-2" />
          </motion.button>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-6">
          <h2 className="font-display text-xl font-bold mb-4">Today's Schedule</h2>
          
          <div className="relative pl-6 border-l-2 border-white/10 space-y-8 ml-2">
            {[...medications].sort((a, b) => {
              const timeA = a.time || '08:00 AM';
              const timeB = b.time || '08:00 AM';
              
              // Convert to 24h format for sorting
              const get24h = (t: string) => {
                const match = t.match(/(\d+):(\d+)\s(AM|PM)/);
                if (!match) return 0;
                let h = parseInt(match[1]);
                if (match[3] === 'PM' && h < 12) h += 12;
                if (match[3] === 'AM' && h === 12) h = 0;
                return h * 60 + parseInt(match[2]);
              };
              
              return get24h(timeA) - get24h(timeB);
            }).map((med, i) => (
              <motion.div 
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-[#0A0A0F] ${med.taken ? 'bg-[#00D4AA]' : 'bg-[#6C63FF]'}`} />
                
                {/* Time Label */}
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-lg ${med.taken ? 'text-[#00D4AA]' : 'text-white'}`}>{med.time || '08:00 AM'}</span>
                  <span className="text-[10px] font-bold text-[#8B8FA8] uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md">{med.mealTiming}</span>
                  <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-wider px-2 py-1 bg-[#6C63FF]/10 rounded-md">
                    {med.recurrenceType === 'Specific Days' && med.selectedDays ? med.selectedDays.join(', ') : med.recurrenceType || 'Daily'}
                  </span>
                </div>

                {/* Card */}
                <div className={`glass-card rounded-3xl p-5 border ${med.taken ? 'border-[#00D4AA]/30 bg-[#00D4AA]/5' : 'border-white/5'} relative overflow-hidden`}>
                  {med.taken && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#00D4AA]/10 rounded-bl-full flex items-start justify-end p-3">
                      <Check size={16} className="text-[#00D4AA]" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${med.taken ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-white/5 text-[#8B8FA8]'}`}>
                      <Pill size={28} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg leading-tight ${med.taken ? 'text-white/70 line-through' : 'text-white'}`}>{med.name}</h3>
                      <p className="text-[#8B8FA8] text-sm mt-0.5">{med.dose}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="text-sm font-medium text-[#8B8FA8]">
                      {med.taken ? 'Taken' : 'Upcoming'}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleTaken(med.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${med.taken ? 'bg-white/5 text-[#8B8FA8]' : 'bg-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/30'}`}
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => toggleTaken(med.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${med.taken ? 'bg-[#00D4AA] text-[#0A0A0F]' : 'bg-[#00D4AA]/20 text-[#00D4AA] hover:bg-[#00D4AA]/30'}`}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Choice Bottom Sheet */}
      <AnimatePresence>
        {showAddChoice && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddChoice(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#13131A] rounded-t-3xl z-50 p-6 max-w-[390px] mx-auto border-t border-white/10"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              
              <h2 className="font-display text-2xl font-bold mb-2">Add Medication</h2>
              <p className="text-[#8B8FA8] text-sm mb-6">
                You can either manually add medication or let our AI decide based on your data.
              </p>
              
              <div className="space-y-4 mb-8">
                <button className="w-full glass-card rounded-2xl p-5 border border-white/5 flex flex-col items-start text-left hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <ScanLine size={20} className="text-[#8B8FA8]" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">Scan with AI</h3>
                  <p className="text-[#8B8FA8] text-sm">Setup medication/supplements based on our AI Scan, intuitively.</p>
                </button>
                
                <button 
                  onClick={openAddForm}
                  className="w-full glass-card rounded-2xl p-5 border border-[#00D4AA]/50 flex flex-col items-start text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#00D4AA]/5" />
                  <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center mb-3 relative z-10">
                    <SlidersHorizontal size={20} className="text-[#00D4AA]" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 relative z-10">Manual Setup</h3>
                  <p className="text-[#8B8FA8] text-sm relative z-10">Manually add new medications by yourself, have more control.</p>
                </button>
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={openAddForm}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
              >
                Continue <ChevronRight size={20} className="ml-2" />
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
