import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Settings, Pill, Calendar, ChevronDown, Plus, CornerDownLeft, CornerDownRight, Camera, Loader2 } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { scanPrescription } from '../services/geminiService';

const CATEGORIES = [
  'Antibiotics', 'Pain Relievers', 'Antiacids', 
  'Antidepressants', 'Antidiarectics', 'Antihypertensives', 
  'Diuretics', 'Analgesics'
];

const APPEARANCES = [
  { id: 'pill-round', icon: <Pill size={24} className="rotate-45" /> },
  { id: 'capsule', icon: <Pill size={24} /> },
  { id: 'tablet-oval', icon: <div className="w-6 h-4 rounded-full border-2 border-current" /> },
  { id: 'tablet-round', icon: <div className="w-5 h-5 rounded-full border-2 border-current" /> },
  { id: 'drop', icon: <div className="w-4 h-6 rounded-t-full rounded-b-full border-2 border-current" /> },
];

export default function AddMedicationScreen({ onAdd, autoScan }: { onAdd: (med: any) => void; autoScan?: boolean }) {
  const { popScreen } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoScan) {
      const t = setTimeout(() => fileInputRef.current?.click(), 300);
      return () => clearTimeout(t);
    }
  }, [autoScan]);
  const [isScanning, setIsScanning] = useState(false);
  const [name, setName] = useState('Ashwgandha');
  const [dose, setDose] = useState(500);
  const [duration, setDuration] = useState('8 Months');
  const [mealTiming, setMealTiming] = useState('Take After');
  const [category, setCategory] = useState('Antidiarectics');
  const [appearance, setAppearance] = useState('capsule');
  const [time, setTime] = useState('08:00 AM');
  const [fromDate, setFromDate] = useState('July 5');
  const [toDate, setToDate] = useState('Aug 5');
  const [recurrenceType, setRecurrenceType] = useState('Daily');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'W', 'F']);
  const [customReminder, setCustomReminder] = useState('Please remind me when I have reached the medication threshold prescribed by Dr. Hannibal Lecto');
  const [autoReminder, setAutoReminder] = useState(true);

  const WEEKDAYS = [
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'T', label: 'T' },
    { id: 'W', label: 'W' },
    { id: 'Th', label: 'T' },
    { id: 'F', label: 'F' },
    { id: 'Sa', label: 'S' },
  ];

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const result = await scanPrescription(base64);
          if (result) {
            if (result.name) setName(result.name);
            if (result.dose) setDose(result.dose);
            if (result.duration) setDuration(result.duration);
            if (result.mealTiming) setMealTiming(result.mealTiming);
            if (result.category && CATEGORIES.includes(result.category)) setCategory(result.category);
          }
        } catch (error) {
          console.error("Scanning failed", error);
          alert("Failed to scan prescription. Please check the API key.");
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setIsScanning(false);
    }
  };

  const handleAdd = () => {
    onAdd({
      id: Date.now().toString(),
      name,
      dose: `${dose}mg`,
      duration,
      mealTiming,
      time,
      recurrenceType,
      selectedDays: recurrenceType === 'Specific Days' ? selectedDays : [],
      category,
      appearance,
      fromDate,
      toDate,
      customReminder,
      autoReminder,
      taken: false
    });
    popScreen();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-32 font-sans relative">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleScan} 
        className="hidden" 
      />
      
      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#00D4AA]/20 rounded-full blur-xl animate-pulse" />
              <Loader2 size={48} className="text-[#00D4AA] animate-spin relative z-10" />
            </div>
            <p className="mt-4 font-bold text-lg">Scanning Prescription...</p>
            <p className="text-sm text-[#8B8FA8] mt-2">Extracting medication details</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#00D4AA]/20 flex items-center justify-center border border-white/10"
        >
          <Camera size={20} className="text-white" />
        </button>
      </div>

      <div className="px-4 py-6 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">New Medication</h1>
          <p className="text-[#8B8FA8] text-sm">Set up your new med manually or scan.</p>
        </div>

        {/* Medication Name */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">Medication Name</label>
          <div className="glass-card rounded-2xl flex items-center px-4 py-4 border border-[#00D4AA]/50">
            <Pill size={20} className="text-[#8B8FA8] mr-3" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-base text-white"
            />
            <div className="w-4 h-4 rounded-sm bg-[#8B8FA8] opacity-50 ml-2" /> {/* Pencil icon placeholder */}
          </div>
        </div>

        {/* Dose & Measurement */}
        <div>
          <label className="block text-sm font-bold mb-4 text-[#8B8FA8] uppercase tracking-wider">Dose & Measurement</label>
          <div className="relative h-2 bg-white/5 rounded-full mb-6">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#00D4AA]/20 to-[#00D4AA] rounded-full" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#00D4AA] rounded-full flex items-center justify-center border-4 border-[#0A0A0F]">
              <div className="flex gap-0.5">
                <ChevronLeft size={12} className="text-[#0A0A0F]" />
                <ChevronLeft size={12} className="text-[#0A0A0F] rotate-180" />
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#8B8FA8]">
            <span>400mg</span>
            <span className="text-white text-lg">500mg</span>
            <span>600mg</span>
          </div>
        </div>

        {/* Duration & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">Duration</label>
            <div className="glass-card rounded-2xl flex items-center justify-between px-4 py-4 border border-white/5">
              <div className="flex items-center">
                <Calendar size={20} className="text-[#8B8FA8] mr-3" />
                <span className="text-base">{duration}</span>
              </div>
              <ChevronDown size={20} className="text-[#8B8FA8]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">Time</label>
            <div className="glass-card rounded-2xl flex items-center justify-between px-4 py-4 border border-white/5">
              <input 
                type="time" 
                value={(() => {
                  const match = time.match(/(\d+):(\d+)\s(AM|PM)/);
                  if (!match) return "08:00";
                  let h = parseInt(match[1]);
                  if (match[3] === 'PM' && h < 12) h += 12;
                  if (match[3] === 'AM' && h === 12) h = 0;
                  return `${h.toString().padStart(2, '0')}:${match[2]}`;
                })()}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':');
                  const hour = parseInt(h);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const hour12 = hour % 12 || 12;
                  setTime(`${hour12}:${m} ${ampm}`);
                }}
                className="bg-transparent border-none outline-none flex-1 text-base text-white w-full"
              />
            </div>
          </div>
        </div>

        {/* Recurrence */}
        <div>
          <label className="block text-sm font-bold mb-3 text-[#8B8FA8] uppercase tracking-wider">Recurrence</label>
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-4">
            {['Daily', 'Specific Days', 'As Needed'].map(type => (
              <button
                key={type}
                onClick={() => setRecurrenceType(type)}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${recurrenceType === type ? 'bg-[#00D4AA] text-[#0A0A0F]' : 'text-[#8B8FA8]'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {recurrenceType === 'Specific Days' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex justify-between mt-2">
                  {WEEKDAYS.map(day => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDays(prev => 
                        prev.includes(day.id) ? prev.filter(d => d !== day.id) : [...prev, day.id]
                      )}
                      className={`w-11 h-11 rounded-full font-bold text-sm flex items-center justify-center transition-colors ${selectedDays.includes(day.id) ? 'bg-[#6C63FF] text-white' : 'glass-card border border-white/5 text-[#8B8FA8]'}`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Take with meal? */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">Take with meal?</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setMealTiming('Take Before')}
              className={`rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors ${mealTiming === 'Take Before' ? 'bg-[#00D4AA] text-[#0A0A0F]' : 'glass-card text-[#8B8FA8] border border-white/5'}`}
            >
              <CornerDownLeft size={18} />
              Take Before
            </button>
            <button 
              onClick={() => setMealTiming('Take After')}
              className={`rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors ${mealTiming === 'Take After' ? 'bg-[#00D4AA] text-[#0A0A0F]' : 'glass-card text-[#8B8FA8] border border-white/5'}`}
            >
              <CornerDownRight size={18} />
              Take After
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold mb-3 text-[#8B8FA8] uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat ? 'bg-[#6C63FF] text-white' : 'glass-card text-[#8B8FA8] border border-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drug Appearance */}
        <div>
          <label className="block text-sm font-bold mb-3 text-[#8B8FA8] uppercase tracking-wider">Drug Appearance</label>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {APPEARANCES.map(app => (
              <button
                key={app.id}
                onClick={() => setAppearance(app.id)}
                className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-colors ${appearance === app.id ? 'bg-[#FF6B6B] text-white' : 'glass-card text-[#8B8FA8] border border-white/5'}`}
              >
                {app.icon}
              </button>
            ))}
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">From</label>
            <div className="glass-card rounded-2xl flex items-center justify-between px-4 py-4 border border-white/5">
              <div className="flex items-center">
                <Calendar size={18} className="text-[#8B8FA8] mr-2" />
                <span className="text-sm">{fromDate}</span>
              </div>
              <ChevronDown size={18} className="text-[#8B8FA8]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">To</label>
            <div className="glass-card rounded-2xl flex items-center justify-between px-4 py-4 border border-white/5">
              <div className="flex items-center">
                <Calendar size={18} className="text-[#8B8FA8] mr-2" />
                <span className="text-sm">{toDate}</span>
              </div>
              <ChevronDown size={18} className="text-[#8B8FA8]" />
            </div>
          </div>
        </div>

        {/* Custom AI Reminder */}
        <div>
          <label className="block text-sm font-bold mb-2 text-[#8B8FA8] uppercase tracking-wider">Custom AI Reminder</label>
          <div className="glass-card rounded-2xl p-4 border border-white/5 relative">
            <textarea 
              value={customReminder}
              onChange={(e) => setCustomReminder(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-[#8B8FA8] resize-none h-24"
            />
            <div className="absolute bottom-3 right-4 text-xs text-[#8B8FA8] flex items-center gap-1">
              <div className="w-3 h-3 border border-current rounded-sm" />
              {customReminder.length}/500
            </div>
          </div>
        </div>

        {/* Set AI Autoreminder? */}
        <div className="flex items-center justify-between py-2">
          <label className="text-sm font-bold text-[#8B8FA8] uppercase tracking-wider">Set AI Autoreminder?</label>
          <button 
            onClick={() => setAutoReminder(!autoReminder)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${autoReminder ? 'bg-[#00D4AA]' : 'bg-white/10'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoReminder ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-[390px] mx-auto">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg flex items-center justify-center shadow-[0_8px_32px_rgba(108,99,255,0.3)]"
        >
          Add Medication <Plus size={20} className="ml-2" />
        </motion.button>
      </div>
    </div>
  );
}
