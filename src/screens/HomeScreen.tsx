import { motion } from 'motion/react';
import { Activity, Calendar, Droplet, HeartPulse, Pill, Stethoscope, Bell } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import ProfileScreen from './ProfileScreen';
import HealthScoreScreen from './HealthScoreScreen';
import FamilyListScreen, { FAMILY_MEMBERS } from './FamilyListScreen';
import FamilyMemberScoreScreen from './FamilyMemberScoreScreen';
import MedicationReminderScreen from './MedicationReminderScreen';
import MedicineDetailScreen from './MedicineDetailScreen';

export default function HomeScreen({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { pushScreen } = useNavigation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-6 space-y-6 pb-32"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Good morning, Sandeep 👋</h1>
          <p className="text-[#8B8FA8] text-sm mt-1">Ready to crush your goals today?</p>
        </div>
        <button 
          onClick={() => pushScreen({ id: 'profile', component: <ProfileScreen /> })}
          className="w-12 h-12 rounded-full bg-primary-gradient p-[2px] transition-transform hover:scale-105"
        >
          <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center overflow-hidden">
            <img 
              src="https://picsum.photos/seed/sandeep/100/100"
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>
      </header>

      {/* Hero Health Score */}
      <motion.div 
        onClick={() => pushScreen({ id: 'health-score', component: <HealthScoreScreen member={FAMILY_MEMBERS.find(m => m.name === 'Sandeep')} /> })}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(108,99,255,0.15)" }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gradient opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-[#8B8FA8] text-sm font-medium uppercase tracking-wider">Health Score</h2>
            <div className="flex items-baseline mt-2">
              <span className="font-mono text-6xl font-bold text-white">78</span>
              <span className="font-mono text-xl text-[#8B8FA8] ml-1">/100</span>
            </div>
            <p className="text-sm text-[#00D4AA] mt-2 flex items-center">
              <Activity size={14} className="mr-1" /> +2 points this week
            </p>
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <motion.circle 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 55.26 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Refill Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-gradient rounded-full p-[1px] overflow-hidden"
      >
        <div className="bg-[#13131A]/90 backdrop-blur-md rounded-full pl-5 pr-2 py-1 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FFB347]/20 flex items-center justify-center mr-3">
              <Pill size={16} className="text-[#FFB347]" />
            </div>
            <span className="text-sm font-medium">Amlodipine running low (3 days left)</span>
          </div>
          <button 
            onClick={() => pushScreen({ 
              id: 'med_detail_amlodipine', 
              component: <MedicineDetailScreen medicine={{
                brand_name: 'Amlong 5mg',
                salt_name: 'Amlodipine (5mg)',
                generic_available: true,
                brand_price_inr: 45,
                generic_price_inr: 15,
                savings_inr: 30,
                image: null
              }} /> 
            })}
            className="text-xs font-bold uppercase tracking-wider text-[#FFB347] hover:text-white transition-colors h-11 px-3 flex items-center justify-center"
          >
            Refill
          </button>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Stethoscope, label: 'Consult', color: 'from-[#6C63FF] to-[#8B8FA8]', delay: 0.3, id: 'consult' },
          { icon: Pill, label: 'Pharmacy', color: 'from-[#00D4AA] to-[#008A70]', delay: 0.35, id: 'medicines' },
          { icon: Droplet, label: 'Book Lab', color: 'from-[#FF6B9D] to-[#FF9F7F]', delay: 0.4, id: 'records' },
          { icon: HeartPulse, label: 'Vitals', color: 'from-[#FFB347] to-[#FF6B6B]', delay: 0.45, id: 'wellness' },
          { icon: Bell, label: 'Reminders', color: 'from-[#9D4DFF] to-[#8D45E6]', delay: 0.5, id: 'reminders', isScreen: true },
          { icon: Activity, label: 'Health Score', color: 'from-[#FF6B6B] to-[#E55A5A]', delay: 0.55, id: 'health-score', isScreen: true },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            onClick={() => {
              if (action.isScreen) {
                if (action.id === 'health-score') {
                  pushScreen({ id: 'health-score', component: <HealthScoreScreen member={FAMILY_MEMBERS.find(m => m.name === 'Sandeep')} /> });
                } else if (action.id === 'reminders') {
                  pushScreen({ id: 'reminders', component: <MedicationReminderScreen /> });
                }
              } else {
                setActiveTab(action.id);
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: action.delay }}
            whileHover={{ scale: 1.02, translateZ: 10 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-4 flex flex-col items-center justify-center text-center group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} className="text-white" />
            </div>
            <span className="font-medium text-xs">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Family Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-display text-lg font-bold">Family Health</h3>
          <button 
            onClick={() => pushScreen({ id: 'family-list', component: <FamilyListScreen /> })}
            className="text-xs text-[#8B8FA8] font-medium h-11 px-2 flex items-center justify-center"
          >
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 no-scrollbar">
          {FAMILY_MEMBERS.map((member, i) => (
            <button 
              key={member.name} 
              onClick={() => pushScreen({ id: `family-${member.name}`, component: <FamilyMemberScoreScreen member={member} /> })}
              className="flex flex-col items-center shrink-0"
            >
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="46"
                    fill="transparent"
                    stroke={`url(#grad-family-${i})`}
                    strokeWidth="8"
                    strokeDasharray="289"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * member.score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 + i * 0.2 }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id={`grad-family-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={member.color.split(' ')[0].replace('from-[', '').replace(']', '')} />
                      <stop offset="100%" stopColor={member.color.split(' ')[1].replace('to-[', '').replace(']', '')} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#13131A] flex items-center justify-center font-display font-bold text-sm">
                    {member.name[0]}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold">{member.name}</span>
              <span className="text-[10px] text-[#8B8FA8]">{member.relation}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Appointment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-display text-lg font-bold mb-3">Upcoming</h3>
        <div className="glass-card p-0 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-gradient" />
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#FF6B9D] flex items-center justify-center text-lg font-bold font-display mr-3">
                  P
                </div>
                <div>
                  <h4 className="font-bold">Dr. Priya Sharma</h4>
                  <p className="text-xs text-[#8B8FA8]">Cardiologist • JS Global Hospital</p>
                </div>
              </div>
              <div className="bg-[#6C63FF]/20 text-[#6C63FF] text-xs font-bold px-2 py-1 rounded-md flex items-center">
                <Calendar size={12} className="mr-1" /> Today, 4:30 PM
              </div>
            </div>
            <button className="w-full bg-primary-gradient rounded-full py-3 font-bold text-sm shadow-[0_4px_24px_rgba(108,99,255,0.4)] hover:scale-[1.02] transition-transform">
              Join Video Consult
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
