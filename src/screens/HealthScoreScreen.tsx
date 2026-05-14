import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Share, TrendingUp, Check, Clock, Droplet, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigation } from '../contexts/NavigationContext';
import MedicineDetailScreen from './MedicineDetailScreen';
import RecordsScreen from './RecordsScreen';
import WaitingRoomScreen from './WaitingRoomScreen';

const DR_DINESH = {
  name: 'Dr. Dinesh Kumar',
  initials: 'DK',
  spec: 'Cardiologist',
  hospital: 'JS Global Hospital',
  appointmentTime: 'Tomorrow, 10:30 AM',
};

const MEDS = [
  { id: 'amlodipine', name: 'Amlodipine 5mg',  dose: '5mg',  time: '8:00 AM', icon: '💊', stock: 'low'  },
  { id: 'metformin',  name: 'Metformin 500mg', dose: '500mg', time: '2:00 PM', icon: '💊', stock: 'ok'   },
  { id: 'vitamind',   name: 'Vitamin D3',       dose: '60K IU',time: 'Night',   icon: '💊', stock: 'ok'   },
];

// per-day taken pattern: index → [amlodipine taken, metformin taken, vitamind taken]
const DAY_PATTERNS: Record<string, boolean[]> = {
  t:     [true,  true,  true ],
  p:     [true,  false, false],
  r:     [false, false, false],
  today: [true,  false, false],
};

