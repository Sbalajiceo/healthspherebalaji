import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Phone, Video, MoreVertical, Send, Paperclip, Camera, Mic } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { generateDoctorReply } from '../services/geminiService';

export default function ChatScreen({ doctor }: { doctor: any }) {
  const { popScreen } = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I will be with you shortly.', sender: 'doctor', time: '10:28 AM' },
    { id: 2, text: 'Please keep your previous reports ready.', sender: 'doctor', time: '10:28 AM' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const text = message.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = { id: Date.now(), text, sender: 'user', time: now };
    setMessages(prev => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      return [...prev, userMsg];
    });
    setMessage('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.sender, text: m.text }));
    const reply = await generateDoctorReply(text, doctor, history);

    setIsTyping(false);
    if (reply) {
      const doctorMsg = {
        id: Date.now() + 1,
        text: reply,
        sender: 'doctor',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, doctorMsg]);
    }
  };

  return (
    <div className="h-full w-full bg-[#0A0A0F] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-[#13131A] border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={popScreen} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-bold text-lg">
              {doctor.initials}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00D4AA] border-2 border-[#13131A] rounded-full" />
          </div>
          <div>
            <h2 className="font-bold text-base">{doctor.name}</h2>
            <p className={`text-xs font-medium transition-colors ${isTyping ? 'text-[#FFB347]' : 'text-[#00D4AA]'}`}>
              {isTyping ? 'typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#8B8FA8]">
          <Video size={20} />
          <Phone size={20} />
          <MoreVertical size={20} />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0F] no-scrollbar pb-4">
        <div className="text-center text-xs text-[#8B8FA8] my-4 bg-[#13131A] inline-block px-3 py-1 rounded-full mx-auto table">
          Today
        </div>

        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#00D4AA] text-black rounded-tr-sm' : 'bg-[#1A1A24] text-white rounded-tl-sm'}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[10px] text-[#8B8FA8] mt-1 px-1">{msg.time}</span>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col max-w-[80%] mr-auto items-start"
          >
            <div className="bg-[#1A1A24] rounded-2xl rounded-tl-sm p-3 flex gap-1 items-center">
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

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#13131A] border-t border-white/10 flex items-center gap-2 shrink-0">
        <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[#8B8FA8]">
          <Paperclip size={20} />
        </button>
        <div className="flex-1 bg-[#1A1A24] rounded-full flex items-center px-4 py-2 border border-white/5">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-[#8B8FA8]"
          />
          <button className="text-[#8B8FA8] ml-2">
            <Camera size={20} />
          </button>
        </div>
        {message.trim() ? (
          <button
            onClick={handleSend}
            disabled={isTyping}
            className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black shadow-lg shadow-[#00D4AA]/20 disabled:opacity-50"
          >
            <Send size={18} className="ml-1" />
          </button>
        ) : (
          <button className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black shadow-lg shadow-[#00D4AA]/20">
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
