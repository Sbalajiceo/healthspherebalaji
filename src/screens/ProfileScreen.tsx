import React from 'react';
import { motion } from 'motion/react';
import { User, Users, Smartphone, CreditCard, Settings, HelpCircle, LogOut, ChevronRight, Activity, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import PersonalInformationScreen from './profile/PersonalInformationScreen';
import FamilyMembersScreen from './profile/FamilyMembersScreen';
import LinkedDevicesScreen from './profile/LinkedDevicesScreen';
import PaymentMethodsScreen from './profile/PaymentMethodsScreen';
import SettingsPrivacyScreen from './profile/SettingsPrivacyScreen';
import HelpSupportScreen from './profile/HelpSupportScreen';

export default function ProfileScreen() {
  const { popScreen, pushScreen } = useNavigation();

  const handleNavigation = (id: string, component: React.ReactNode) => {
    pushScreen({ id, component });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6 pb-32"
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={popScreen}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
      </div>

      <header className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] p-1 mb-4 shadow-[0_0_30px_rgba(108,99,255,0.3)]">
          <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center overflow-hidden">
            <img 
              src="https://picsum.photos/seed/rahul/200/200" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold">Rahul Verma</h1>
        <p className="text-[#8B8FA8] text-sm mt-1">32 yrs • Male • O+</p>
      </header>

      {/* Health Score Widget */}
      <div className="glass-card p-5 rounded-2xl flex items-center justify-between bg-gradient-to-r from-[#13131A] to-[#1A1A24] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4AA]/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div>
          <div className="flex items-center text-[#8B8FA8] text-xs font-bold uppercase tracking-wider mb-1">
            <Activity size={14} className="mr-1 text-[#00D4AA]" /> Health Score
          </div>
          <div className="flex items-baseline">
            <span className="font-mono text-3xl font-bold text-white">850</span>
            <span className="text-[#8B8FA8] text-sm ml-1">/1000</span>
          </div>
        </div>
        <div className="bg-[#00D4AA]/20 text-[#00D4AA] px-3 py-1 rounded-full text-xs font-bold border border-[#00D4AA]/30">
          Excellent
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {[
          { icon: User, label: 'Personal Information', color: 'text-[#6C63FF]', id: 'personal-info', component: <PersonalInformationScreen /> },
          { icon: Users, label: 'Family Members', color: 'text-[#00D4AA]', id: 'family-members', component: <FamilyMembersScreen /> },
          { icon: Smartphone, label: 'Linked Devices', color: 'text-[#FFB347]', id: 'linked-devices', component: <LinkedDevicesScreen /> },
          { icon: CreditCard, label: 'Payment Methods', color: 'text-[#FF6B9D]', id: 'payment-methods', component: <PaymentMethodsScreen /> },
          { icon: Settings, label: 'Settings & Privacy', color: 'text-[#A8FF78]', id: 'settings-privacy', component: <SettingsPrivacyScreen /> },
          { icon: HelpCircle, label: 'Help & Support', color: 'text-[#8B8FA8]', id: 'help-support', component: <HelpSupportScreen /> },
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => handleNavigation(item.id, item.component)}
            className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4`}>
                <item.icon size={20} className={item.color} />
              </div>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-[#8B8FA8]" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button className="w-full py-4 rounded-2xl font-bold text-sm text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 hover:bg-[#FF6B6B]/20 transition-colors flex items-center justify-center mt-8">
        <LogOut size={18} className="mr-2" /> Sign Out
      </button>
    </motion.div>
  );
}
