import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Target, Moon, Zap, Shield, ArrowRight, X, Sparkles, Loader2, Bell, Check } from 'lucide-react';
import { generateWellnessPlan } from '../services/geminiService';
import { useReminders } from '../contexts/ReminderContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import CategoryPlanFlow from './CategoryPlanFlow';
import MedicinesScreen from './MedicinesScreen';

const QUIZ_QUESTIONS = [
  {
    id: 'goal',
    question: "What's your primary wellness goal?",
    options: ["Weight Reset", "Better Sleep", "More Energy", "Less Stress"]
  },
  {
    id: 'activity',
    question: "How active are you currently?",
    options: ["Sedentary", "Lightly Active", "Very Active", "Athlete"]
  },
  {
    id: 'diet',
    question: "How would you describe your diet?",
    options: ["Balanced", "High Protein", "Vegetarian/Vegan", "Needs Improvement"]
  },
  {
    id: 'sleep',
    question: "How many hours do you sleep?",
    options: ["Less than 5", "5-6 hours", "7-8 hours", "More than 8"]
  },
  {
    id: 'challenge',
    question: "What's your biggest challenge?",
    options: ["Lack of Time", "Low Motivation", "Cravings", "Poor Sleep"]
  }
];

const WELLNESS_PRODUCTS = [
  { id: 'w1', name: 'Ashwagandha KSM-66',    benefit: 'Stress & Energy', price: 599,  color: 'from-[#6C63FF] to-[#00D4AA]', badge: 'Bestseller' },
  { id: 'w2', name: 'Deep Sleep Melatonin',  benefit: 'Rest & Recovery', price: 450,  color: 'from-[#FF6B9D] to-[#FF9F7F]', badge: 'New' },
  { id: 'w3', name: 'Plant Protein Isolate', benefit: 'Muscle Repair',   price: 1299, color: 'from-[#00C9A7] to-[#A8FF78]', badge: '' },
];

