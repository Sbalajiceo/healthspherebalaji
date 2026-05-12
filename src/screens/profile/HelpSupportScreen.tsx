import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MessageCircle, Phone, Mail, FileText, HelpCircle, ExternalLink } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

const FAQS = [
  { q: 'How do I add a new family member?', a: 'Go to Family Members in your profile and tap the + icon in the top right corner.' },
  { q: 'Can I sync my Apple Watch?', a: 'Yes, navigate to Linked Devices and select Pair New Device to connect your Apple Watch via HealthKit.' },
  { q: 'How is my health score calculated?', a: 'Your health score is a composite metric based on your daily activity, sleep patterns, vitals, and adherence to medication.' },
];

export default function HelpSupportScreen() {
  const { popScreen } = useNavigation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Help & Support</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Contact Options */}
        <div className="grid grid-cols-2 gap-4">
          <button className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors gap-3">
            <div className="w-12 h-12 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF]">
              <MessageCircle size={24} />
            </div>
            <div>
              <div className="font-bold text-sm">Live Chat</div>
              <div className="text-xs text-[#8B8FA8] mt-1">Typically replies in 5m</div>
            </div>
          </button>
          
          <button className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors gap-3">
            <div className="w-12 h-12 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
              <Phone size={24} />
            </div>
            <div>
              <div className="font-bold text-sm">Call Us</div>
              <div className="text-xs text-[#8B8FA8] mt-1">24/7 Support Line</div>
            </div>
          </button>
        </div>

        <button className="w-full glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFB347]">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">Email Support</div>
              <div className="text-xs text-[#8B8FA8]">support@aistudiohealth.com</div>
            </div>
          </div>
          <ExternalLink size={16} className="text-[#8B8FA8]" />
        </button>

        {/* FAQs */}
        <div>
          <h2 className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-4 px-2">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-white/5">
                <div className="flex gap-3 mb-2">
                  <HelpCircle size={18} className="text-[#6C63FF] shrink-0 mt-0.5" />
                  <h3 className="font-bold text-sm leading-tight">{faq.q}</h3>
                </div>
                <p className="text-sm text-[#8B8FA8] pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-4 px-2">Legal</h2>
          <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#8B8FA8]" />
                <span className="font-bold text-sm">Terms of Service</span>
              </div>
              <ChevronLeft size={16} className="text-[#8B8FA8] rotate-180" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#8B8FA8]" />
                <span className="font-bold text-sm">Privacy Policy</span>
              </div>
              <ChevronLeft size={16} className="text-[#8B8FA8] rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
