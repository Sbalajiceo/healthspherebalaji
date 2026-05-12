import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Home, MapPin, CheckCircle2, Beaker } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const LAB_TESTS = [
  { id: 'cbc',    name: 'Complete Blood Count (CBC)',       price: 299, turnaround: '6 hrs',  category: 'Blood' },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)',      price: 499, turnaround: '12 hrs', category: 'Diabetes' },
  { id: 'lipid', name: 'Lipid Profile',                    price: 599, turnaround: '12 hrs', category: 'Heart' },
  { id: 'tsh',   name: 'Thyroid (TSH, T3, T4)',            price: 799, turnaround: '24 hrs', category: 'Thyroid' },
  { id: 'sugar', name: 'Fasting Blood Sugar',              price: 199, turnaround: '4 hrs',  category: 'Diabetes' },
  { id: 'vitd',  name: 'Vitamin D3 (25-OH)',               price: 999, turnaround: '24 hrs', category: 'Vitamins' },
  { id: 'kidney',name: 'Kidney Function (KFT)',            price: 699, turnaround: '12 hrs', category: 'Kidney' },
  { id: 'liver', name: 'Liver Function (LFT)',             price: 699, turnaround: '12 hrs', category: 'Liver' },
  { id: 'uric',  name: 'Uric Acid',                        price: 249, turnaround: '6 hrs',  category: 'Joints' },
  { id: 'covid', name: 'COVID-19 RT-PCR',                  price: 399, turnaround: '6 hrs',  category: 'Viral' },
];

