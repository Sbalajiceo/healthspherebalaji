import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, Lock, Eye, Shield, Smartphone, Globe, Moon } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

export default function SettingsPrivacyScreen() {
  const { popScreen } = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [location, setLocation] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Settings & Privacy</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* General Settings */}
        <div>
          <h2 className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-4 px-2">General Settings</h2>
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8FF78]">
                  <Bell size={16} />
                </div>
                <span className="font-bold text-sm">Push Notifications</span>
              </div>
              <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8FF78]">
                  <Moon size={16} />
                </div>
                <span className="font-bold text-sm">Dark Mode</span>
              </div>
              <Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8FF78]">
                  <Globe size={16} />
                </div>
                <span className="font-bold text-sm">Language</span>
              </div>
              <span className="text-sm font-bold text-[#8B8FA8]">English (US)</span>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div>
          <h2 className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-4 px-2">Privacy & Security</h2>
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#6C63FF]">
                  <Lock size={16} />
                </div>
                <span className="font-bold text-sm">Biometric Authentication</span>
              </div>
              <Toggle checked={biometrics} onChange={() => setBiometrics(!biometrics)} />
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#6C63FF]">
                  <Shield size={16} />
                </div>
                <span className="font-bold text-sm">Location Services</span>
              </div>
              <Toggle checked={location} onChange={() => setLocation(!location)} />
            </div>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#6C63FF]">
                  <Eye size={16} />
                </div>
                <span className="font-bold text-sm">Data Sharing Preferences</span>
              </div>
              <ChevronLeft size={16} className="text-[#8B8FA8] rotate-180" />
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-4">
          <button className="w-full py-4 rounded-2xl font-bold text-sm text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 hover:bg-[#FF6B6B]/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
