import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CreditCard, Plus, CheckCircle2, MoreVertical } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

const CARDS = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', isDefault: true, color: 'from-[#1A1F35] to-[#2B3252]' },
  { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/26', isDefault: false, color: 'from-[#FF6B6B] to-[#FF8E53]' },
];

export default function PaymentMethodsScreen() {
  const { popScreen } = useNavigation();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-display text-xl font-bold">Payment Methods</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center text-[#FF6B9D]">
          <Plus size={20} />
        </button>
      </div>

      <div className="px-4 py-6 space-y-6">
        {CARDS.map((card, i) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-3xl p-6 bg-gradient-to-br ${card.color} relative overflow-hidden shadow-xl`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <CreditCard size={24} className="text-white/80" />
                <span className="font-bold text-lg tracking-wider">{card.type}</span>
              </div>
              {card.isDefault && (
                <div className="flex items-center text-xs font-bold bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                  <CheckCircle2 size={12} className="mr-1" /> Default
                </div>
              )}
            </div>

            <div className="font-mono text-2xl tracking-[0.2em] mb-6 relative z-10">
              **** **** **** {card.last4}
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Card Holder</div>
                <div className="font-bold tracking-wide">RAHUL VERMA</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Expires</div>
                <div className="font-mono font-bold">{card.expiry}</div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-white/10 text-[#8B8FA8] font-bold flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add New Card
        </motion.button>

        <div className="pt-6 border-t border-white/5">
          <h3 className="font-bold text-lg mb-4">Transaction History</h3>
          <div className="space-y-4">
            {[
              { title: 'Dr. Consultation', date: 'Today, 10:30 AM', amount: '-$50.00', status: 'Completed' },
              { title: 'Pharmacy Bill', date: 'Yesterday, 4:15 PM', amount: '-$24.50', status: 'Completed' },
              { title: 'Lab Test', date: '24 Mar, 09:00 AM', amount: '-$120.00', status: 'Completed' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8B8FA8]">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tx.title}</h4>
                    <p className="text-xs text-[#8B8FA8]">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{tx.amount}</div>
                  <div className="text-[10px] text-[#00D4AA] font-bold uppercase tracking-wider">{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
