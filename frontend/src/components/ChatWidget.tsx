"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

interface Message {
  id: string;
  text: string;
  sender_type: "user" | "agent";
  timestamp: string;
}

export default function ChatWidget() {
  const { user, token } = useAuth();
  // Simplified translation fallback if hook fails or keys missing
  const t = (key: string) => {
      if (key === 'title') return 'Support Chat';
      if (key === 'placeholder') return 'Type a message...';
      if (key === 'login') return 'Please login to chat';
      return key;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && user && token) {
      fetchMessages();
      // Poll for new messages every 5 seconds (Simple simulation)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Chat fetch error", error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const tempMsg: Message = {
        id: 'temp-' + Date.now(),
        text: inputText,
        sender_type: 'user',
        timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);
    setInputText("");

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: tempMsg.text })
      });
      // Refresh immediately to get proper timestamp/ID
      fetchMessages();
    } catch (error) {
      console.error("Send error", error);
    }
  };

  if (!user) return null; // Hide if not logged in

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#0018A8] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#0025D9] transition z-50"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-[#0018A8] p-4 flex justify-between items-center text-white cursor-pointer"
                 onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="font-bold">{t('title')}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-gray-200">
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-8">
                      Start a conversation...
                    </div>
                  )}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender_type === 'user'
                            ? 'bg-[#0018A8] text-white rounded-tr-none'
                            : 'bg-white border border-gray-200 text-[#1C1C1C] rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('placeholder')}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#0018A8] text-white rounded-xl hover:bg-[#0025D9] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
