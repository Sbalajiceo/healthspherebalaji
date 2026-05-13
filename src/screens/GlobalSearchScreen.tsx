import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronLeft, Star, Beaker, Stethoscope, Pill, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import DoctorProfileScreen from './DoctorProfileScreen';
import MedicineDetailScreen from './MedicineDetailScreen';
import LabBookingScreen from './LabBookingScreen';

const DOCTORS = [
  { name: 'Dr. Priya Sharma', spec: 'Cardiologist', exp: '12 yrs', rating: 4.9, lang: 'Hindi, English', initials: 'P', color: 'from-[#6C63FF] to-[#00D4AA]' },
  { name: 'Dr. Arjun Reddy', spec: 'General Physician', exp: '8 yrs', rating: 4.8, lang: 'Telugu, English', initials: 'A', color: 'from-[#FF6B9D] to-[#FF9F7F]' },
  { name: 'Dr. Sarah Khan', spec: 'Dermatologist', exp: '15 yrs', rating: 4.9, lang: 'Urdu, English', initials: 'S', color: 'from-[#00C9A7] to-[#A8FF78]' },
];

const MEDICINES = [
  { id: 1, brand_name: 'Accu-Chek Active Test Strips', salt_name: 'Diagnostic Device', brand_price_inr: 975, generic_price_inr: 975, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
  { id: 2, brand_name: 'Ensure Diabetes Care (Vanilla)', salt_name: 'Nutritional Drink', brand_price_inr: 1250, generic_price_inr: 1250, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1640592398327-1428a2a1975b?q=80&w=400&auto=format&fit=crop' },
  { id: 3, brand_name: 'Pan 40mg Tablet', salt_name: 'Pantoprazole', brand_price_inr: 155, generic_price_inr: 45, generic_available: true, savings_inr: 110, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop' },
  { id: 4, brand_name: 'Shelcal 500mg', salt_name: 'Calcium + Vitamin D3', brand_price_inr: 119, generic_price_inr: 35, generic_available: true, savings_inr: 84, image: 'https://images.unsplash.com/photo-1550572017-edb3f8e4e6f4?q=80&w=400&auto=format&fit=crop' },
  { id: 5, brand_name: 'Vicks Vaporub 50ml', salt_name: 'Menthol + Camphor', brand_price_inr: 150, generic_price_inr: 150, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
  { id: 6, brand_name: 'Dolo 650 Tablet', salt_name: 'Paracetamol', brand_price_inr: 30, generic_price_inr: 15, generic_available: true, savings_inr: 15, image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop' },
  { id: 7, brand_name: 'Ashwagandha KSM-66', salt_name: 'Withania Somnifera Extract', brand_price_inr: 599, generic_price_inr: 599, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1550572017-edb3f8e4e6f4?q=80&w=400&auto=format&fit=crop' },
  { id: 8, brand_name: 'Himalaya Neem Face Wash', salt_name: 'Neem + Turmeric', brand_price_inr: 130, generic_price_inr: 130, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400&auto=format&fit=crop' },
  { id: 9, brand_name: 'Omron BP Monitor', salt_name: 'Diagnostic Device', brand_price_inr: 2499, generic_price_inr: 2499, generic_available: false, savings_inr: 0, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
  { id: 10, brand_name: 'Amlong 5mg', salt_name: 'Amlodipine (5mg)', brand_price_inr: 45, generic_price_inr: 15, generic_available: true, savings_inr: 30, image: null as unknown as string },
];

const LAB_TESTS = [
  { id: 'cbc',    name: 'Complete Blood Count (CBC)',  price: 299, turnaround: '6 hrs',  category: 'Blood' },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)', price: 499, turnaround: '12 hrs', category: 'Diabetes' },
  { id: 'lipid', name: 'Lipid Profile',                price: 599, turnaround: '12 hrs', category: 'Heart' },
  { id: 'tsh',   name: 'Thyroid (TSH, T3, T4)',        price: 799, turnaround: '24 hrs', category: 'Thyroid' },
  { id: 'sugar', name: 'Fasting Blood Sugar',          price: 199, turnaround: '4 hrs',  category: 'Diabetes' },
  { id: 'vitd',  name: 'Vitamin D3 (25-OH)',           price: 999, turnaround: '24 hrs', category: 'Vitamins' },
  { id: 'kidney',name: 'Kidney Function (KFT)',        price: 699, turnaround: '12 hrs', category: 'Kidney' },
  { id: 'liver', name: 'Liver Function (LFT)',         price: 699, turnaround: '12 hrs', category: 'Liver' },
  { id: 'uric',  name: 'Uric Acid',                   price: 249, turnaround: '6 hrs',  category: 'Joints' },
  { id: 'covid', name: 'COVID-19 RT-PCR',             price: 399, turnaround: '6 hrs',  category: 'Viral' },
];

const TRENDING = ['Paracetamol', 'Vitamin D', 'Cardiologist', 'Blood Sugar Test', 'BP Monitor', 'Thyroid'];
const RECENT_KEY = 'hs_recent_searches';

type Tab = 'all' | 'doctors' | 'medicines' | 'labs';

export default function GlobalSearchScreen() {
  const { pushScreen, popScreen } = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const q = query.toLowerCase().trim();

  const matchedDoctors = q
    ? DOCTORS.filter(d => d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q))
    : [];
  const matchedMedicines = q
    ? MEDICINES.filter(m => m.brand_name.toLowerCase().includes(q) || m.salt_name.toLowerCase().includes(q))
    : [];
  const matchedLabs = q
    ? LAB_TESTS.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    : [];

  const total = matchedDoctors.length + matchedMedicines.length + matchedLabs.length;

  const saveRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(r => r !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const openDoctor = (doc: typeof DOCTORS[0]) => {
    saveRecent(doc.name);
    pushScreen({ id: `srch-doc-${doc.name}`, component: <DoctorProfileScreen doctor={doc} consultType="TELECONSULT" /> });
  };

  const openMedicine = (med: typeof MEDICINES[0]) => {
    saveRecent(med.brand_name);
    pushScreen({ id: `srch-med-${med.id}`, component: <MedicineDetailScreen medicine={med} /> });
  };

  const openLab = (test: typeof LAB_TESTS[0]) => {
    saveRecent(test.name);
    pushScreen({ id: 'srch-lab', component: <LabBookingScreen /> });
  };

  const quickFill = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const showDoctors   = (activeTab === 'all' || activeTab === 'doctors')   && matchedDoctors.length > 0;
  const showMedicines = (activeTab === 'all' || activeTab === 'medicines') && matchedMedicines.length > 0;
  const showLabs      = (activeTab === 'all' || activeTab === 'labs')      && matchedLabs.length > 0;
  const sliceAll      = (arr: any[]) => activeTab === 'all' ? arr.slice(0, 3) : arr;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-md px-4 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <Search size={18} className="text-[#8B8FA8] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveTab('all'); }}
              placeholder="Search doctors, medicines, labs..."
              className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder:text-[#8B8FA8]"
            />
            {query && (
              <button onClick={() => setQuery('')} className="ml-2 p-1">
                <X size={15} className="text-[#8B8FA8]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <AnimatePresence>
          {q && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1"
            >
              {(['all', 'doctors', 'medicines', 'labs'] as Tab[]).map(tab => {
                const count = tab === 'all' ? total : tab === 'doctors' ? matchedDoctors.length : tab === 'medicines' ? matchedMedicines.length : matchedLabs.length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#6C63FF] text-white' : 'bg-white/5 text-[#8B8FA8] border border-white/10'}`}
                  >
                    {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 pb-12">

        {/* Empty state — recent + trending */}
        {!q && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#8B8FA8]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8]">Recent</span>
                  </div>
                  <button
                    onClick={() => { setRecentSearches([]); localStorage.removeItem(RECENT_KEY); }}
                    className="text-xs text-[#8B8FA8] hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map(r => (
                    <button
                      key={r}
                      onClick={() => quickFill(r)}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors text-left"
                    >
                      <Clock size={15} className="text-[#8B8FA8] shrink-0" />
                      <span className="text-sm">{r}</span>
                      <ArrowUpRight size={14} className="text-[#8B8FA8] ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-[#FFB347]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8]">Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(t => (
                  <button
                    key={t}
                    onClick={() => quickFill(t)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Category quick-access */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8] block mb-3">Browse</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Doctors', icon: Stethoscope, color: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10', q: 'doctor' },
                  { label: 'Medicines', icon: Pill, color: 'text-[#00D4AA]', bg: 'bg-[#00D4AA]/10', q: 'tablet' },
                  { label: 'Lab Tests', icon: Beaker, color: 'text-[#FF6B9D]', bg: 'bg-[#FF6B9D]/10', q: 'blood' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => quickFill(item.q)}
                    className="glass-card p-4 flex flex-col items-center gap-2 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon size={18} className={item.color} />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* No results */}
        {q && total === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-xl mb-2">No results found</h3>
            <p className="text-[#8B8FA8] text-sm px-6">Try searching for a doctor name, medicine, or lab test name.</p>
          </motion.div>
        )}

        {/* Results */}
        {q && total > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Doctors */}
            {showDoctors && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope size={13} className="text-[#6C63FF]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8]">Doctors</span>
                  <span className="ml-auto text-xs text-[#8B8FA8]">{matchedDoctors.length} found</span>
                </div>
                <div className="space-y-2">
                  {sliceAll(matchedDoctors).map(doc => (
                    <motion.button
                      key={doc.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openDoctor(doc)}
                      className="w-full glass-card p-4 flex items-center gap-4 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${doc.color} flex items-center justify-center font-bold font-display text-lg shrink-0`}>
                        {doc.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{doc.name}</p>
                        <p className="text-xs text-[#00D4AA] mt-0.5">{doc.spec} · {doc.exp}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">{doc.lang}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 bg-white/5 px-2 py-1 rounded-lg">
                        <Star size={11} className="text-[#FFB347] fill-[#FFB347]" />
                        <span className="text-xs font-bold">{doc.rating}</span>
                      </div>
                    </motion.button>
                  ))}
                  {activeTab === 'all' && matchedDoctors.length > 3 && (
                    <button onClick={() => setActiveTab('doctors')} className="w-full py-2.5 text-xs font-bold text-[#6C63FF] flex items-center justify-center gap-1">
                      See all {matchedDoctors.length} doctors <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Medicines */}
            {showMedicines && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Pill size={13} className="text-[#00D4AA]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8]">Medicines & Products</span>
                  <span className="ml-auto text-xs text-[#8B8FA8]">{matchedMedicines.length} found</span>
                </div>
                <div className="space-y-2">
                  {sliceAll(matchedMedicines).map(med => (
                    <motion.button
                      key={med.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openMedicine(med)}
                      className="w-full glass-card p-4 flex items-center gap-4 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        {med.image
                          ? <img src={med.image} alt={med.brand_name} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
                          : <Pill size={20} className="text-[#6C63FF]" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{med.brand_name}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">{med.salt_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm">₹{med.brand_price_inr}</p>
                        {med.generic_available && (
                          <p className="text-xs text-[#00D4AA] mt-0.5">Generic ₹{med.generic_price_inr}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                  {activeTab === 'all' && matchedMedicines.length > 3 && (
                    <button onClick={() => setActiveTab('medicines')} className="w-full py-2.5 text-xs font-bold text-[#00D4AA] flex items-center justify-center gap-1">
                      See all {matchedMedicines.length} medicines <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* Lab Tests */}
            {showLabs && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Beaker size={13} className="text-[#FF6B9D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B8FA8]">Lab Tests</span>
                  <span className="ml-auto text-xs text-[#8B8FA8]">{matchedLabs.length} found</span>
                </div>
                <div className="space-y-2">
                  {sliceAll(matchedLabs).map(test => (
                    <motion.button
                      key={test.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openLab(test)}
                      className="w-full glass-card p-4 flex items-center gap-4 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#FF6B9D]/10 flex items-center justify-center shrink-0">
                        <Beaker size={20} className="text-[#FF6B9D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{test.name}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">Results in {test.turnaround} · {test.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-[#6C63FF]">₹{test.price}</p>
                        <p className="text-xs text-[#8B8FA8] mt-0.5">Book now</p>
                      </div>
                    </motion.button>
                  ))}
                  {activeTab === 'all' && matchedLabs.length > 3 && (
                    <button onClick={() => setActiveTab('labs')} className="w-full py-2.5 text-xs font-bold text-[#FF6B9D] flex items-center justify-center gap-1">
                      See all {matchedLabs.length} tests <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
