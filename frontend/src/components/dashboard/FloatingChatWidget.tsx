'use client';

import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaHeadset, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender_uid: string;
  sender_type: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function FloatingChatWidget() {
  const { token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Poll for messages
  useEffect(() => {
    if (isOpen && token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, token]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempMsg = message;
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: tempMsg })
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-2rem)] md:w-96 h-[60vh] md:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          >
            <header className="bg-[#0018A8] text-white p-4 flex justify-between items-center shadow-md">
              <h3 className="font-bold flex items-center gap-2 text-sm md:text-base">
                <FaHeadset /> Live Support
              </h3>
              <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors cursor-pointer p-1">
                <FaTimes />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
              <div className="bg-blue-50 text-[#0018A8] p-3 rounded-2xl rounded-tl-none self-start max-w-[85%] text-sm shadow-sm border border-blue-100">
                <span>Welcome! How can we help you today?</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${msg.sender_type === 'user'
                      ? 'bg-[#0018A8] text-white self-end rounded-tr-none'
                      : 'bg-white text-gray-800 self-start rounded-tl-none border border-gray-100'
                    }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] mt-1 block ${msg.sender_type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <footer className="p-3 border-t border-gray-100 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0018A8] outline-none transition-all"
                  placeholder="Type your message..."
                  maxLength={1000}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="bg-[#0018A8] hover:bg-[#0025D9] disabled:opacity-50 disabled:cursor-not-allowed text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#0018A8] text-white shadow-xl flex items-center justify-center text-xl hover:bg-[#0025D9] transition-colors z-50"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </motion.button>
    </div>
  );
}
