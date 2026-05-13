import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Phone, Video, MoreVertical, Send, Paperclip, Camera, Mic } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export default function ChatScreen({ doctor }: { doctor: any }) {
  const { popScreen } = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I will be with you shortly.', sender: 'doctor', time: '10:28 AM' },
    { id: 2, text: 'Please keep your previous reports ready.', sender: 'doctor', time: '10:28 AM' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#13131A] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={popScreen} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center -ml-2">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-bold text-lg">
              {doctor.initials}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00D4AA] border-2 border-[#13131A] rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-base">{doctor.name}</h2>
            <p className="text-[#00D4AA] text-xs font-medium">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[#8B8FA8]">
          <Video size={20} />
          <Phone size={20} />
          <MoreVertical size={20} />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0F] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
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
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-[10px] text-[#8B8FA8] mt-1 px-1">{msg.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#13131A] border-t border-white/10 flex items-center gap-2">
        <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[#8B8FA8]">
          <Paperclip size={20} />
        </button>
        <div className="flex-1 bg-[#1A1A24] rounded-full flex items-center px-4 py-2 border border-white/5">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-[#8B8FA8]"
          />
          <button className="text-[#8B8FA8] ml-2">
            <Camera size={20} />
          </button>
        </div>
        {message.trim() ? (
          <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black shadow-lg shadow-[#00D4AA]/20">
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
