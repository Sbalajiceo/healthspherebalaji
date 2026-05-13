import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Video, Phone, MessageSquare, Calendar, Clock, CheckCircle2, MapPin, CreditCard, Wallet, Building2, ArrowRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useAppointments } from '../contexts/AppointmentsContext';
import ChatScreen from './ChatScreen';
import WaitingRoomScreen from './WaitingRoomScreen';

const PRICE_MAP: Record<string, number> = { video: 500, audio: 300, chat: 200, physical: 500 };

const REVIEWS = [
  { text: '"Very patient and explained everything clearly. Highly recommend!"', time: '2 days ago' },
  { text: '"Diagnosed my issue quickly and prescribed the right treatment."', time: '1 week ago' },
  { text: '"Best online consultation I\'ve had. Will definitely return."', time: '2 weeks ago' },
];

const getDates = (): string[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    if (i === 0) return 'Today';
    if (i === 1) return 'Tomorrow';
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return `${days[d.getDay()]} ${d.getDate()}`;
  });
};

export default function DoctorProfileScreen({
  doctor,
  consultType,
  preSelectedType,
}: {
  doctor: any;
  consultType?: string | null;
  preSelectedType?: string;
}) {
  const { pushScreen, popScreen } = useNavigation();
  const { addAppointment } = useAppointments();

  const initialType = consultType === 'PHYSICAL' ? 'physical' : (preSelectedType ?? '');
  const initialStep = consultType === 'PHYSICAL' || preSelectedType ? 2 : 1;

  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const dates = getDates();
  const consultPrice = PRICE_MAP[selectedType?.toLowerCase()] ?? 500;

  useEffect(() => {
    if (preSelectedType) setShowBooking(true);
  }, []);

  const handlePayment = () => {
    addAppointment({
      doctorName: doctor.name,
      doctorSpec: doctor.spec,
      doctorInitials: doctor.initials,
      doctorColor: doctor.color,
      selectedDate,
      selectedTime,
      selectedType: selectedType || consultType || 'video',
    });
    setIsSuccess(true);
  };

  const openChat = () => {
    setShowBooking(false);
    pushScreen({ id: `chat-${doctor.name}`, component: <ChatScreen doctor={doctor} /> });
  };

  const openWaitingRoom = () => {
    setShowBooking(false);
    pushScreen({ id: `waiting-${doctor.name}`, component: <WaitingRoomScreen doctor={doctor} /> });
  };

  const feeDisplay = selectedType
    ? `₹${PRICE_MAP[selectedType.toLowerCase()] ?? 500}`
    : '₹200–₹500';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24 relative">
      {/* Hero */}
      <div className={`h-64 bg-gradient-to-br ${doctor.color} relative p-6 flex flex-col justify-between`}>
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white mt-4">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-end">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-[#0A0A0F] flex items-center justify-center text-4xl font-bold font-display shadow-xl">
            {doctor.initials}
          </div>
          <div className="ml-4 mb-2">
            <h1 className="font-display text-2xl font-bold text-white">{doctor.name}</h1>
            <p className="text-white/80 font-medium">{doctor.spec}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 glass-card p-4 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold text-[#6C63FF]">{doctor.exp}</span>
            <span className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mt-1">Experience</span>
          </div>
          <div className="flex-1 glass-card p-4 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold text-[#00D4AA]">{feeDisplay}</span>
            <span className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mt-1">Consult Fee</span>
          </div>
          <div className="flex-1 glass-card p-4 flex flex-col items-center justify-center">
            <div className="flex items-center text-[#FFB347]">
              <Star size={14} className="fill-[#FFB347] mr-1" />
              <span className="font-mono text-xl font-bold">{doctor.rating}</span>
            </div>
            <span className="text-[10px] text-[#8B8FA8] uppercase tracking-wider mt-1">120 Reviews</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#6C63FF] text-xs font-bold">Expert</span>
          <span className="px-3 py-1.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-bold">Top Rated</span>
          <span className="px-3 py-1.5 rounded-full bg-[#FFB347]/10 border border-[#FFB347]/30 text-[#FFB347] text-xs font-bold">15000+ Consultations</span>
        </div>

        {/* Languages */}
        {doctor.lang && (
          <div>
            <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-3">Speaks</h3>
            <div className="flex gap-2">
              {doctor.lang.split(', ').map((l: string) => (
                <span key={l} className="glass-card px-4 py-2 text-sm font-medium">{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* About */}
        <div>
          <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-3">About</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            {doctor.name} is a highly experienced {doctor.spec} with over {doctor.exp} of clinical practice. Specialises in accurate diagnosis and compassionate patient care.
          </p>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-3">Patient Reviews</h3>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 no-scrollbar">
            {REVIEWS.map((r, i) => (
              <div key={i} className="w-64 shrink-0 glass-card p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-[#FFB347]">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-[#FFB347]" />)}
                  </div>
                  <span className="text-xs text-[#8B8FA8] ml-2">{r.time}</span>
                </div>
                <p className="text-sm text-white/90">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent z-40 max-w-[390px] mx-auto">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBooking(true)}
          className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
        >
          Book Appointment
        </motion.button>
      </div>

      {/* Booking Bottom Sheet */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10 min-h-[60vh] flex flex-col max-w-[390px] mx-auto w-full">
              {!isSuccess ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-display text-2xl font-bold">Book Appointment</h2>
                    <button onClick={() => setShowBooking(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
                  </div>

                  {/* Step 1: Select Type */}
                  {bookingStep === 1 && (
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-4">Select Type</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'video', icon: Video,          label: 'Video', price: '₹500' },
                          { id: 'audio', icon: Phone,          label: 'Audio', price: '₹300' },
                          { id: 'chat',  icon: MessageSquare,  label: 'Chat',  price: '₹200' },
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-4 rounded-2xl flex flex-col items-center justify-center border transition-all ${selectedType === type.id ? 'bg-[#6C63FF]/20 border-[#6C63FF]' : 'bg-white/5 border-white/10'}`}
                          >
                            <type.icon size={24} className={`mb-2 ${selectedType === type.id ? 'text-[#6C63FF]' : 'text-[#8B8FA8]'}`} />
                            <span className="text-sm font-bold">{type.label}</span>
                            <span className="text-xs text-[#8B8FA8] mt-1">{type.price}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        disabled={!selectedType}
                        onClick={() => setBookingStep(2)}
                        className={`w-full h-14 rounded-full font-bold mt-8 transition-all ${selectedType ? 'bg-primary-gradient text-white' : 'bg-white/10 text-[#8B8FA8]'}`}
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {/* Step 2: Date & Time */}
                  {bookingStep === 2 && (
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-4">Select Date</h3>
                      <div className="flex overflow-x-auto pb-4 -mx-6 px-6 gap-3 no-scrollbar">
                        {dates.map(date => (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`px-6 py-3 rounded-full whitespace-nowrap font-bold transition-all ${selectedDate === date ? 'bg-primary-gradient text-white' : 'glass-card text-[#8B8FA8]'}`}
                          >
                            {date}
                          </button>
                        ))}
                      </div>

                      <h3 className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider mb-4 mt-4">Select Time</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'].map((time, i) => {
                          const isAvailable = i !== 2 && i !== 4;
                          return (
                            <button
                              key={time}
                              disabled={!isAvailable}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 rounded-xl text-sm font-bold transition-all ${!isAvailable ? 'bg-white/5 text-white/20 cursor-not-allowed' : selectedTime === time ? 'bg-[#00D4AA]/20 border border-[#00D4AA] text-[#00D4AA]' : 'glass-card text-white'}`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setBookingStep(3)}
                        className={`w-full h-14 rounded-full font-bold mt-8 transition-all ${selectedDate && selectedTime ? 'bg-primary-gradient text-white shadow-[0_8px_32px_rgba(108,99,255,0.3)]' : 'bg-white/10 text-[#8B8FA8]'}`}
                      >
                        Continue to Pay ₹{consultPrice}
                      </button>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {bookingStep === 3 && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center mb-6">
                        <button onClick={() => setBookingStep(2)} className="mr-3 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                          <ChevronLeft size={16} />
                        </button>
                        <h3 className="text-lg font-bold text-white">Payment Method</h3>
                      </div>

                      <div className="space-y-3 flex-1">
                        {[
                          { id: 'upi',        icon: Wallet,     label: 'UPI (GPay, PhonePe, Paytm)', desc: 'Pay directly from your bank account' },
                          { id: 'card',       icon: CreditCard, label: 'Credit / Debit Card',         desc: 'Visa, Mastercard, RuPay' },
                          { id: 'netbanking', icon: Building2,  label: 'Netbanking',                  desc: 'All major Indian banks supported' },
                        ].map(method => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`w-full p-4 rounded-2xl flex items-center text-left border transition-all ${selectedPayment === method.id ? 'bg-[#00D4AA]/10 border-[#00D4AA]' : 'bg-white/5 border-white/10'}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${selectedPayment === method.id ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-white/10 text-[#8B8FA8]'}`}>
                              <method.icon size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-white">{method.label}</h4>
                              <p className="text-xs text-[#8B8FA8] mt-0.5">{method.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-[#00D4AA]' : 'border-[#8B8FA8]'}`}>
                              {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={!selectedPayment}
                        onClick={handlePayment}
                        className={`w-full h-14 rounded-full font-bold mt-8 transition-all flex items-center justify-center ${selectedPayment ? 'bg-[#00D4AA] text-black shadow-[0_8px_32px_rgba(0,212,170,0.3)]' : 'bg-white/10 text-[#8B8FA8]'}`}
                      >
                        Pay ₹{consultPrice} Securely
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-[#00D4AA]/20 flex items-center justify-center mb-6 relative"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="absolute inset-0 rounded-full bg-[#00D4AA]/20 animate-ping"
                    />
                    <CheckCircle2 size={48} className="text-[#00D4AA] relative z-10" />
                  </motion.div>
                  <h2 className="font-display text-3xl font-bold mb-2 text-white">Booking Confirmed!</h2>
                  <p className="text-[#8B8FA8] mb-6 px-4">
                    Your {selectedType} consultation with {doctor.name} is scheduled for{' '}
                    <strong className="text-white">{selectedDate}</strong> at{' '}
                    <strong className="text-white">{selectedTime}</strong>.
                  </p>

                  {consultType === 'PHYSICAL' ? (
                    <div className="w-full bg-[#1A1A24] rounded-2xl p-4 mb-6 text-left border border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center shrink-0 mt-1">
                          <MapPin size={20} className="text-[#6C63FF]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm mb-1">Clinic Address</h4>
                          <p className="text-xs text-[#8B8FA8] leading-relaxed mb-3">
                            Apollo Spectra Hospitals, 12th Main Rd, Sector 6, HSR Layout, Bengaluru, Karnataka 560102
                          </p>
                          <button
                            onClick={() => window.open('https://maps.google.com/?q=Apollo+Spectra+Hospitals+HSR+Layout+Bengaluru', '_blank')}
                            className="text-[#00D4AA] text-sm font-bold flex items-center"
                          >
                            Locate Now <ArrowRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-[#1A1A24] rounded-2xl p-4 mb-6 text-left border border-white/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-bold text-xl">
                            {doctor.initials}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00D4AA] border-2 border-[#1A1A24] rounded-full" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{doctor.name}</h4>
                          <p className="text-[#00D4AA] text-xs font-medium">Online • Ready for consultation</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={openChat} className="flex-1 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-bold text-sm flex items-center justify-center">
                          <MessageSquare size={16} className="mr-2" /> Go to Chat
                        </button>
                        <button onClick={openWaitingRoom} className="flex-1 h-12 rounded-xl bg-[#6C63FF] text-white font-bold text-sm flex items-center justify-center shadow-[0_4px_14px_rgba(108,99,255,0.4)]">
                          <Video size={16} className="mr-2" /> Waiting Room
                        </button>
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setShowBooking(false); popScreen(); }} className="w-full h-14 rounded-full glass-card font-bold text-white">
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
