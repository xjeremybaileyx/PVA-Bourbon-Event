
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Bot, X } from 'lucide-react';

export const TourAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome! I'm your PVA Bourbon Tour assistant. Have any questions about our stops at Buffalo Trace, Woodford Reserve, or Castle & Key?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    const response = await getGeminiResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-amber-50 w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col border-2 border-amber-900/20 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-amber-900 p-4 rounded-t-2xl flex justify-between items-center text-amber-50">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-amber-300" />
              <span className="font-serif font-bold">Tour Concierge</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-amber-300">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchment">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-amber-700 text-white rounded-tr-none' 
                    : 'bg-amber-200 text-amber-900 rounded-tl-none border border-amber-900/10'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-amber-200 p-3 rounded-2xl rounded-tl-none animate-pulse text-amber-900/40 text-xs">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-amber-900/10 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about stops, lunch, or transport..."
              className="flex-1 bg-white border border-amber-900/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-700 text-amber-900 placeholder-amber-900/40"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-amber-900 text-amber-50 p-2 rounded-lg hover:bg-amber-800 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-amber-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform copper-glow flex items-center gap-2"
        >
          <MessageSquare size={24} />
          <span className="hidden md:inline font-semibold pr-2">Tour Assistant</span>
        </button>
      )}
    </div>
  );
};
