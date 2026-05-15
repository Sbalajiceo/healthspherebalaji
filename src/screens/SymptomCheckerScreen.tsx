import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, AlertTriangle, Clock, Stethoscope } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { generateTriage } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  triage?: any;
}

export default function SymptomCheckerScreen() {
  const { popScreen } = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'ai',
      text: "Hi Sandeep! Tell me what you're feeling. Describe your symptoms and I'll help you understand what might be going on.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const triage = await generateTriage(text);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: triage?.plain_explanation || "I couldn't analyze that. Could you describe your symptoms in more detail?",
      triage,
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const urgencyConfig = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return { color: '#FF4B4B', bg: 'rgba(255,75,75,0.15)', label: 'High Priority' };
      case 'moderate': return { color: '#FFB347', bg: 'rgba(255,179,71,0.15)', label: 'Moderate' };
      default: return { color: '#00D4AA', bg: 'rgba(0,212,170,0.15)', label: 'Low Priority' };
    }
  };

  return (
    <div className="h-full w-full bg-[#0A0A0F] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button onClick={popScreen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">AI Symptom Checker</h1>
          <p className="text-[#00D4AA] text-xs font-medium">Powered by Gemini 2.5</p>
        </div>
        <div className="ml-auto w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Stethoscope size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#6C63FF] rounded-3xl rounded-tr-sm px-4 py-3' : 'space-y-3'}`}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.text}</p>
                ) : (
                  <>
                    <div className="glass-card rounded-3xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm text-white/90 leading-relaxed">{msg.text}</p>
                    </div>

                    {msg.triage && (
                      <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-4">
                        {msg.triage.emergency_flag && (
                          <div className="flex items-center gap-2 bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-xl p-3">
                            <AlertTriangle size={16} className="text-[#FF4B4B] shrink-0" />
                            <p className="text-[#FF4B4B] text-xs font-bold">Seek emergency care immediately</p>
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap">
                          {(() => {
                            const u = urgencyConfig(msg.triage.urgency);
                            return (
                              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ color: u.color, background: u.bg }}>
                                {u.label}
                              </span>
                            );
                          })()}
                          {msg.triage.see_doctor_within && (
                            <span className="flex items-center px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-[#8B8FA8]">
                              <Clock size={11} className="mr-1" />
                              {msg.triage.see_doctor_within}
                            </span>
                          )}
                        </div>

                        {msg.triage.symptoms_detected?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-2">Detected</p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.triage.symptoms_detected.map((s: string) => (
                                <span key={s} className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/70">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.triage.suggested_specialties?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8FA8] mb-2">See a</p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.triage.suggested_specialties.map((s: string) => (
                                <span key={s} className="px-2.5 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#6C63FF] text-xs font-bold">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center mr-2 shrink-0">
                <Stethoscope size={14} className="text-white" />
              </div>
              <div className="glass-card rounded-3xl rounded-tl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-[#8B8FA8]"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="shrink-0 px-4 pb-6 pt-3 bg-[#0A0A0F] border-t border-white/5">
        <div className="flex items-end gap-3 glass-card rounded-2xl px-4 py-3 border border-white/10">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Describe your symptoms..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#8B8FA8] resize-none outline-none leading-5 max-h-28 overflow-y-auto"
            style={{ minHeight: '20px' }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Send size={16} className="text-white" />
          </motion.button>
        </div>
        <p className="text-center text-[#8B8FA8] text-[10px] mt-2">Not a substitute for professional medical advice</p>
      </div>
    </div>
  );
}
