import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trash2, CheckCircle2, ShoppingBag, Truck, CreditCard, Plus, Minus } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export default function CartScreen() {
  const { popScreen } = useNavigation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#111512] text-white pb-32 font-sans relative">
      <div className="sticky top-0 z-40 bg-[#111512]/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-[#1A201D] flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Your Cart</h1>
      </div>

      <AnimatePresence>
        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-6 space-y-6"
          >
            {/* Cart Items */}
            <div className="space-y-4">
              {[
                { name: 'Pan 40mg Tablet', salt: 'Pantoprazole', price: 155, qty: 1, savings: 0, image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop" },
                { name: 'Dolo 650 Tablet', salt: 'Paracetamol', price: 30, qty: 2, savings: 0, image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop" }
              ].map((item, i) => (
                <div key={i} className="bg-[#1A201D] rounded-3xl p-4 flex gap-4 relative">
                  <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="pr-2">
                        <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                        <p className="text-xs text-[#9CA3AF]">{item.salt}</p>
                      </div>
                      <button className="text-[#EF4444] p-1.5 rounded-full bg-white/5 hover:bg-[#EF4444]/20 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <div className="font-bold text-lg">₹{item.price * item.qty}</div>
                      <div className="inline-flex items-center bg-[#111512] rounded-full p-1 border border-white/5">
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-[#9CA3AF]">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                        <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 text-[#84CC16]">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Banner */}
            <div className="bg-[#84CC16]/10 p-4 rounded-2xl border border-[#84CC16]/20 flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#84CC16]/20 flex items-center justify-center mr-4">
                <CheckCircle2 size={20} className="text-[#84CC16]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#84CC16]">Total Savings</p>
                <p className="font-bold text-lg text-white">₹125</p>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-[#1A201D] rounded-3xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-[#9CA3AF] mb-4">Bill Details</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-[#9CA3AF]">Item Total</span>
                <span className="font-medium">₹215</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9CA3AF]">Delivery Fee</span>
                <span className="font-medium text-[#84CC16]">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#9CA3AF]">Taxes</span>
                <span className="font-medium">₹10</span>
              </div>
              
              <div className="h-px bg-white/10 my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>To Pay</span>
                <span className="text-[#84CC16]">₹225</span>
              </div>
            </div>

            {/* Sticky Checkout Button */}
            <div className="fixed bottom-6 left-0 right-0 px-5 z-40 max-w-[390px] mx-auto">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="w-full h-14 rounded-2xl bg-[#84CC16] text-[#111512] font-bold text-lg shadow-[0_8px_30px_rgba(132,204,22,0.3)] flex items-center justify-center"
              >
                <CreditCard size={20} className="mr-2" /> Place Order
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-12 flex flex-col items-center justify-center text-center h-full min-h-[60vh]"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-24 h-24 rounded-full bg-[#84CC16] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(132,204,22,0.4)]"
            >
              <CheckCircle2 size={48} className="text-[#111512]" />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
            <p className="text-[#9CA3AF] mb-8 max-w-[250px]">Your medicines will be delivered shortly.</p>
            
            <div className="bg-[#1A201D] rounded-3xl p-6 w-full mb-8 border border-white/5">
              <div className="flex items-center justify-center mb-4">
                <Truck size={24} className="text-[#84CC16] mr-3" />
                <span className="font-bold text-lg">Estimated Delivery</span>
              </div>
              <div className="text-2xl font-bold text-[#84CC16]">Today, 4:30 PM</div>
              <p className="text-xs text-[#9CA3AF] mt-2">Order ID: #MED-847291</p>
            </div>
            
            <button 
              onClick={popScreen}
              className="w-full h-14 rounded-2xl bg-[#1A201D] font-bold text-white hover:bg-white/10 transition-colors border border-white/5"
            >
              Back to Medicines
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