export default function WellnessScreen() {
  const { pushScreen } = useNavigation();
  const { addItem } = useCart();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [checkedGoals, setCheckedGoals] = useState<Set<number>>(new Set());
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { enablePlanReminders, disablePlanReminders, remindersActive } = useReminders();

  const addWellnessProduct = (product: typeof WELLNESS_PRODUCTS[0]) => {
    addItem({ id: product.id, name: product.name, salt: product.benefit, price: product.price, image: '' });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  const toggleGoal = (i: number) => {
    setCheckedGoals(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const handleOptionSelect = async (option: string) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentQuestion].id]: option };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finished quiz
      setIsGenerating(true);
      const plan = await generateWellnessPlan(newAnswers);
      setActivePlan(plan);
      setIsGenerating(false);
      setShowQuiz(false);
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-0 pb-24"
    >
      {/* Hero Section */}
      <div className="relative pt-12 pb-8 px-4 overflow-hidden">
        {/* Organic Blob Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-wellness-gradient opacity-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }} />
        
        <div className="relative z-10">
          <div className="inline-flex items-center bg-[#00C9A7]/20 border border-[#00C9A7]/30 px-3 py-1 rounded-full mb-4">
            <Flame size={14} className="text-[#00C9A7] mr-1" />
            <span className="text-xs font-bold text-[#00C9A7] uppercase tracking-wider">4 Day Streak</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            Optimize your<br />
            <span className="text-wellness-gradient">daily performance.</span>
          </h1>
        </div>
      </div>

      <div className="px-4 space-y-8">
        {/* Active Plan */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-display text-xl font-bold">Active Plan</h2>
            <span className="text-xs text-[#00C9A7] font-bold uppercase tracking-wider">Week 1/8</span>
          </div>
          
          {!activePlan ? (
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-wellness-gradient mx-auto flex items-center justify-center mb-4">
                <Sparkles size={20} className="text-[#080F0C]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Ready for a change?</h3>
              <p className="text-sm text-[#8B8FA8] mb-5">Take our 1-minute quiz to get a personalized wellness plan powered by AI.</p>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-wellness-gradient text-[#080F0C] font-bold py-3 px-6 rounded-full shadow-[0_4px_20px_rgba(0,201,167,0.3)] hover:scale-105 transition-transform min-h-[44px]"
              >
                Take Wellness Quiz
              </button>
            </div>
          ) : (
            <div className="glass-card p-0 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-wellness-gradient" />
              <div className="p-5 pl-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-lg">{activePlan.plan_name}</h3>
                    <p className="text-sm text-[#8B8FA8] mt-1">{activePlan.tagline}</p>
                  </div>
                  <button
                    onClick={() => remindersActive ? disablePlanReminders() : enablePlanReminders(activePlan.weekly_goals)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${remindersActive ? 'bg-[#00C9A7]/20 text-[#00C9A7]' : 'bg-white/5 text-[#8B8FA8] hover:bg-white/10'}`}
                  >
                    <Bell size={18} className={remindersActive ? 'fill-[#00C9A7]' : ''} />
                  </button>
                </div>
                
                <div className="space-y-3 mt-5">
                  {activePlan.weekly_goals?.map((task: string, i: number) => (
                    <button key={i} onClick={() => toggleGoal(i)} className="flex items-center w-full text-left">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 shrink-0 transition-all ${checkedGoals.has(i) ? 'bg-[#00C9A7] border-[#00C9A7]' : 'border-white/20'}`}>
                        {checkedGoals.has(i) && <Check size={11} className="text-[#080F0C]" />}
                      </div>
                      <span className={`text-sm transition-colors ${checkedGoals.has(i) ? 'text-white/40 line-through' : 'text-white'}`}>{task}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Wellness Store */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-display text-xl font-bold italic">Wellness Store ✦</h2>
            <button
              onClick={() => pushScreen({ id: 'wellness-store', component: <MedicinesScreen /> })}
              className="text-xs text-[#8B8FA8] font-medium flex items-center h-11 px-2"
            >
              View All <ArrowRight size={12} className="ml-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 no-scrollbar">
            {WELLNESS_PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                className={`w-44 h-64 shrink-0 rounded-3xl overflow-hidden relative bg-gradient-to-br ${product.color} p-4 flex flex-col justify-between`}
              >
                {/* Product Silhouette */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="flex flex-col items-center transform -translate-y-4">
                    <div className="w-8 h-4 bg-white rounded-t-lg" />
                    <div className="w-20 h-28 bg-white rounded-b-2xl rounded-t-sm" />
                  </div>
                </div>

                {/* Badge */}
                <div className="relative z-10">
                  {product.badge && (
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${
                      product.badge === 'Bestseller' ? 'bg-gradient-to-r from-[#FFB347] to-[#FF6B6B]' : 'bg-gradient-to-r from-[#00D4AA] to-[#008A70]'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="bg-[#13131A]/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative z-10">
                  <h3 className="font-bold text-sm leading-tight text-white">{product.name}</h3>
                  <p className="text-[10px] text-white/70 mt-1 uppercase tracking-wider">{product.benefit}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono font-bold text-white">₹{product.price}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addWellnessProduct(product)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${addedProductId === product.id ? 'bg-[#00C9A7]' : 'bg-white text-black'}`}
                    >
                      {addedProductId === product.id
                        ? <Check size={18} className="text-[#080F0C]" />
                        : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      }
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-2 gap-4">
          {[
            { name: 'Sleep & Stress', icon: Moon, color: 'from-[#6C63FF] to-[#8A84FF]', bgClass: 'from-[#6C63FF]/20 to-[#6C63FF]/5' },
            { name: 'Energy & Vitality', icon: Zap, color: 'from-[#FFB347] to-[#FFD18C]', bgClass: 'from-[#FFB347]/20 to-[#FFB347]/5' },
            { name: 'Immunity', icon: Shield, color: 'from-[#00D4AA] to-[#5CFFDF]', bgClass: 'from-[#00D4AA]/20 to-[#00D4AA]/5' },
            { name: 'Performance', icon: Target, color: 'from-[#FF6B9D] to-[#FF9F7F]', bgClass: 'from-[#FF6B9D]/20 to-[#FF6B9D]/5' },
          ].map((cat, i) => (
            <motion.button 
              key={i} 
              whileTap={{ scale: 0.95 }}
              onClick={() => pushScreen({
                id: `category-plan-${cat.name}`,
                component: <CategoryPlanFlow category={cat.name} icon={<cat.icon size={32} />} color={cat.color} />
              })}
              className={`glass-card p-4 rounded-2xl bg-gradient-to-br ${cat.bgClass} border-white/5 flex flex-col items-start hover:bg-white/10 transition-colors text-left`}
            >
              <div className="w-10 h-10 rounded-full bg-[#13131A]/50 flex items-center justify-center mb-3">
                <cat.icon size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-sm">{cat.name}</span>
            </motion.button>
          ))}
        </section>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#080F0C] flex flex-col"
          >
            <div className="p-6 flex justify-between items-start">
              {!isGenerating ? (
                <div className="mt-2">
                  <div className="text-xs font-bold text-[#00C9A7] uppercase tracking-wider mb-2">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </div>
                  <div className="flex gap-1">
                    {QUIZ_QUESTIONS.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentQuestion ? 'w-8 bg-[#00C9A7]' : 'w-4 bg-white/20'}`} />
                    ))}
                  </div>
                </div>
              ) : (
                <div />
              )}
              <button onClick={() => setShowQuiz(false)} className="w-11 h-11 flex items-center justify-center bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-4 pb-24">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 size={48} className="text-[#00C9A7] animate-spin mx-auto mb-6" />
                  <h2 className="font-display text-2xl font-bold mb-2">Crafting your plan...</h2>
                  <p className="text-[#8B8FA8]">Our AI is analyzing your responses to build the perfect routine.</p>
                </div>
              ) : (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-3xl font-bold mb-8 leading-tight">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h2>
                  <div className="space-y-4">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect(opt)}
                        className="w-full glass-card p-5 text-left font-bold text-lg hover:bg-white/10 hover:border-[#00C9A7]/50 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