export default function HealthScoreScreen({ member }: { member?: any }) {
  const { popScreen, pushScreen } = useNavigation();
  const [currentWater, setCurrentWater] = useState(1400);
  const [activeVitalTab, setActiveVitalTab] = useState<'hr' | 'bp' | 'spo2' | 'sugar'>('hr');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [todayMedsTaken, setTodayMedsTaken] = useState<Record<string, boolean>>({
    amlodipine: true,
    metformin: false,
    vitamind: false,
  });
  const maxWater = 2500;

  const toggleTodayMed = (id: string) =>
    setTodayMedsTaken(prev => ({ ...prev, [id]: !prev[id] }));

  const defaultMember = { name: 'Sandeep', score: 78, color: 'from-[#0A8B8B] to-[#02C39A]' };
  const activeMember = member || defaultMember;
  const color1 = activeMember.color.split(' ')[0].replace('from-[', '').replace(']', '');
  const color2 = activeMember.color.split(' ')[1].replace('to-[', '').replace(']', '');

  const vitalsHistoryData = {
    hr: [
      { day: 'Mon', value: 72 }, { day: 'Tue', value: 75 }, { day: 'Wed', value: 71 },
      { day: 'Thu', value: 74 }, { day: 'Fri', value: 73 }, { day: 'Sat', value: 70 }, { day: 'Sun', value: 72 }
    ],
    bp: [
      { day: 'Mon', sys: 120, dia: 80 }, { day: 'Tue', sys: 122, dia: 82 }, { day: 'Wed', sys: 118, dia: 78 },
      { day: 'Thu', sys: 121, dia: 81 }, { day: 'Fri', sys: 119, dia: 79 }, { day: 'Sat', sys: 124, dia: 84 }, { day: 'Sun', sys: 122, dia: 80 }
    ],
    spo2: [
      { day: 'Mon', value: 98 }, { day: 'Tue', value: 99 }, { day: 'Wed', value: 98 },
      { day: 'Thu', value: 97 }, { day: 'Fri', value: 98 }, { day: 'Sat', value: 99 }, { day: 'Sun', value: 98 }
    ],
    sugar: [
      { day: 'Mon', value: 105 }, { day: 'Tue', value: 102 }, { day: 'Wed', value: 110 },
      { day: 'Thu', value: 98 }, { day: 'Fri', value: 104 }, { day: 'Sat', value: 101 }, { day: 'Sun', value: 104 }
    ]
  };

  const addWater = () => {
    setCurrentWater(prev => Math.min(prev + 250, maxWater));
  };

  const waterPercentage = Math.min(currentWater / maxWater, 1);
  const waterTranslateY = 100 - (waterPercentage * 100);
  const numGlasses = Math.floor(currentWater / 250);

  const todayIndex = 24;
  const todayTakenCount = Object.values(todayMedsTaken).filter(Boolean).length;
  const todayDotStatus =
    todayTakenCount === MEDS.length ? 'today-t' :
    todayTakenCount > 0            ? 'today-p' : 'today-r';

  const calendarDays = [
    't','t','t','t','p','t','t',
    't','r','t','t','p','t','t',
    't','t','t','p','t','t','r',
    't','t','t', todayDotStatus,'f','f','f',
    'f','f','f'
  ];

  const renderCalendarDay = (status: string, index: number) => {
    let bgStyle: any = {};
    let textClass = 'text-white';
    let borderClass = '';
    const isFuture = status === 'f';
    const isToday = status.startsWith('today');

    if (status === 't') bgStyle = { backgroundColor: color1 };
    else if (status === 'p') bgStyle = { background: 'linear-gradient(to bottom right, #FF6B35, #1A1A1A)' };
    else if (status === 'r') bgStyle = { backgroundColor: '#E53E3E' };
    else if (status === 'today-t') { bgStyle = { backgroundColor: color1 }; borderClass = 'border-2 border-white'; }
    else if (status === 'today-p') { bgStyle = { background: 'linear-gradient(to bottom right, #FF6B35, #1A1A1A)' }; borderClass = 'border-2 border-white'; }
    else if (status === 'today-r') { bgStyle = { backgroundColor: '#E53E3E' }; borderClass = 'border-2 border-white'; }
    else if (isFuture) { borderClass = 'border border-[#333]'; textClass = 'text-[#9CA3AF]'; }

    return (
      <button
        key={index}
        disabled={isFuture}
        onClick={() => !isFuture && setSelectedDay(index)}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium mx-auto ${textClass} ${borderClass} ${!isFuture ? 'active:scale-90 transition-transform' : ''}`}
        style={bgStyle}
      >
        {index + 1}
      </button>
    );
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Compute bottom-sheet data when a day is selected
  const sheetData = selectedDay !== null ? (() => {
    const isToday = selectedDay === todayIndex;
    const status = calendarDays[selectedDay];
    const dayMeds = isToday
      ? MEDS.map(m => ({ ...m, taken: todayMedsTaken[m.id] }))
      : MEDS.map((m, i) => ({ ...m, taken: (DAY_PATTERNS[status] ?? [false, false, false])[i] }));
    const allTaken = dayMeds.every(m => m.taken);
    const noneTaken = dayMeds.every(m => !m.taken);
    const label = allTaken ? 'All taken ✅' : noneTaken ? 'All missed ❌' : 'Partial adherence ⚠️';
    return { dayMeds, label };
  })() : null;

  return (
    <>
    <div className="min-h-full w-full bg-[#0A0A0A] text-white pb-10 font-sans">
      <style>{`
        @keyframes wave { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .wave-path { animation: wave 3s linear infinite; }
      `}</style>

      {/* SECTION 1: TOP HEADER & SCORE */}
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-[#0A0A0A]/80 backdrop-blur-md">
        <button onClick={popScreen} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">{activeMember.name}'s Health Score</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Share size={20} />
        </button>
      </header>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants}
        className="flex flex-col items-center px-4 pt-4 pb-8"
      >
        <div className="relative w-[240px] h-[240px] mb-6 flex items-center justify-center">
          {/* Background Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle 
              cx="100" cy="100" r="85" 
              fill="none" 
              stroke="#1A1A1A" 
              strokeWidth="14" 
            />
          </svg>
          
          {/* Animated Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color1} />
                <stop offset="100%" stopColor={color2} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.circle 
              cx="100" cy="100" r="85" 
              fill="none" 
              stroke="url(#scoreGrad)" 
              strokeWidth="14" 
              strokeLinecap="round"
              filter="url(#glow)"
              strokeDasharray={2 * Math.PI * 85}
              initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - activeMember.score / 100) }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="flex items-baseline">
                <span className="text-[72px] font-display font-bold leading-none tracking-tighter bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to bottom right, ${color1}, ${color2})` }}>
                  {activeMember.score}
                </span>
                <span className="text-2xl text-[#8B8FA8] font-medium ml-1">/100</span>
              </div>
              <div className="text-sm font-bold uppercase tracking-widest mt-2" style={{ color: color2 }}>
                Excellent
              </div>
              <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 mt-3 flex items-center gap-1.5 text-xs font-medium text-white">
                <TrendingUp size={14} style={{ color: color2 }} /> 
                <span>+2 pts this week</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full px-4 pb-3 no-scrollbar">
          <div className="bg-[#141414] border border-white/5 rounded-full px-3 py-2 flex items-center gap-1.5 text-[13px] whitespace-nowrap shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#1B8A4A]" />Sleep 85%
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-full px-3 py-2 flex items-center gap-1.5 text-[13px] whitespace-nowrap shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#1B8A4A]" />Meds 92%
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-full px-3 py-2 flex items-center gap-1.5 text-[13px] whitespace-nowrap shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />Activity 61%
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-full px-3 py-2 flex items-center gap-1.5 text-[13px] whitespace-nowrap shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />Hydration 70%
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-full px-3 py-2 flex items-center gap-1.5 text-[13px] whitespace-nowrap shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />Vitals 74%
          </div>
        </div>

        <p className="text-[13px] text-[#9CA3AF] italic text-center px-6 leading-relaxed mt-2">
          "Your score dropped 3 points last Tuesday. Sleep was 4.8 hours. Try maintaining 7+ hours consistently."
        </p>
      </motion.div>

      {/* SECTION 2: MEDICATION LOG */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Medication Log 💊</h2>
        
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {['S','M','T','W','T','F','S'].map((day, i) => (
            <div key={i} className="text-xs text-[#9CA3AF] mb-2">{day}</div>
          ))}
          {calendarDays.map((status, i) => renderCalendarDay(status, i))}
          <div /><div /><div /><div />
        </div>

        <div className="flex justify-center gap-4 mb-5 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: color1 }} />All taken</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#1A1A1A]" />Partial</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#E53E3E]" />Missed</div>
        </div>

        <div className="text-base font-semibold text-center mb-5">🔥 12 day streak — keep going</div>

        {MEDS.map((med, idx) => {
          const taken = todayMedsTaken[med.id];
          return (
            <div
              key={med.id}
              onClick={() => toggleTodayMed(med.id)}
              className={`flex items-center border-t border-white/5 cursor-pointer rounded-xl px-1 transition-colors active:bg-white/5 ${idx === MEDS.length - 1 ? 'pt-3' : 'py-3'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] flex items-center justify-center mr-3 text-xl shrink-0">{med.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold flex items-center flex-wrap gap-1">
                  {med.name}
                  {med.stock === 'low' && (
                    <span className="bg-[#FF6B35]/15 text-[#FF6B35] text-[10px] px-1.5 py-0.5 rounded font-bold">LOW STOCK</span>
                  )}
                </div>
                <div className="text-[13px] text-[#9CA3AF] mt-0.5">{med.time}</div>
              </div>
              {med.stock === 'low' && (
                <button
                  onClick={e => { e.stopPropagation(); pushScreen({ id: 'med-amlodipine', component: <MedicineDetailScreen medicine={{ brand_name: 'Amlong 5mg', salt_name: 'Amlodipine (5mg)', generic_available: true, brand_price_inr: 45, generic_price_inr: 15, savings_inr: 30, image: null }} /> }); }}
                  className="bg-[#FF6B35] text-white border-none px-3 py-1.5 rounded-xl text-xs font-semibold ml-2 shrink-0"
                >REFILL</button>
              )}
              <motion.div
                key={taken ? 'taken' : 'pending'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 320 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center ml-3 shrink-0 ${taken ? 'bg-[#1B8A4A]/20 text-[#1B8A4A]' : 'bg-[#FF6B35]/20 text-[#FF6B35]'}`}
              >
                {taken ? <Check size={14} strokeWidth={3} /> : <Clock size={14} strokeWidth={2.5} />}
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* SECTION 3: WATER INTAKE */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Hydration 💧</h2>
        
        <div className="flex flex-col items-center relative py-2">
          <div className="absolute top-5 text-center z-10">
            <div className="text-[32px] font-bold">{(currentWater / 1000).toFixed(1)}L</div>
            <div className="text-sm text-[#9CA3AF]">of 2.5L goal</div>
          </div>

          <div className="relative w-[120px] h-[180px] my-10">
            <svg className="w-full h-full" viewBox="0 0 100 180">
              <defs>
                <linearGradient id="waterGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0066CC" />
                  <stop offset="100%" stopColor="#00AAFF" />
                </linearGradient>
                <clipPath id="bodyClip">
                  <path d="M50 10 A15 15 0 1 0 50 40 A15 15 0 1 0 50 10 Z M 30 50 C 50 40, 50 40, 70 50 C 80 55, 85 70, 85 90 L 75 90 L 70 120 L 65 170 C 65 175, 55 175, 55 170 L 50 120 L 45 170 C 45 175, 35 175, 35 170 L 30 120 L 25 90 L 15 90 C 15 70, 20 55, 30 50 Z" />
                </clipPath>
              </defs>
              
              <path d="M50 10 A15 15 0 1 0 50 40 A15 15 0 1 0 50 10 Z M 30 50 C 50 40, 50 40, 70 50 C 80 55, 85 70, 85 90 L 75 90 L 70 120 L 65 170 C 65 175, 55 175, 55 170 L 50 120 L 45 170 C 45 175, 35 175, 35 170 L 30 120 L 25 90 L 15 90 C 15 70, 20 55, 30 50 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              
              <g clipPath="url(#bodyClip)">
                <g style={{ transform: `translateY(${waterTranslateY}%)`, transition: 'transform 0.5s ease' }}>
                  <path className="wave-path" fill="url(#waterGrad)" opacity="0.7" d="M 0 0 Q 25 -10 50 0 T 100 0 T 150 0 T 200 0 L 200 200 L 0 200 Z" />
                </g>
              </g>
            </svg>
          </div>

          <div className="flex gap-2 mb-5">
            {[...Array(8)].map((_, i) => (
              <svg key={i} className="w-5 h-6" viewBox="0 0 24 24">
                <path 
                  d="M6 2L5 22h14l-1-20H6zm2 4h8v14H8V6z" 
                  fill={i < numGlasses ? "#00AAFF" : "#9CA3AF"} 
                  fillOpacity={i < numGlasses ? 1 : 0.3}
                  style={{ transition: 'all 0.3s' }}
                />
              </svg>
            ))}
          </div>

          <button 
            onClick={addWater}
            className="bg-[#0066CC]/20 text-[#00AAFF] border border-[#00AAFF] px-6 py-2.5 rounded-full text-[15px] font-semibold flex items-center gap-2"
          >
            <Droplet size={18} /> 250ml
          </button>
        </div>
      </motion.div>

      {/* SECTION 4: CALORIES & STEPS */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="grid grid-cols-2 gap-4 px-4 mb-4">
        <div className="bg-[#141414] rounded-[20px] border border-white/5 p-4">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3 flex items-center gap-1.5">Calories Burned 🔥</h3>
          <div className="relative w-full h-[60px] mb-4 flex justify-center">
            <svg className="w-[120px] h-[60px] overflow-visible" viewBox="0 0 100 50">
              <path d="M 10 40 A 40 40 0 0 1 90 40" fill="none" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" />
              <motion.path 
                d="M 10 40 A 40 40 0 0 1 90 40" 
                fill="none" stroke="#FF6B35" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={125.6}
                initial={{ strokeDashoffset: 125.6 }}
                whileInView={{ strokeDashoffset: 125.6 - (0.7 * 125.6) }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute bottom-0 text-center w-full">
              <div className="text-[28px] font-bold leading-none">420</div>
              <div className="text-[11px] text-[#9CA3AF]">of 600 kcal goal</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <div className="flex items-center gap-1.5 text-[#9CA3AF]">👣 Walking</div>
            <div className="font-semibold">180 kcal</div>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <div className="flex items-center gap-1.5 text-[#9CA3AF]">🪜 Climbing</div>
            <div className="font-semibold">95 kcal</div>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <div className="flex items-center gap-1.5 text-[#9CA3AF]">❤️ Resting</div>
            <div className="font-semibold">145 kcal</div>
          </div>
        </div>

        <div className="bg-[#141414] rounded-[20px] border border-white/5 p-4">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3 flex items-center gap-1.5">Steps 👣</h3>
          <div className="relative w-full h-[60px] mb-4 flex justify-center">
            <svg className="w-[120px] h-[60px] overflow-visible" viewBox="0 0 100 50">
              <path d="M 10 40 A 40 40 0 0 1 90 40" fill="none" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" />
              <motion.path 
                d="M 10 40 A 40 40 0 0 1 90 40" 
                fill="none" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={125.6}
                initial={{ strokeDashoffset: 125.6 }}
                whileInView={{ strokeDashoffset: 125.6 - (0.68 * 125.6) }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute bottom-0 text-center w-full">
              <div className="text-[28px] font-bold leading-none">6842</div>
              <div className="text-[11px] text-[#9CA3AF]">of 10000 goal</div>
            </div>
          </div>
          <div className="flex items-end justify-between h-[40px] mt-4 gap-[2px]">
            {[20, 30, 10, 50, 80, 100, 60, 40, 70, 90, 30, 50].map((h, i) => (
              <div key={i} className="w-full bg-[#7C3AED] rounded-sm opacity-80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECTION 5: UPCOMING CONSULTATION */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 border-l-4 p-5 mx-4 mb-4" style={{ borderLeftColor: color1 }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Upcoming Consultation 📅</h2>
        
        <div className="flex gap-4 mb-5">
          <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-lg font-bold shrink-0" style={{ backgroundColor: color1 }}>DK</div>
          <div>
            <div className="text-base font-semibold">Dr. Dinesh Kumar</div>
            <div className="text-[13px] text-[#9CA3AF] mb-1">Cardiologist</div>
            <div className="text-[14px] font-medium" style={{ color: color2 }}>Tomorrow, 10:30 AM</div>
            <div className="text-[12px] text-[#9CA3AF] mt-0.5">JS Global Hospital</div>
          </div>
        </div>
        
        <div className="flex gap-3 mb-5">
          <button
            className="flex-1 text-white py-3 rounded-xl font-semibold text-sm"
            style={{ backgroundColor: color1 }}
            onClick={() => pushScreen({ id: 'waiting-room-dinesh', component: <WaitingRoomScreen doctor={DR_DINESH} /> })}
          >Join Teleconsult</button>
          <button className="flex-1 bg-transparent border border-white/20 text-white py-3 rounded-xl font-semibold text-sm">Reschedule</button>
        </div>
        
        <div className="bg-[#1A1A1A] rounded-xl p-3">
          <div className="flex items-center gap-2.5 text-[13px] mb-2">
            <span className="text-[#1B8A4A]">✓</span> Share latest BP readings
          </div>
          <div className="flex items-center gap-2.5 text-[13px] mb-2">
            <span className="text-[#E53E3E]">✗</span> Upload recent ECG report
          </div>
          <div className="flex items-center gap-2.5 text-[13px]">
            <span className="text-[#1B8A4A]">✓</span> List current medications
          </div>
        </div>
      </motion.div>

      {/* SECTION 6: HEALTH RECORDS SUMMARY */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Records Summary 📄</h2>
        
        <div className="bg-[#1A1A1A] border-l-2 p-3 rounded-r-xl text-sm text-[#D1D5DB] italic leading-relaxed mb-4" style={{ borderLeftColor: color1 }}>
          "Based on your last 3 reports, your HbA1c improved from 7.4% to 6.9%. Blood pressure is stable at 122/80. Vitamin D levels are low — your doctor has been notified."
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <div className="shrink-0 w-[160px] bg-[#1A1A1A] rounded-2xl p-4 flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#FF6B35]">🩸</div>
              <div className="bg-[#1B8A4A]/20 text-[#1B8A4A] text-[10px] font-bold px-1.5 py-0.5 rounded">Normal</div>
            </div>
            <div className="text-sm font-semibold mb-1">Blood Report</div>
            <div className="text-xs text-[#9CA3AF] mb-3">12 Mar</div>
            <button onClick={() => pushScreen({ id: 'records', component: <RecordsScreen /> })} className="text-[13px] font-medium mt-auto text-left" style={{ color: color2 }}>View</button>
          </div>
          
          <div className="shrink-0 w-[160px] bg-[#1A1A1A] rounded-2xl p-4 flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#48CAE4]">🫀</div>
              <div className="bg-[#1B8A4A]/20 text-[#1B8A4A] text-[10px] font-bold px-1.5 py-0.5 rounded">Normal</div>
            </div>
            <div className="text-sm font-semibold mb-1">ECG Report</div>
            <div className="text-xs text-[#9CA3AF] mb-3">28 Feb</div>
            <button onClick={() => pushScreen({ id: 'records', component: <RecordsScreen /> })} className="text-[13px] font-medium mt-auto text-left" style={{ color: color2 }}>View</button>
          </div>
          
          <div className="shrink-0 w-[160px] bg-[#1A1A1A] rounded-2xl p-4 flex flex-col border border-white/5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#C47A00]">☀️</div>
              <div className="bg-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-bold px-1.5 py-0.5 rounded">Low</div>
            </div>
            <div className="text-sm font-semibold mb-1">Vitamin D Test</div>
            <div className="text-xs text-[#9CA3AF] mb-3">15 Feb</div>
            <button onClick={() => pushScreen({ id: 'records', component: <RecordsScreen /> })} className="text-[13px] font-medium mt-auto text-left" style={{ color: color2 }}>View</button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 7: VITALS TREND */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Vitals 💓</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] mb-3">❤️ Heart Rate</div>
            <div className="text-2xl font-bold mb-1">72 <span className="text-sm text-[#9CA3AF] font-normal">BPM</span></div>
            <svg className="w-full h-6 mt-1" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,10 L20,12 L40,5 L60,15 L80,8 L100,10" fill="none" stroke={color1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-[10px] text-[#9CA3AF] mt-3">Updated 2h ago</div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] mb-3">🩸 Blood Pressure</div>
            <div className="text-2xl font-bold mb-1">122/80</div>
            <div className="text-[13px] font-medium text-[#1B8A4A]">Normal</div>
            <div className="text-[10px] text-[#9CA3AF] mt-3">Updated 2h ago</div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] mb-3">💨 SpO2</div>
            <div className="text-2xl font-bold mb-1">98%</div>
            <div className="text-[13px] font-medium text-[#48CAE4]">Normal</div>
            <div className="text-[10px] text-[#9CA3AF] mt-3">Updated 2h ago</div>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] mb-3">🩸 Blood Sugar</div>
            <div className="text-2xl font-bold mb-1">104 <span className="text-sm text-[#9CA3AF] font-normal">mg/dL</span></div>
            <div className="text-[13px] font-medium text-[#1B8A4A]">Normal</div>
            <div className="text-[10px] text-[#9CA3AF] mt-3">Updated 2h ago</div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 7.5: VITALS HISTORY */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Historical Trends 📈</h2>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          <button 
            onClick={() => setActiveVitalTab('hr')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeVitalTab === 'hr' ? 'text-white' : 'bg-[#1A1A1A] text-[#9CA3AF]'}`}
            style={activeVitalTab === 'hr' ? { backgroundColor: color1 } : {}}
          >
            Heart Rate
          </button>
          <button 
            onClick={() => setActiveVitalTab('bp')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeVitalTab === 'bp' ? 'bg-[#1B8A4A] text-white' : 'bg-[#1A1A1A] text-[#9CA3AF]'}`}
          >
            Blood Pressure
          </button>
          <button 
            onClick={() => setActiveVitalTab('spo2')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeVitalTab === 'spo2' ? 'bg-[#48CAE4] text-[#0A0A0A]' : 'bg-[#1A1A1A] text-[#9CA3AF]'}`}
          >
            SpO2
          </button>
          <button 
            onClick={() => setActiveVitalTab('sugar')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeVitalTab === 'sugar' ? 'bg-[#FF6B35] text-white' : 'bg-[#1A1A1A] text-[#9CA3AF]'}`}
          >
            Blood Sugar
          </button>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeVitalTab === 'bp' ? (
              <AreaChart data={vitalsHistoryData.bp} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B8A4A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B8A4A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color1} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color1} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="sys" name="Systolic" stroke="#1B8A4A" strokeWidth={2} fillOpacity={1} fill="url(#colorSys)" />
                <Area type="monotone" dataKey="dia" name="Diastolic" stroke={color1} strokeWidth={2} fillOpacity={1} fill="url(#colorDia)" />
              </AreaChart>
            ) : (
              <AreaChart data={vitalsHistoryData[activeVitalTab]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeVitalTab === 'hr' ? color1 : activeVitalTab === 'spo2' ? '#48CAE4' : '#FF6B35'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeVitalTab === 'hr' ? color1 : activeVitalTab === 'spo2' ? '#48CAE4' : '#FF6B35'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                  labelStyle={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name={activeVitalTab === 'hr' ? 'Heart Rate' : activeVitalTab === 'spo2' ? 'SpO2' : 'Blood Sugar'} 
                  stroke={activeVitalTab === 'hr' ? color1 : activeVitalTab === 'spo2' ? '#48CAE4' : '#FF6B35'} 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* SECTION 8: SLEEP */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="bg-[#141414] rounded-[20px] border border-white/5 p-5 mx-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">Sleep 🌙</h2>
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-[32px] font-bold leading-none">5.8<span className="text-sm text-[#9CA3AF] font-normal">h</span></div>
            <div className="text-sm text-[#9CA3AF] mt-1">Goal: 7h</div>
          </div>
        </div>
        
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#48CAE4]" style={{ width: '63%' }} />
          <div className="h-full bg-[#023E8A]" style={{ width: '21%' }} />
          <div className="h-full bg-[#7C3AED]" style={{ width: '16%' }} />
        </div>
        
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-[#023E8A]" />Deep 1.2h</div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-[#7C3AED]" />REM 0.9h</div>
          <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-[#48CAE4]" />Light 3.7h</div>
        </div>
        
        <div className="flex items-end justify-between h-[60px] mb-4 gap-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded" style={{ height: '80%', backgroundColor: color1 }} />
            <div className="text-[10px] text-[#9CA3AF]">M</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded bg-[#48CAE4]" style={{ height: '60%' }} />
            <div className="text-[10px] text-[#9CA3AF]">T</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded" style={{ height: '90%', backgroundColor: color1 }} />
            <div className="text-[10px] text-[#9CA3AF]">W</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded bg-[#FF6B35]" style={{ height: '40%' }} />
            <div className="text-[10px] text-[#9CA3AF]">T</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded" style={{ height: '70%', backgroundColor: color1 }} />
            <div className="text-[10px] text-[#9CA3AF]">F</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded" style={{ height: '85%', backgroundColor: color1 }} />
            <div className="text-[10px] text-[#9CA3AF]">S</div>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full max-w-[24px] rounded bg-[#48CAE4]" style={{ height: '50%' }} />
            <div className="text-[10px] text-[#9CA3AF]">S</div>
          </div>
        </div>
        
        <div className="text-[13px] text-[#9CA3AF] text-center">
          "You slept 1.2 hours less than your weekly average last night."
        </div>
      </motion.div>

    </div>

    {/* DAY MEDICATION DETAIL BOTTOM SHEET */}
    <AnimatePresence>
      {selectedDay !== null && sheetData && (
        <motion.div
          key="day-med-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ maxWidth: 390, margin: '0 auto' }}
          onClick={() => setSelectedDay(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative bg-[#141414] rounded-t-[28px] border-t border-white/10 p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            {/* drag handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {/* header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-lg font-bold">May {selectedDay + 1}</h3>
                <p className="text-[13px] text-[#9CA3AF] mt-0.5">{sheetData.label}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* med cards */}
            <div className="flex flex-col gap-3 mt-5">
              {sheetData.dayMeds.map(med => (
                <div
                  key={med.id}
                  className="flex items-center p-4 rounded-2xl border"
                  style={{
                    background: med.taken
                      ? 'linear-gradient(135deg, rgba(27,138,74,0.18), rgba(2,195,154,0.08))'
                      : 'linear-gradient(135deg, rgba(229,62,62,0.18), rgba(255,107,53,0.08))',
                    borderColor: med.taken ? 'rgba(27,138,74,0.35)' : 'rgba(229,62,62,0.35)',
                  }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#1A1A1A] flex items-center justify-center mr-3 text-xl shrink-0">
                    {med.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold flex items-center gap-2">
                      {med.name}
                      {med.stock === 'low' && (
                        <span className="bg-[#FF6B35]/15 text-[#FF6B35] text-[10px] px-1.5 py-0.5 rounded font-bold">LOW STOCK</span>
                      )}
                    </div>
                    <div className="text-[13px] text-[#9CA3AF] mt-0.5">{med.dose} · {med.time}</div>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center ml-3 shrink-0"
                    style={{
                      background: med.taken ? 'rgba(27,138,74,0.2)' : 'rgba(229,62,62,0.2)',
                      color: med.taken ? '#1B8A4A' : '#E53E3E',
                    }}
                  >
                    {med.taken
                      ? <Check size={16} strokeWidth={3} />
                      : <X size={16} strokeWidth={2.5} />
                    }
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
