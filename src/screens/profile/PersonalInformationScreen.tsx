import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Mail, Phone, MapPin, Calendar, Droplet, Edit2 } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

export default function PersonalInformationScreen() {
  const { popScreen } = useNavigation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Personal Info</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF]">
          <Edit2 size={18} />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] p-1 mb-4 relative">
            <div className="w-full h-full rounded-full bg-[#13131A] flex items-center justify-center overflow-hidden">
              <img 
                src="https://picsum.photos/seed/rahul/200/200" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#6C63FF] rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
              <Edit2 size={14} className="text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-center mb-1">
              <User size={16} className="text-[#8B8FA8] mr-2" />
              <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Full Name</span>
            </div>
            <div className="text-lg font-bold ml-6">Rahul Verma</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-center mb-1">
              <Mail size={16} className="text-[#8B8FA8] mr-2" />
              <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Email</span>
            </div>
            <div className="text-lg font-bold ml-6">rahul.verma@example.com</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-center mb-1">
              <Phone size={16} className="text-[#8B8FA8] mr-2" />
              <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Phone Number</span>
            </div>
            <div className="text-lg font-bold ml-6">+91 98765 43210</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/5">
              <div className="flex items-center mb-1">
                <Calendar size={16} className="text-[#8B8FA8] mr-2" />
                <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">DOB</span>
              </div>
              <div className="text-lg font-bold ml-6">12 Oct 1993</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-white/5">
              <div className="flex items-center mb-1">
                <Droplet size={16} className="text-[#8B8FA8] mr-2" />
                <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Blood</span>
              </div>
              <div className="text-lg font-bold ml-6">O+</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <div className="flex items-center mb-1">
              <MapPin size={16} className="text-[#8B8FA8] mr-2" />
              <span className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Address</span>
            </div>
            <div className="text-base font-bold ml-6 text-white/80">
              123 Tech Park, Sector 44<br/>
              Gurugram, Haryana 122003
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
