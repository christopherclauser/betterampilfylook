import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Terminal as TerminalIcon, Shield, Zap } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export default function ChatTerminal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial system messages
    setMessages([
      { id: '1', user: 'SYSTEM', text: 'CONNECTION ESTABLISHED...', timestamp: '14:21:05', isSystem: true },
      { id: '2', user: 'SYSTEM', text: 'WELCOME TO SECTOR_4 CHAT TERMINAL.', timestamp: '14:21:06', isSystem: true },
      { id: '3', user: 'Neo_88', text: 'Anybody on for Slope?', timestamp: '14:22:10' },
      { id: '4', user: 'Cipher', text: 'Just finished 2048 highscore session.', timestamp: '14:23:45' },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: 'YOU',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulated bot response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        user: 'GUEST_04',
        text: 'Link received. Joining node.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-black/40">
        <div className="flex items-center gap-3">
          <TerminalIcon className="text-cyber-cyan" size={18} />
          <h2 className="font-mono font-bold text-sm tracking-widest uppercase">CHAT_TERMINAL_V1.0</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">SECURE_LINK</span>
          </div>
          <Shield size={16} className="text-gray-700" />
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm scroll-smooth"
      >
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col gap-1 ${msg.isSystem ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600">[{msg.timestamp}]</span>
              <span className={`font-bold ${
                msg.user === 'SYSTEM' ? 'text-cyber-pink' : 
                msg.user === 'YOU' ? 'text-cyber-cyan' : 'text-gray-400'
              }`}>
                {msg.user} //
              </span>
              <span className={msg.isSystem ? 'text-gray-500 italic' : 'text-gray-200'}>
                {msg.text}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSend}
        className="p-6 bg-black/40 border-t border-cyber-border"
      >
        <div className="relative">
          <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-cyber-cyan opacity-50" size={16} />
          <input 
            type="text" 
            placeholder="EXECUTE_MESSAGE..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-cyber-black border border-cyber-border rounded-lg py-4 pl-12 pr-16 text-sm font-mono focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-cyber-cyan/10 hover:bg-cyber-cyan hover:text-black transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
