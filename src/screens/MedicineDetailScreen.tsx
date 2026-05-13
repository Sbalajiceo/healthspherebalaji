import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, ShieldCheck, Pill, ShoppingCart, Plus, Minus, MapPin, Clock, Star, Store } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import CartScreen from './CartScreen';

export default function MedicineDetailScreen({ medicine }: { medicine: any }) {
  const { popScreen, pushScreen } = useNavigation();
  const { addItem, totalItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedDosage, setSelectedDosage] = useState('10mg');
  const [selectedPharmacy, setSelectedPharmacy] = useState('p1');
  const [isGenericSelected, setIsGenericSelected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectType = (isGeneric: boolean) => {
    if (isGeneric === isGenericSelected) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsGenericSelected(isGeneric);
      setSelectedPharmacy(isGeneric ? 'g1' : 'p1');
      setIsRefreshing(false);
    }, 400);
  };

  const brandPharmacies = [
    { id: 'p1', name: 'Apollo Pharmacy', distance: '1.2 km', time: '15-20 mins', rating: 4.8, isBest: true },
    { id: 'p2', name: 'MedPlus', distance: '2.5 km', time: '30-40 mins', rating: 4.5 },
    { id: 'p3', name: 'Wellness Forever', distance: '3.8 km', time: '45-60 mins', rating: 4.2 },
  ];

  const genericPharmacies = [
    { id: 'g1', name: 'Jan Aushadhi Kendra', distance: '0.8 km', time: '10-15 mins', rating: 4.9, isBest: true },
    { id: 'g2', name: 'Local Chemist', distance: '1.5 km', time: '20-30 mins', rating: 4.3 },
    { id: 'g3', name: 'City Pharma', distance: '3.0 km', time: '40-50 mins', rating: 4.1 },
  ];

  const currentPharmacies = isGenericSelected ? genericPharmacies : brandPharmacies;
  const currentPrice = isGenericSelected ? medicine.generic_price_inr : medicine.brand_price_inr;
  const currentName = isGenericSelected ? medicine.salt_name : medicine.brand_name;
  const currentSubtitle = isGenericSelected ? 'Generic Alternative' : medicine.salt_name;

  const handleAddToCart = () => {
    addItem({
      id: medicine.id ?? medicine.brand_name,
      name: currentName,
      salt: medicine.salt_name,
      price: currentPrice,
      image: medicine.image ?? '',
    }, quantity);
    pushScreen({ id: 'cart', component: <CartScreen /> });
  };

  return (
    <div className={`min-h-screen text-white pb-32 font-sans relative transition-colors duration-500 ${isGenericSelected ? 'bg-gradient-to-br from-[#0A0A0F] via-[#0A192F] to-[#0A0A0F]' : 'bg-[#0A0A0F]'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5 transition-colors duration-500 ${isGenericSelected ? 'bg-[#0A192F]/80' : 'bg-[#0A0A0F]/90'}`}>
        <div className="flex items-center">
          <button onClick={popScreen} className="w-10 h-10 rounded-full bg-[#1A201D] flex items-center justify-center mr-3">
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Product Details</h1>
        </div>
        <button onClick={handleAddToCart} className="w-10 h-10 rounded-full bg-[#1A201D] flex items-center justify-center relative">
          <ShoppingCart size={20} className="text-white" />
          {totalItems > 0 && (
            <span className={`absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-[#111512] border-2 border-[#1A201D] transition-colors ${isGenericSelected ? 'bg-[#00D4AA]' : 'bg-[#84CC16]'}`}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className={`px-5 py-6 space-y-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
        {/* Image Section */}
        <div className="w-full h-64 bg-white rounded-3xl overflow-hidden flex items-center justify-center p-4">
          {medicine.image ? (
            <img src={medicine.image} alt={medicine.brand_name} className="w-full h-full object-contain mix-blend-multiply" />
          ) : (
            <Pill size={64} className={`transition-colors ${isGenericSelected ? 'text-[#00D4AA]/20' : 'text-[#84CC16]/20'}`} />
          )}
        </div>

        {/* Title Section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-white leading-tight pr-4">{currentName}</h2>
          </div>
          <p className="text-[#9CA3AF] text-sm">{currentSubtitle}</p>
          <div className={`flex items-center mt-3 text-xs font-medium self-start inline-flex px-3 py-1.5 rounded-lg transition-colors ${isGenericSelected ? 'text-[#00D4AA] bg-[#00D4AA]/10' : 'text-[#84CC16] bg-[#84CC16]/10'}`}>
            <ShieldCheck size={14} className="mr-1.5" />
            Authentic Product
          </div>
        </div>

        {/* Dosage Options */}
        <div>
          <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Options</h3>
          <div className="flex gap-3">
            {['5mg', '10mg', '20mg'].map(dose => (
              <button
                key={dose}
                onClick={() => setSelectedDosage(dose)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedDosage === dose ? 'bg-[#84CC16]/20 border border-[#84CC16] text-[#84CC16]' : 'bg-[#1A201D] border border-white/5 text-[#9CA3AF]'}`}
              >
                {dose}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Quantity</h3>
          <div className="inline-flex items-center bg-[#1A201D] rounded-full p-1 border border-white/5">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-[#9CA3AF]"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-[#84CC16] flex items-center justify-center text-[#111512]"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Selection Cards */}
        {medicine.generic_available ? (
          <div>
            <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Choose Variant</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Brand Card */}
              <button 
                onClick={() => handleSelectType(false)} 
                className={`p-4 rounded-2xl border text-left transition-all ${!isGenericSelected ? 'bg-[#1A201D] border-[#84CC16]' : 'bg-[#1A201D]/50 border-white/5 hover:border-white/20'}`}
              >
                <div className="text-sm text-[#9CA3AF] mb-1">Brand</div>
                <div className="font-bold text-white text-lg">₹{medicine.brand_price_inr}</div>
              </button>
              
              {/* Generic Card */}
              <button 
                onClick={() => handleSelectType(true)} 
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${isGenericSelected ? 'bg-gradient-to-br from-[#00D4AA]/20 to-[#6C63FF]/20 border-[#00D4AA]' : 'bg-[#1A201D]/50 border-white/5 hover:border-white/20'}`}
              >
                {!isGenericSelected && (
                  <div className="absolute top-0 right-0 bg-[#84CC16] text-[#111512] px-2 py-0.5 rounded-bl-lg font-bold text-[8px] uppercase tracking-wider">
                    Save {Math.round((medicine.savings_inr / medicine.brand_price_inr) * 100)}%
                  </div>
                )}
                <div className={`text-sm mb-1 ${isGenericSelected ? 'text-[#00D4AA]' : 'text-[#84CC16]'}`}>Generic</div>
                <div className="font-bold text-white text-lg">₹{medicine.generic_price_inr}</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#1A201D] p-5 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-[#9CA3AF]">Price</p>
              <p className="text-2xl font-bold text-white">₹{medicine.brand_price_inr * quantity}</p>
            </div>
          </div>
        )}

        {/* Available Pharmacies */}
        <div>
          <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3">Available at Pharmacies</h3>
          <div className="space-y-3">
            {currentPharmacies.map(pharmacy => (
              <div 
                key={pharmacy.id}
                onClick={() => setSelectedPharmacy(pharmacy.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedPharmacy === pharmacy.id ? (isGenericSelected ? 'bg-[#00D4AA]/10 border-[#00D4AA]' : 'bg-[#84CC16]/10 border-[#84CC16]') : 'bg-[#1A201D] border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedPharmacy === pharmacy.id ? (isGenericSelected ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'bg-[#84CC16]/20 text-[#84CC16]') : 'bg-white/5 text-[#9CA3AF]'}`}>
                      <Store size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm">{pharmacy.name}</h4>
                        {pharmacy.isBest && (
                          <span className={`${isGenericSelected ? 'bg-[#00D4AA]' : 'bg-[#84CC16]'} text-[#111512] text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider`}>Best Match</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                        <span className="flex items-center"><MapPin size={12} className="mr-1" /> {pharmacy.distance}</span>
                        <span className="flex items-center"><Clock size={12} className="mr-1" /> {pharmacy.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center bg-white/5 px-2 py-1 rounded-lg">
                    <Star size={12} className="text-[#FFB347] mr-1 fill-[#FFB347]" />
                    <span className="text-xs font-bold text-white">{pharmacy.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-[#1A201D] p-5 rounded-3xl space-y-4 border border-white/5">
          <div>
            <h4 className="font-bold text-sm mb-1 text-white">Description</h4>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">This product is used for the treatment and prevention of specific conditions related to its composition. Please consult your doctor before use.</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-5 z-40 max-w-[390px] mx-auto">
        <motion.button 
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
          className={`w-full h-14 rounded-2xl text-[#111512] font-bold text-lg flex items-center justify-between px-6 transition-colors duration-500 ${isGenericSelected ? 'bg-primary-gradient shadow-[0_8px_30px_rgba(0,212,170,0.3)] text-white' : 'bg-[#84CC16] shadow-[0_8px_30px_rgba(132,204,22,0.3)]'}`}
        >
          <span className="flex items-center"><ShoppingCart size={20} className="mr-2" /> Add to Cart</span>
          <span>₹{currentPrice * quantity}</span>
        </motion.button>
      </div>
    </div>
  );
}