const DATES = ['Today', 'Tomorrow', 'Wed 21', 'Thu 22', 'Fri 23'];
const TIME_SLOTS = ['07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '05:30 PM'];

export default function LabBookingScreen() {
  const { popScreen } = useNavigation();
  const [step, setStep] = useState(1);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [collectionType, setCollectionType] = useState<'home' | 'walkin' | ''>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const toggleTest = (id: string) =>
    setSelectedTests(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const selectedTestObjects = LAB_TESTS.filter(t => selectedTests.includes(t.id));
  const totalPrice = selectedTestObjects.reduce((sum, t) => sum + t.price, 0);

  const canProceed =
    (step === 1 && selectedTests.length > 0) ||
    (step === 2 && !!collectionType) ||
    (step === 3 && !!selectedDate && !!selectedTime);

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button
          onClick={step > 1 && step < 4 ? () => setStep(s => s - 1) : popScreen}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">Book Lab Test</h1>
          {step < 4 && (
            <div className="flex gap-1.5 mt-1.5">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#6C63FF]' : 'bg-white/10'} ${s === step ? 'w-8' : 'w-3'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
        <AnimatePresence mode="wait">

          {/* Step 1: Choose Tests */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-4 py-6">
              <h2 className="font-display text-2xl font-bold mb-1">Select Tests</h2>
              <p className="text-[#8B8FA8] text-sm mb-6">Choose one or more. Home collection available.</p>
              <div className="space-y-3">
                {LAB_TESTS.map(test => {
                  const sel = selectedTests.includes(test.id);
                  return (
                    <button
                      key={test.id}
                      onClick={() => toggleTest(test.id)}
                      className={`w-full p-4 rounded-2xl flex items-center text-left border transition-all ${sel ? 'bg-[#6C63FF]/10 border-[#6C63FF]/50' : 'glass-card border-white/5'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${sel ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-[#8B8FA8]'}`}>
                        <Beaker size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate">{test.name}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">Results in {test.turnaround} · {test.category}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className={`font-bold ${sel ? 'text-[#6C63FF]' : 'text-white'}`}>₹{test.price}</p>
                        {sel && (
                          <div className="w-4 h-4 rounded-full bg-[#6C63FF] flex items-center justify-center ml-auto mt-1">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Collection Type */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-4 py-6">
              <h2 className="font-display text-2xl font-bold mb-1">Collection Type</h2>
              <p className="text-[#8B8FA8] text-sm mb-6">How would you like to provide your sample?</p>
              <div className="space-y-4">
                <button
                  onClick={() => setCollectionType('home')}
                  className={`w-full p-5 rounded-2xl flex items-start text-left border transition-all ${collectionType === 'home' ? 'bg-[#00D4AA]/10 border-[#00D4AA]/50' : 'glass-card border-white/5'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shrink-0 transition-colors ${collectionType === 'home' ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-white/5 text-[#8B8FA8]'}`}>
                    <Home size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Home Collection</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">Our phlebotomist visits your home to collect samples.</p>
                    <span className="inline-block mt-2 text-xs font-bold text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full">FREE home visit</span>
                  </div>
                </button>

                <button
                  onClick={() => setCollectionType('walkin')}
                  className={`w-full p-5 rounded-2xl flex items-start text-left border transition-all ${collectionType === 'walkin' ? 'bg-[#6C63FF]/10 border-[#6C63FF]/50' : 'glass-card border-white/5'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shrink-0 transition-colors ${collectionType === 'walkin' ? 'bg-[#6C63FF]/20 text-[#6C63FF]' : 'bg-white/5 text-[#8B8FA8]'}`}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Walk-in Centre</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">Visit our diagnostic centre directly.</p>
                    <span className="inline-block mt-2 text-xs font-bold text-[#FFB347] bg-[#FFB347]/10 px-2 py-0.5 rounded-full">JSS Diagnostics, HSR Layout</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-4 py-6">
              <h2 className="font-display text-2xl font-bold mb-1">Pick a Slot</h2>
              <p className="text-[#8B8FA8] text-sm mb-6">Choose when you'd like your sample collected.</p>

              <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Date</p>
              <div className="flex overflow-x-auto pb-3 -mx-4 px-4 gap-3 no-scrollbar mb-6">
                {DATES.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-5 py-3 rounded-full whitespace-nowrap font-bold text-sm transition-all shrink-0 ${selectedDate === d ? 'bg-primary-gradient text-white' : 'glass-card text-[#8B8FA8]'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] mb-3">Time</p>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${selectedTime === t ? 'bg-[#00D4AA]/20 border border-[#00D4AA] text-[#00D4AA]' : 'glass-card text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-4 py-12 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mb-6 relative"
              >
                <motion.div className="absolute inset-0 rounded-full bg-[#00D4AA]/20 animate-ping" />
                <CheckCircle2 size={48} className="text-[#00D4AA] relative z-10" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold mb-2">Booked!</h2>
              <p className="text-[#8B8FA8] mb-8 px-4">
                Your tests are scheduled for <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedTime}</strong>.
              </p>

              <div className="w-full glass-card rounded-2xl p-5 mb-4 text-left space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8]">Tests Booked</p>
                {selectedTestObjects.map(t => (
                  <div key={t.id} className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{t.name}</span>
                    <span className="text-sm font-bold text-[#00D4AA]">₹{t.price}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#6C63FF]">₹{totalPrice}</span>
                </div>
              </div>

              <div className="w-full glass-card rounded-2xl p-4 mb-8 text-left border border-[#6C63FF]/20">
                <p className="text-xs text-[#8B8FA8] mb-1">Collection</p>
                <p className="font-bold">{collectionType === 'home' ? '🏠 Home Collection' : '🏥 JSS Diagnostics, HSR Layout'}</p>
              </div>

              <button
                onClick={popScreen}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky CTA */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#0A0A0F] to-transparent">
          {step === 1 && selectedTests.length > 0 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#8B8FA8]">{selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} selected</span>
              <span className="font-bold text-[#6C63FF]">₹{totalPrice}</span>
            </div>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="w-full h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 bg-primary-gradient text-white shadow-[0_8px_32px_rgba(108,99,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {step === 3 ? 'Confirm Booking' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
