import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';

type Reminder = {
  id: string;
  message: string;
};

type ReminderContextType = {
  showReminder: (message: string) => void;
  enablePlanReminders: (goals: string[]) => void;
  disablePlanReminders: () => void;
  remindersActive: boolean;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [activeToast, setActiveToast] = useState<Reminder | null>(null);
  const [remindersActive, setRemindersActive] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);

  const showReminder = (message: string) => {
    setActiveToast({ id: Date.now().toString(), message });
    setTimeout(() => setActiveToast(null), 5000);
  };

  const enablePlanReminders = (newGoals: string[]) => {
    setGoals(newGoals);
    setRemindersActive(true);
    showReminder("Daily reminders enabled for your wellness plan!");
  };

  const disablePlanReminders = () => {
    setRemindersActive(false);
    setGoals([]);
    showReminder("Reminders disabled.");
  };

  // Demo: trigger a reminder every 15 seconds if active
  useEffect(() => {
    if (!remindersActive || goals.length === 0) return;

    const interval = setInterval(() => {
      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      showReminder(`Time for your goal: ${randomGoal}`);
    }, 15000);

    return () => clearInterval(interval);
  }, [remindersActive, goals]);

  return (
    <ReminderContext.Provider value={{ showReminder, enablePlanReminders, disablePlanReminders, remindersActive }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none px-4">
        <AnimatePresence>
          {activeToast && (
            <motion.div
              key={activeToast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-[#13131A] border border-[#00C9A7]/50 shadow-[0_8px_32px_rgba(0,201,167,0.3)] rounded-2xl p-4 flex items-start max-w-[350px] w-full pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-full bg-[#00C9A7]/20 flex items-center justify-center mr-3 shrink-0">
                <Bell size={16} className="text-[#00C9A7]" />
              </div>
              <div className="flex-1 mr-2">
                <h4 className="text-sm font-bold text-white mb-1">Wellness Reminder</h4>
                <p className="text-xs text-white/80 leading-relaxed">{activeToast.message}</p>
              </div>
              <button onClick={() => setActiveToast(null)} className="text-[#8B8FA8] hover:text-white">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReminderContext.Provider>
  );
}

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) throw new Error('useReminders must be used within ReminderProvider');
  return context;
};
