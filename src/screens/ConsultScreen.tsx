import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Video, Phone, MessageSquare, Star, ChevronDown, ArrowRight, ChevronLeft, MapPin, Heart } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import DoctorProfileScreen from './DoctorProfileScreen';

type ConsultState = 'CONSULT_TYPE' | 'ADDRESS_ENTRY' | 'LANGUAGE_PREF' | 'CHOOSE_SPECIALTY' | 'SEARCHING' | 'DOCTOR_LIST';

const INDIAN_LANGUAGES = ['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'मराठी', 'ਪੰਜਾਬੀ', 'മലയാളം', 'ગુજરાતી', 'ଓଡ଼ିଆ'];

const SPECIALTY_ITEMS = [
  { name: 'General Physician', emoji: '👨‍⚕️', color: 'from-[#6C63FF] to-[#8A84FF]' },
  { name: 'Cardiologist',      emoji: '❤️',   color: 'from-[#FF6B6B] to-[#FF8E8E]' },
  { name: 'Dermatologist',     emoji: '✨',   color: 'from-[#00C9A7] to-[#4DFFDF]' },
  { name: 'Pediatrician',      emoji: '👶',   color: 'from-[#FFB347] to-[#FFD18C]' },
  { name: 'Gynecologist',      emoji: '🌸',   color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { name: 'Orthopedic',        emoji: '🦴',   color: 'from-[#4D94FF] to-[#8CB9FF]' },
  { name: 'Neurologist',       emoji: '🧠',   color: 'from-[#9D4DFF] to-[#C48CFF]' },
  { name: 'Dentist',           emoji: '🦷',   color: 'from-[#00D4AA] to-[#5CFFDF]' },
];

const SPECIALTY_LABEL: Record<string, string> = {
  'General Physician': 'General Physicians',
  'Orthopedic':        'Orthopedic Specialists',
  'Gynecologist':      'Gynecologists',
  'Cardiologist':      'Cardiologists',
  'Dermatologist':     'Dermatologists',
  'Pediatrician':      'Pediatricians',
  'Neurologist':       'Neurologists',
  'Dentist':           'Dentists',
};

const ALL_DOCTORS = [
  { name: 'Dr. Priya Sharma',  spec: 'Cardiologist',      exp: '12 yrs', rating: 4.9, lang: 'Hindi, English',     initials: 'P', color: 'from-[#6C63FF] to-[#00D4AA]' },
  { name: 'Dr. Arjun Reddy',   spec: 'General Physician', exp: '8 yrs',  rating: 4.8, lang: 'Telugu, English',    initials: 'A', color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { name: 'Dr. Sarah Khan',    spec: 'Dermatologist',     exp: '15 yrs', rating: 4.9, lang: 'Urdu, English',      initials: 'S', color: 'from-[#00C9A7] to-[#A8FF78]' },
  { name: 'Dr. Meera Nair',    spec: 'Gynecologist',      exp: '10 yrs', rating: 4.7, lang: 'Malayalam, English', initials: 'M', color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { name: 'Dr. Rajesh Kumar',  spec: 'Orthopedic',        exp: '14 yrs', rating: 4.8, lang: 'Hindi, English',     initials: 'R', color: 'from-[#4D94FF] to-[#8CB9FF]' },
  { name: 'Dr. Ananya Singh',  spec: 'Pediatrician',      exp: '9 yrs',  rating: 4.9, lang: 'Hindi, English',     initials: 'A', color: 'from-[#FFB347] to-[#FFD18C]' },
  { name: 'Dr. Vikram Menon',  spec: 'Neurologist',       exp: '16 yrs', rating: 4.8, lang: 'Tamil, English',     initials: 'V', color: 'from-[#9D4DFF] to-[#C48CFF]' },
  { name: 'Dr. Pooja Iyer',    spec: 'Dentist',           exp: '7 yrs',  rating: 4.7, lang: 'Kannada, English',   initials: 'P', color: 'from-[#00D4AA] to-[#5CFFDF]' },
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

export default function ConsultScreen() {
  const { pushScreen } = useNavigation();
  const [currentState, setCurrentState] = useState<ConsultState>('CONSULT_TYPE');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultType, setConsultType] = useState<'PHYSICAL' | 'TELECONSULT' | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const isSignedUp = false;

  const handleFindDoctor = () => {
    setCurrentState('SEARCHING');
    setTimeout(() => setCurrentState('DOCTOR_LIST'), 2500);
  };

  const openDoctorProfile = (doctor: any, preSelectedType?: string) => {
    pushScreen({
      id: `doctor-${doctor.name}`,
      component: <DoctorProfileScreen doctor={doctor} consultType={consultType} preSelectedType={preSelectedType} />,
    });
  };

  const toggleFavorite = (e: React.MouseEvent, doctorName: string) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(doctorName) ? prev.filter(n => n !== doctorName) : [...prev, doctorName]
    );
  };

  const specialtyDoctors = ALL_DOCTORS.filter(d => d.spec === selectedSpecialty);
  const displayedDoctors = showFavoritesOnly
    ? specialtyDoctors.filter(d => favorites.includes(d.name))
    : specialtyDoctors;

  return (
    <div className="min-h-full w-full relative">
      <AnimatePresence mode="wait">

        {/* SCREEN 1: CONSULT TYPE */}
        {currentState === 'CONSULT_TYPE' && (
          <motion.div
            key="consult-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 py-8 h-full flex flex-col justify-center"
          >
            <h1 className="font-display text-4xl font-bold text-white mb-10 leading-tight text-center">How would you like to<br/>consult?</h1>

            <div className="space-y-5">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setConsultType('PHYSICAL');
                  setCurrentState(isSignedUp ? 'LANGUAGE_PREF' : 'ADDRESS_ENTRY');
                }}
                className="w-full glass-card p-6 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center relative z-10">
                  <div className="text-4xl mr-5 filter drop-shadow-lg">🩺</div>
                  <div className="text-left">
                    <h3 className="font-bold text-xl text-white">Physical / Offline Booking</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">Visit a doctor in person</p>
                  </div>
                </div>
                <ArrowRight className="text-[#00D4AA] relative z-10" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setConsultType('TELECONSULT'); setCurrentState('LANGUAGE_PREF'); }}
                className="w-full glass-card p-6 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-colors border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00D4AA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center relative z-10">
                  <div className="text-4xl mr-5 filter drop-shadow-lg">⚡</div>
                  <div className="text-left">
                    <h3 className="font-bold text-xl text-white">Teleconsult in Minutes</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">Instant video/audio call</p>
                  </div>
                </div>
                <ArrowRight className="text-[#00D4AA] relative z-10" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: ADDRESS ENTRY (Physical only) */}
        {currentState === 'ADDRESS_ENTRY' && (
          <motion.div
            key="address-entry"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 py-8 h-full flex flex-col"
          >
            <div className="flex items-center mb-8">
              <button onClick={() => setCurrentState('CONSULT_TYPE')} className="mr-3 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
              <h1 className="font-display text-2xl font-bold">Add Address</h1>
            </div>

            <div className="flex-1">
              <div className="w-full h-48 bg-[#13131A] rounded-3xl border border-white/10 mb-6 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=4&size=600x300&maptype=roadmap')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent opacity-60" />
                <div className="relative z-10 w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.5)]">
                  <MapPin size={20} className="text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search size={18} className="text-[#8B8FA8]" />
                  </div>
                  <input type="text" placeholder="Search location..." className="w-full bg-[#13131A]/80 border border-white/20 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#00D4AA] transition-colors" />
                </div>
                <input type="text" placeholder="House/Flat No., Building Name" className="w-full bg-[#13131A]/80 border border-white/20 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#00D4AA] transition-colors" />
              </div>
            </div>

            <div className="pb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentState('LANGUAGE_PREF')}
                className="w-full h-14 rounded-full bg-primary-gradient text-white font-bold text-lg shadow-[0_8px_32px_rgba(108,99,255,0.3)] flex items-center justify-center"
              >
                Confirm Address <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: LANGUAGE PREFERENCE */}
        {currentState === 'LANGUAGE_PREF' && (
          <motion.div
            key="language-pref"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 py-8 h-full flex flex-col"
          >
            <div className="flex items-center mb-8">
              <button
                onClick={() => setCurrentState(consultType === 'PHYSICAL' && !isSignedUp ? 'ADDRESS_ENTRY' : 'CONSULT_TYPE')}
                className="mr-3 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h1 className="font-display text-4xl font-bold text-white mb-8 leading-tight">Which language<br/>speaking doctor?</h1>

              <div className="relative mb-6">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full appearance-none bg-[#13131A]/80 border border-white/20 rounded-2xl py-5 px-6 text-xl font-bold text-white focus:outline-none focus:border-[#00D4AA] transition-colors"
                >
                  <option value="" disabled>Select Regional Language</option>
                  {INDIAN_LANGUAGES.filter(l => l !== 'English').map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                  <ChevronDown size={24} className="text-[#00D4AA]" />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[#8B8FA8] text-sm">or</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedLanguage('English'); setCurrentState('CHOOSE_SPECIALTY'); }}
                className={`w-full h-16 rounded-2xl border font-bold text-lg flex items-center justify-center transition-colors ${selectedLanguage === 'English' ? 'border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]' : 'border-white/20 text-white hover:bg-white/5'}`}
              >
                English is fine
              </motion.button>
            </div>

            <div className="pb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentState('CHOOSE_SPECIALTY')}
                disabled={!selectedLanguage}
                className={`w-full h-14 rounded-full font-bold text-lg flex items-center justify-center transition-all ${selectedLanguage ? 'bg-primary-gradient text-white shadow-[0_8px_32px_rgba(108,99,255,0.3)]' : 'bg-white/10 text-[#8B8FA8] cursor-not-allowed'}`}
              >
                Continue <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: CHOOSE SPECIALTY */}
        {currentState === 'CHOOSE_SPECIALTY' && (
          <motion.div
            key="choose-specialty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 py-6 space-y-6"
          >
            <div className="flex items-center mb-6">
              <button onClick={() => setCurrentState('LANGUAGE_PREF')} className="mr-3 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
              <h1 className="font-display text-2xl font-bold">Choose Specialty</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-24">
              {SPECIALTY_ITEMS.map((spec) => (
                <motion.button
                  key={spec.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedSpecialty(spec.name); handleFindDoctor(); }}
                  className="glass-card p-5 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${spec.color} group-hover:opacity-20 transition-opacity`} />
                  <div className="text-4xl mb-3 relative z-10 filter drop-shadow-md">{spec.emoji}</div>
                  <span className="font-bold text-sm text-white relative z-10">{spec.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCREEN 5: SEARCHING */}
        {currentState === 'SEARCHING' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-[#0A0A0F] z-50"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-primary-gradient blur-xl"
              />
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#13131A] border border-white/20 flex items-center justify-center text-4xl shadow-2xl">
                🔍
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Searching nearby doctors...</h2>
            <p className="text-[#8B8FA8] animate-pulse">Matching your preferences</p>
          </motion.div>
        )}

        {/* SCREEN 6: DOCTOR LIST */}
        {currentState === 'DOCTOR_LIST' && (
          <motion.div
            key="doctor-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-6 space-y-6 pb-24"
          >
            <header className="mb-4">
              <div className="flex items-center mb-4">
                <button onClick={() => setCurrentState('CHOOSE_SPECIALTY')} className="mr-3 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <ChevronLeft size={20} />
                </button>
                <h1 className="font-display text-2xl font-bold">Available Doctors</h1>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[#00D4AA] text-sm font-medium truncate pr-2">
                  {SPECIALTY_LABEL[selectedSpecialty] ?? selectedSpecialty}
                </p>

                <div className="flex bg-[#13131A] rounded-lg p-1 border border-white/10 shrink-0">
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${!showFavoritesOnly ? 'bg-white/10 text-white' : 'text-[#8B8FA8] hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setShowFavoritesOnly(true)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${showFavoritesOnly ? 'bg-white/10 text-white' : 'text-[#8B8FA8] hover:text-white'}`}
                  >
                    Favorites
                  </button>
                </div>
              </div>
            </header>

            <div className="space-y-4">
              {displayedDoctors.length === 0 ? (
                <div className="text-center py-10">
                  <Heart size={48} className="mx-auto text-white/10 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-1">
                    {showFavoritesOnly ? 'No favorites yet' : 'No doctors available'}
                  </h3>
                  <p className="text-[#8B8FA8] text-sm">
                    {showFavoritesOnly ? 'Tap the heart icon on a doctor to save them here.' : 'Try a different specialty.'}
                  </p>
                </div>
              ) : (
                displayedDoctors.map((doc, i) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openDoctorProfile(doc)}
                    className="glass-card p-5 group cursor-pointer hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${doc.color} flex items-center justify-center text-2xl font-bold font-display`}>
                          {doc.initials}
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#13131A] rounded-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#00D4AA] rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{doc.name}</h3>
                            <p className="text-sm text-[#00D4AA] font-medium">{doc.spec}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white/5 px-2 py-1 rounded-md">
                              <Star size={12} className="text-[#FFB347] mr-1 fill-[#FFB347]" />
                              <span className="text-xs font-bold">{doc.rating}</span>
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(e, doc.name)}
                              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <Heart size={14} className={favorites.includes(doc.name) ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-[#8B8FA8]'} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {doc.lang.split(', ').map(l => (
                            <span key={l} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-[#8B8FA8] uppercase tracking-wider font-bold">
                              {l}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); openDoctorProfile(doc, 'video'); }}
                            className="flex-1 bg-white/5 hover:bg-white/10 h-11 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <Video size={16} className="text-[#6C63FF] mr-2" />
                            <span className="text-xs font-bold">₹500</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openDoctorProfile(doc, 'chat'); }}
                            className="flex-1 bg-white/5 hover:bg-white/10 h-11 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <MessageSquare size={16} className="text-[#00D4AA] mr-2" />
                            <span className="text-xs font-bold">₹200</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

