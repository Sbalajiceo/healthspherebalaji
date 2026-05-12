import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Upload, Plus, Search, ShoppingCart, Activity, Heart, Thermometer, Pill, X, Camera, FileText } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import MedicineDetailScreen from './MedicineDetailScreen';
import CartScreen from './CartScreen';

const CATEGORIES = [
  { id: 1, name: 'Vitamins', icon: <Pill size={24} className="text-[#84CC16]" />, color: 'bg-[#84CC16]/10', activeColor: 'bg-[#84CC16]/30 border-[#84CC16]' },
  { id: 2, name: 'Devices', icon: <Activity size={24} className="text-[#3B82F6]" />, color: 'bg-[#3B82F6]/10', activeColor: 'bg-[#3B82F6]/30 border-[#3B82F6]' },
  { id: 3, name: 'Personal Care', icon: <Heart size={24} className="text-[#EC4899]" />, color: 'bg-[#EC4899]/10', activeColor: 'bg-[#EC4899]/30 border-[#EC4899]' },
  { id: 4, name: 'Ayurveda', icon: <Thermometer size={24} className="text-[#F59E0B]" />, color: 'bg-[#F59E0B]/10', activeColor: 'bg-[#F59E0B]/30 border-[#F59E0B]' },
];

const SHOP_BY_CONCERN = [
  { name: 'Diabetes Care', image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=200&auto=format&fit=crop' },
  { name: 'Heart Care', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=200&auto=format&fit=crop' },
  { name: 'Stomach Care', image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=200&auto=format&fit=crop' },
  { name: 'Joint Pain', image: 'https://images.unsplash.com/photo-1554605445-50f62272a249?q=80&w=200&auto=format&fit=crop' },
];

const MOCK_POPULAR = [
  {
    id: 1,
    brand_name: "Accu-Chek Active Test Strips",
    salt_name: "Diagnostic Device",
    category: "Devices",
    generic_available: false,
    brand_price_inr: 975,
    generic_price_inr: 975,
    savings_inr: 0,
    price_display: "₹975",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    brand_name: "Ensure Diabetes Care (Vanilla)",
    salt_name: "Nutritional Drink",
    category: "Vitamins",
    generic_available: false,
    brand_price_inr: 1250,
    generic_price_inr: 1250,
    savings_inr: 0,
    price_display: "₹1,250",
    image: "https://images.unsplash.com/photo-1640592398327-1428a2a1975b?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    brand_name: "Pan 40mg Tablet",
    salt_name: "Pantoprazole",
    category: "Vitamins",
    generic_available: true,
    generic_price_inr: 45,
    brand_price_inr: 155,
    savings_inr: 110,
    price_display: "₹155",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    brand_name: "Shelcal 500mg",
    salt_name: "Calcium + Vitamin D3",
    category: "Vitamins",
    generic_available: true,
    generic_price_inr: 35,
    brand_price_inr: 119,
    savings_inr: 84,
    price_display: "₹119",
    image: "https://images.unsplash.com/photo-1550572017-edb3f8e4e6f4?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 7,
    brand_name: "Ashwagandha KSM-66",
    salt_name: "Withania Somnifera Extract",
    category: "Ayurveda",
    generic_available: false,
    brand_price_inr: 599,
    generic_price_inr: 599,
    savings_inr: 0,
    price_display: "₹599",
    image: "https://images.unsplash.com/photo-1550572017-edb3f8e4e6f4?q=80&w=400&auto=format&fit=crop",
  },
];

const MOCK_AI_REC = [
  {
    id: 5,
    brand_name: "Vicks Vaporub 50ml",
    salt_name: "Menthol + Camphor",
    category: "Personal Care",
    generic_available: false,
    generic_price_inr: 150,
    brand_price_inr: 150,
    savings_inr: 0,
    price_display: "₹150",
    subtitle: "Ointment • 50g",
    discount: "5% OFF",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    brand_name: "Dolo 650 Tablet",
    salt_name: "Paracetamol",
    category: "Vitamins",
    generic_available: true,
    generic_price_inr: 15,
    brand_price_inr: 30,
    savings_inr: 15,
    price_display: "₹30",
    subtitle: "Tablets • 15 pills",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 8,
    brand_name: "Himalaya Neem Face Wash",
    salt_name: "Neem + Turmeric",
    category: "Personal Care",
    generic_available: false,
    generic_price_inr: 130,
    brand_price_inr: 130,
    savings_inr: 0,
    price_display: "₹130",
    subtitle: "Face Wash • 100ml",
    discount: "8% OFF",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 9,
    brand_name: "Omron BP Monitor",
    salt_name: "Diagnostic Device",
    category: "Devices",
    generic_available: false,
    generic_price_inr: 2499,
    brand_price_inr: 2499,
    savings_inr: 0,
    price_display: "₹2,499",
    subtitle: "Upper Arm • Auto",
    discount: "12% OFF",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
  },
];

export default function MedicinesScreen() {
  const { pushScreen } = useNavigation();
  const { addItem, totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [showAllAiRec, setShowAllAiRec] = useState(false);
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const filteredPopular = activeCategory ? MOCK_POPULAR.filter(m => m.category === activeCategory) : MOCK_POPULAR;
  const filteredAiRec = activeCategory ? MOCK_AI_REC.filter(m => m.category === activeCategory) : MOCK_AI_REC;

  const openMedicineDetail = (medicine: any) => {
    pushScreen({
      id: `medicine-${medicine.id}`,
      component: <MedicineDetailScreen medicine={medicine} />
    });
  };

  const openCart = () => {
    pushScreen({
      id: 'cart',
      component: <CartScreen />
    });
  };

  const quickAdd = (med: any) => {
    addItem({
      id: med.id,
      name: med.brand_name,
      salt: med.salt_name,
      price: med.brand_price_inr,
      image: med.image ?? '',
    });
    openCart();
  };

  const toggleCategory = (name: string) => {
    setActiveCategory(prev => prev === name ? null : name);
    setShowAllTrending(false);
    setShowAllAiRec(false);
  };

  return (
    <div className="min-h-screen bg-[#111512] text-white pb-32 font-sans">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://picsum.photos/seed/sandeep/100/100"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">Sandeep</h1>
            <p className="text-[#9CA3AF] text-xs mt-0.5">13 Prescriptions • 78% Score</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-full bg-[#1A201D] flex items-center justify-center relative">
            <Bell size={20} className="text-white" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#1A201D]">
              8
            </span>
          </button>
          <button onClick={openCart} className="w-12 h-12 rounded-full bg-[#1A201D] flex items-center justify-center relative">
            <ShoppingCart size={20} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#84CC16] rounded-full flex items-center justify-center text-[10px] font-bold text-[#111512] border-2 border-[#1A201D]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-6">
        <div className="bg-[#1A201D] rounded-2xl flex items-center px-4 py-3.5 border border-white/5">
          <Search size={20} className="text-[#9CA3AF] mr-3" />
          <input 
            type="text" 
            placeholder="Search medicines, health products..." 
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button key={cat.id} onClick={() => toggleCategory(cat.name)} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${isActive ? cat.activeColor : `${cat.color} border-white/5`}`}>
                  {cat.icon}
                </div>
                <span className={`text-xs text-center font-medium transition-colors ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`}>{cat.name}</span>
              </button>
            );
          })}
        </div>
        {activeCategory && (
          <p className="text-xs text-[#84CC16] font-medium mt-2">Showing {activeCategory} products</p>
        )}
      </div>

      {/* Shop by Concern */}
      <div className="mb-8">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shop by Concern</h2>
          <button onClick={() => { setActiveCategory(null); setShowAllTrending(true); }} className="text-[#84CC16] text-sm font-medium">See All</button>
        </div>
        <div className="flex overflow-x-auto px-5 pb-2 gap-4 no-scrollbar">
          {SHOP_BY_CONCERN.map((concern, idx) => (
            <div key={idx} className="w-20 shrink-0 flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1A201D]">
                <img src={concern.image} alt={concern.name} className="w-full h-full object-cover opacity-80" />
              </div>
              <span className="text-xs text-center font-medium text-[#9CA3AF]">{concern.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="mt-2">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Trending Products</h2>
          <button onClick={() => setShowAllTrending(v => !v)} className="text-[#84CC16] text-sm font-medium">
            {showAllTrending ? 'Show Less' : 'See All'}
          </button>
        </div>

        {showAllTrending ? (
          <div className="px-5 grid grid-cols-2 gap-4 pb-6">
            {(filteredPopular.length > 0 ? filteredPopular : MOCK_POPULAR).map((med) => (
              <motion.div
                key={med.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openMedicineDetail(med)}
                className="bg-[#1A201D] rounded-3xl p-3 cursor-pointer"
              >
                <div className="w-full h-28 bg-white rounded-2xl mb-3 overflow-hidden flex items-center justify-center">
                  <img src={med.image} alt={med.brand_name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                </div>
                <h3 className="font-bold text-xs leading-tight mb-2 line-clamp-2">{med.brand_name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{med.price_display}</span>
                  <button onClick={(e) => { e.stopPropagation(); quickAdd(med); }} className="w-7 h-7 rounded-full bg-[#84CC16] flex items-center justify-center text-[#111512]">
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto px-5 pb-6 gap-4 no-scrollbar">
            {filteredPopular.map((med) => (
              <motion.div
                key={med.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openMedicineDetail(med)}
                className="w-40 shrink-0 bg-[#1A201D] rounded-3xl p-3 cursor-pointer"
              >
                <div className="w-full h-32 bg-white rounded-2xl mb-3 overflow-hidden flex items-center justify-center">
                  <img src={med.image} alt={med.brand_name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                </div>
                <h3 className="font-bold text-sm leading-tight mb-3 line-clamp-2 h-10">{med.brand_name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{med.price_display}</span>
                  <button onClick={(e) => { e.stopPropagation(); quickAdd(med); }} className="w-8 h-8 rounded-full bg-[#84CC16] flex items-center justify-center text-[#111512]">
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredPopular.length === 0 && (
              <p className="text-[#9CA3AF] text-sm px-2 py-8">No products in this category.</p>
            )}
          </div>
        )}
      </div>

      {/* AI Recommendation */}
      <div className="mt-4">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">AI Recommendation</h2>
          <button onClick={() => setShowAllAiRec(v => !v)} className="text-[#84CC16] text-sm font-medium">
            {showAllAiRec ? 'Show Less' : 'See All'}
          </button>
        </div>

        {showAllAiRec ? (
          <div className="px-5 space-y-4 pb-6">
            {(filteredAiRec.length > 0 ? filteredAiRec : MOCK_AI_REC).map((med) => (
              <motion.div
                key={med.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openMedicineDetail(med)}
                className="bg-[#1A201D] rounded-3xl p-3 cursor-pointer flex gap-3"
              >
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 relative">
                  <div className="absolute top-1 left-1 bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">{med.discount}</div>
                  <img src={med.image} alt={med.brand_name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-tight mb-1">{med.brand_name}</h3>
                  <p className="text-[#9CA3AF] text-xs mb-2">{med.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{med.price_display}</span>
                    <button onClick={(e) => { e.stopPropagation(); quickAdd(med); }} className="px-3 h-8 rounded-xl bg-[#84CC16]/10 text-[#84CC16] font-bold text-xs border border-[#84CC16]/20">
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredAiRec.length === 0 && (
              <p className="text-[#9CA3AF] text-sm px-2 py-4">No recommendations in this category.</p>
            )}
          </div>
        ) : (
          <div className="flex overflow-x-auto px-5 pb-6 gap-4 no-scrollbar">
            {filteredAiRec.map((med) => (
              <motion.div
                key={med.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openMedicineDetail(med)}
                className="w-72 shrink-0 bg-[#1A201D] rounded-3xl p-3 cursor-pointer"
              >
                <div className="w-full h-36 bg-white rounded-2xl mb-3 overflow-hidden relative">
                  <div className="absolute top-3 left-3 bg-[#EF4444] text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    {med.discount}
                  </div>
                  <img src={med.image} alt={med.brand_name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                </div>
                <div className="px-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 flex-1">{med.brand_name}</h3>
                    <span className="font-bold text-lg">{med.price_display}</span>
                  </div>
                  <p className="text-[#9CA3AF] text-xs mb-3">{med.subtitle}</p>
                  <button onClick={(e) => { e.stopPropagation(); quickAdd(med); }} className="w-full h-10 rounded-xl bg-[#84CC16]/10 text-[#84CC16] font-bold text-sm flex items-center justify-center border border-[#84CC16]/20">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredAiRec.length === 0 && (
              <p className="text-[#9CA3AF] text-sm px-5 py-8">No recommendations in this category.</p>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-6 left-0 right-0 px-5 z-40 max-w-[390px] mx-auto">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadSheet(true)}
          className="w-full h-14 rounded-2xl bg-[#84CC16] text-[#111512] font-bold text-lg flex items-center justify-center shadow-[0_8px_30px_rgba(132,204,22,0.3)]"
        >
          Upload Prescription <Upload size={20} className="ml-2" />
        </motion.button>
      </div>

      {/* Upload Prescription Sheet */}
      <AnimatePresence>
        {showUploadSheet && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C]/90 backdrop-blur-sm flex flex-col justify-end max-w-[390px] mx-auto"
          >
            <div className="bg-[#13131A] rounded-t-3xl p-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">Upload Prescription</h2>
                <button onClick={() => { setShowUploadSheet(false); setSelectedFile(null); }} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center mb-4 transition-colors ${selectedFile ? 'border-[#84CC16] bg-[#84CC16]/5' : 'border-white/20 bg-white/5 cursor-pointer'}`}
                onClick={() => !selectedFile && setSelectedFile('prescription.pdf')}
              >
                {selectedFile ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 flex items-center justify-center mb-4">
                      <FileText size={32} className="text-[#84CC16]" />
                    </div>
                    <p className="font-bold text-white mb-1">{selectedFile}</p>
                    <p className="text-[#9CA3AF] text-sm mb-4">1.2 MB • PDF</p>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-[#EF4444] text-sm font-bold px-4 py-2 rounded-full bg-[#EF4444]/10">Remove</button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 flex items-center justify-center mb-4">
                      <Upload size={32} className="text-[#84CC16]" />
                    </div>
                    <p className="font-bold text-white mb-1">Tap to Browse</p>
                    <p className="text-[#9CA3AF] text-sm">PDF, JPG, PNG · Max 5MB</p>
                  </>
                )}
              </div>

              {!selectedFile && (
                <button
                  onClick={() => setSelectedFile('scan.jpg')}
                  className="w-full bg-[#1A201D] rounded-2xl p-4 flex items-center justify-center gap-3 mb-4 border border-white/5"
                >
                  <Camera size={20} className="text-[#84CC16]" />
                  <span className="font-bold">Take a Photo</span>
                </button>
              )}

              <button
                disabled={!selectedFile}
                onClick={() => {
                  setShowUploadSheet(false);
                  setSelectedFile(null);
                  openCart();
                }}
                className={`w-full h-14 rounded-2xl font-bold text-lg transition-all ${selectedFile ? 'bg-[#84CC16] text-[#111512] shadow-[0_8px_30px_rgba(132,204,22,0.3)]' : 'bg-white/10 text-[#9CA3AF] cursor-not-allowed'}`}
              >
                Process Prescription
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
