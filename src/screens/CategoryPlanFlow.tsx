import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ArrowRight, CheckCircle2, Sparkles, Clock, Shield, Zap } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { generateCategoryPlan } from '../services/geminiService';

interface CategoryPlanFlowProps {
  category: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORY_QUESTIONS: Record<string, { q: string, options: string[] }[]> = {
  'Sleep & Stress': [
    { q: "How many hours of sleep do you usually get?", options: ["< 5 hours", "5-7 hours", "7-9 hours", "> 9 hours"] },
    { q: "How often do you feel overwhelmed or stressed?", options: ["Rarely", "Sometimes", "Often", "Constantly"] },
    { q: "What's your biggest sleep hurdle?", options: ["Falling asleep", "Staying asleep", "Waking up tired", "Racing thoughts"] }
  ],
  'Energy & Vitality': [
    { q: "When do you feel most tired?", options: ["Morning", "Afternoon slump", "Evening", "All day"] },
    { q: "How much caffeine do you consume daily?", options: ["None", "1-2 cups", "3-4 cups", "5+ cups"] },
    { q: "Describe your daily activity level.", options: ["Sedentary", "Lightly active", "Moderately active", "Very active"] }
  ],
  'Immunity': [
    { q: "How often do you catch a cold or feel run down?", options: ["Rarely", "1-2 times a year", "Every few months", "Constantly"] },
    { q: "How would you describe your gut health?", options: ["Great", "Occasional bloating", "Frequent issues", "Poor"] },
    { q: "Do you currently take any daily vitamins?", options: ["None", "Multivitamin", "Specific supplements", "Irregularly"] }
  ],
  'Performance': [
    { q: "What is your primary fitness goal?", options: ["Build muscle", "Lose weight", "Improve endurance", "General health"] },
    { q: "How many days a week do you train?", options: ["0-1 days", "2-3 days", "4-5 days", "6-7 days"] },
    { q: "What's your current diet like?", options: ["Balanced", "High protein", "Plant-based", "Needs improvement"] }
  ]
};

type FlowState = 'INTRO' | 'QUIZ' | 'ANALYZING' | 'RESULT';

export default function CategoryPlanFlow({ category, icon, color }: CategoryPlanFlowProps) {
  const { popScreen } = useNavigation();
  const [currentState, setCurrentState] = useState<FlowState>('INTRO');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<any>(null);

  const questions = CATEGORY_QUESTIONS[category] || CATEGORY_QUESTIONS['Sleep & Stress'];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentQuestionIndex].q]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      generatePlan(newAnswers);
    }
  };

  const generatePlan = async (finalAnswers: Record<string, string>) => {
    setCurrentState('ANALYZING');
    const result = await generateCategoryPlan(category, finalAnswers);
    if (result) {
      setPlan(result);
      setCurrentState('RESULT');
    } else {
      // Fallback if API fails
      setPlan({
        title: `Your ${category} Protocol`,
        subtitle: "A personalized approach to better health.",
        core_issue: "Based on your answers, we've identified key areas for optimization.",
        recommended_routine: [
          { timeOfDay: "Morning", action: "Hydrate and light movement", reason: "Jumpstarts metabolism" },
          { timeOfDay: "Evening", action: "Wind down routine", reason: "Prepares body for recovery" }
        ],
        suggested_supplements: [
          { name: "Core Essentials", benefit: "Fills daily nutritional gaps" }
        ],
        expected_results: "Noticeable improvements in 2-4 weeks with consistent adherence."
      });
      setCurrentState('RESULT');
    }
  };

  return (
    <div className="min-h-full w-full bg-[#0A0A0F] text-white relative">
      <AnimatePresence mode="wait">
        
        {/* INTRO STATE */}
        {currentState === 'INTRO' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full flex flex-col"
          >
            <div className={`h-[40vh] relative flex flex-col justify-end p-8 bg-gradient-to-br ${color}`}>
              <button 
                onClick={popScreen}
                className="absolute top-6 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 shadow-xl">
                {icon}
              </div>
              <h1 className="font-display text-4xl font-bold text-white mb-2 leading-tight">
                Optimize your<br/>{category}
              </h1>
              <p className="text-white/80 text-lg">
                Answer a few questions to get a personalized, science-backed protocol.
              </p>
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-between bg-[#0A0A0F] rounded-t-3xl -mt-6 relative z-10">
              <div className="space-y-6 mt-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-4 shrink-0">
                    <Sparkles size={16} className="text-[#00D4AA]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI-Powered Analysis</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">We analyze your unique lifestyle factors to build a custom plan.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-4 shrink-0">
                    <CheckCircle2 size={16} className="text-[#6C63FF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Clinically Proven</h3>
                    <p className="text-[#8B8FA8] text-sm mt-1">Recommendations based on the latest medical research.</p>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentState('QUIZ')}
                className="w-full h-14 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center mt-8"
              >
                Start Assessment <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* QUIZ STATE */}
        {currentState === 'QUIZ' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col p-6"
          >
            <div className="flex items-center justify-between mb-8 mt-2">
              <button 
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(prev => prev - 1);
                  } else {
                    setCurrentState('INTRO');
                  }
                }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-sm font-bold text-[#8B8FA8]">
                {currentQuestionIndex + 1} OF {questions.length}
              </div>
              <div className="w-10 h-10" /> {/* Spacer */}
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-display text-3xl font-bold mb-8 leading-tight">
                {questions[currentQuestionIndex].q}
              </h2>
              
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-5 rounded-2xl border border-white/10 bg-[#13131A] hover:bg-white/5 hover:border-white/30 transition-all text-left font-medium text-lg flex justify-between items-center group"
                  >
                    {option}
                    <div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-[#00D4AA] flex items-center justify-center transition-colors">
                      <div className="w-3 h-3 rounded-full bg-[#00D4AA] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ANALYZING STATE */}
        {currentState === 'ANALYZING' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} blur-xl opacity-30`}
              />
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#13131A] border border-white/20 flex items-center justify-center shadow-2xl">
                {icon}
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold mb-3">Building your protocol...</h2>
            <p className="text-[#8B8FA8] animate-pulse">Analyzing your lifestyle factors and matching with clinical data.</p>
          </motion.div>
        )}

        {/* RESULT STATE */}
        {currentState === 'RESULT' && plan && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col overflow-y-auto no-scrollbar pb-24"
          >
            <div className={`pt-12 pb-8 px-6 bg-gradient-to-br ${color} relative`}>
              <button 
                onClick={popScreen}
                className="absolute top-6 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="mt-8">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white mb-4 inline-block">
                  Your Custom Protocol
                </span>
                <h1 className="font-display text-4xl font-bold text-white mb-2 leading-tight">
                  {plan.title}
                </h1>
                <p className="text-white/90 text-lg">{plan.subtitle}</p>
              </div>
            </div>

            <div className="px-4 py-6 space-y-6 -mt-4 relative z-10">
              {/* Core Issue */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 bg-[#13131A]">
                <h3 className="text-[#8B8FA8] text-sm font-bold uppercase tracking-wider mb-3 flex items-center">
                  <Sparkles size={16} className="mr-2 text-[#00D4AA]" /> Clinical Insight
                </h3>
                <p className="text-white leading-relaxed">{plan.core_issue}</p>
              </div>

              {/* Recommended Routine */}
              <div>
                <h3 className="font-display text-xl font-bold mb-4 px-2">Daily Routine</h3>
                <div className="space-y-3">
                  {plan.recommended_routine.map((step: any, idx: number) => (
                    <div key={idx} className="glass-card p-5 rounded-2xl flex items-start">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 mr-4">
                        <Clock size={18} className="text-[#6C63FF]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#8B8FA8] uppercase tracking-wider mb-1">{step.timeOfDay}</div>
                        <h4 className="font-bold text-lg mb-1">{step.action}</h4>
                        <p className="text-sm text-[#8B8FA8]">{step.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Supplements */}
              <div>
                <h3 className="font-display text-xl font-bold mb-4 px-2">Recommended Formulation</h3>
                <div className="grid gap-3">
                  {plan.suggested_supplements.map((supp: any, idx: number) => (
                    <div key={idx} className="glass-card p-5 rounded-2xl border border-[#00D4AA]/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4AA]/10 rounded-full blur-xl -mr-10 -mt-10" />
                      <div className="relative z-10">
                        <h4 className="font-bold text-lg text-[#00D4AA] mb-1">{supp.name}</h4>
                        <p className="text-sm text-white/80">{supp.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Results */}
              <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-[#13131A] to-[#1A1A24] border border-white/5">
                <h3 className="text-[#8B8FA8] text-sm font-bold uppercase tracking-wider mb-3 flex items-center">
                  <Zap size={16} className="mr-2 text-[#FFB347]" /> What to Expect
                </h3>
                <p className="text-white leading-relaxed">{plan.expected_results}</p>
              </div>

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`w-full h-14 rounded-full bg-gradient-to-r ${color} text-white font-bold text-lg flex items-center justify-center shadow-lg mt-8`}
              >
                Start Your Protocol <ArrowRight size={20} className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
