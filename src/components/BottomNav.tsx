import { Home, Stethoscope, Pill, ClipboardList, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'consult', icon: Stethoscope, label: 'Consult' },
  { id: 'medicines', icon: Pill, label: 'Medicines' },
  { id: 'records', icon: ClipboardList, label: 'Records' },
  { id: 'wellness', icon: Leaf, label: 'Wellness' },
];

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <div className="glass-card rounded-full px-2 py-3 flex justify-between items-center bg-[#13131A]/80">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex flex-col items-center justify-center w-16 h-12"
          >
            <Icon 
              size={24} 
              className={`mb-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#8B8FA8]'}`} 
            />
            {isActive && (
              <motion.div
                layoutId="navIndicator"
                className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${tab.id === 'wellness' ? 'bg-wellness-gradient' : 'bg-primary-gradient'}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
