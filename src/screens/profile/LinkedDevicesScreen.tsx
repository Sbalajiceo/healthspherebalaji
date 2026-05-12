import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Watch, Activity, Smartphone, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

const DEVICES = [
  { id: 1, name: 'Apple Watch Series 8', type: 'Smartwatch', status: 'Connected', battery: '85%', lastSync: 'Just now', icon: Watch, color: 'text-[#00D4AA]' },
  { id: 2, name: 'Oura Ring Gen 3', type: 'Smart Ring', status: 'Connected', battery: '42%', lastSync: '2 hours ago', icon: Activity, color: 'text-[#6C63FF]' },
  { id: 3, name: 'Withings Body+', type: 'Smart Scale', status: 'Disconnected', battery: '15%', lastSync: '2 days ago', icon: Smartphone, color: 'text-[#FF6B6B]' },
];

export default function LinkedDevicesScreen() {
  const { popScreen } = useNavigation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Linked Devices</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#FFB347]/20 flex items-center justify-center text-[#FFB347]">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-4 py-6 space-y-4">
        {DEVICES.map((device, i) => (
          <motion.div 
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 rounded-3xl border border-white/5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${device.color}`}>
                  <device.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{device.name}</h3>
                  <p className="text-[#8B8FA8] text-sm">{device.type}</p>
                </div>
              </div>
              {device.status === 'Connected' ? (
                <div className="flex items-center text-[#00D4AA] text-xs font-bold bg-[#00D4AA]/10 px-2 py-1 rounded-md">
                  <CheckCircle2 size={12} className="mr-1" /> Connected
                </div>
              ) : (
                <div className="flex items-center text-[#FF6B6B] text-xs font-bold bg-[#FF6B6B]/10 px-2 py-1 rounded-md">
                  <AlertCircle size={12} className="mr-1" /> Disconnected
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Battery</div>
                <div className="font-mono text-sm font-bold">{device.battery}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">Last Sync</div>
                <div className="text-sm font-bold">{device.lastSync}</div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-white/10 text-[#8B8FA8] font-bold flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Pair New Device
        </motion.button>
      </div>
    </div>
  );
}
