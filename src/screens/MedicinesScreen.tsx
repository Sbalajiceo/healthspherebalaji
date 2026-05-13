import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Upload, Plus, Search, ShoppingCart, ChevronRight, Activity, Heart, Thermometer, Pill } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import MedicineDetailScreen from './MedicineDetailScreen';
import CartScreen from './CartScreen';

const CATEGORIES = [
  { id: 1, name: 'Vitamins', icon: <Pill size={24} className="text-[#84CC16]" />, color: 'bg-[#84CC16]/10' },
  { id: 2, name: 'Devices', icon: <Activity size={24} className="text-[#3B82F6]" />, color: 'bg-[#3B82F6]/10' },
  { id: 3, name: 'Personal Care', icon: <Heart size={24} className="text-[#EC4899]" />, color: 'bg-[#EC4899]/10' },
  { id: 4, name: 'Ayurveda', icon: <Thermometer size={24} className="text-[#F59E0B]" />, color: 'bg-[#F59E0B]/10' },
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
    generic_available: true,
    generic_price_inr: 35,
    brand_price_inr: 119,
    savings_inr: 84,
    price_display: "₹119",
    image: "https://images.unsplash.com/photo-1550572017-edb3f8e4e6f4?q=80&w=400&auto=format&fit=crop",
  }
];

const MOCK_AI_REC = [
  {
    id: 5,
    brand_name: "Vicks Vaporub 50ml",
    salt_name: "Menthol + Camphor",
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
    generic_available: true,
    generic_price_inr: 15,
    brand_price_inr: 30,
    savings_inr: 15,
    price_display: "₹30",
    subtitle: "Tablets • 15 pills",
    discount: "10% OFF",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=400&auto=format&fit=crop",
  }
];

export default function MedicinesScreen() {
  const { pushScreen } = useNavigation();

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

  return (
    <div className="min-h-screen bg-[#111512] text-white pb-32 font-sans">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" 
            alt="Profile" 
            className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">Bocchi The Rock</h1>
            <p className="text-[#9CA3AF] text-xs mt-0.5">13 Prescriptions • 85% Score</p>
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
            <span className="absolute top-2 right-2 w-4 h-4 bg-[#84CC16] rounded-full flex items-center justify-center text-[10px] font-bold text-[#111512] border-2 border-[#1A201D]">
              2
            </span>
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
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer">
              <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center border border-white/5`}>
                {cat.icon}
              </div>
              <span className="text-xs text-center font-medium text-[#9CA3AF]">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop by Concern */}
      <div className="mb-8">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shop by Concern</h2>
          <button className="text-[#84CC16] text-sm font-medium">See All</button>
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

      {/* Most Popular */}
      <div className="mt-2">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Trending Products</h2>
          <button className="text-[#84CC16] text-sm font-medium">See All</button>
        </div>
        
        <div className="flex overflow-x-auto px-5 pb-6 gap-4 no-scrollbar">
          {MOCK_POPULAR.map((med) => (
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
                <button 
                  onClick={(e) => { e.stopPropagation(); openCart(); }}
                  className="w-8 h-8 rounded-full bg-[#84CC16] flex items-center justify-center text-[#111512]"
                >
                  <Plus size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-4">
        <div className="px-5 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">AI Recommendation</h2>
          <button className="text-[#84CC16] text-sm font-medium">See All</button>
        </div>
        
        <div className="flex overflow-x-auto px-5 pb-6 gap-4 no-scrollbar">
          {MOCK_AI_REC.map((med) => (
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
                <button 
                  onClick={(e) => { e.stopPropagation(); openCart(); }}
                  className="w-full h-10 rounded-xl bg-[#84CC16]/10 text-[#84CC16] font-bold text-sm flex items-center justify-center border border-[#84CC16]/20"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-6 left-0 right-0 px-5 z-40 max-w-[390px] mx-auto">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full h-14 rounded-2xl bg-[#84CC16] text-[#111512] font-bold text-lg flex items-center justify-center shadow-[0_8px_30px_rgba(132,204,22,0.3)]"
        >
          Upload Prescription <Upload size={20} className="ml-2" />
        </motion.button>
      </div>
    </div>
  );
}
