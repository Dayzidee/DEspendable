'use client';

import { useState } from 'react';
import { FaComments, FaTimes, FaHeadset, FaPaperPlane } from 'react-icons/fa';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message sending logic here
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100">
          <header className="bg-[var(--color-primary)] text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <FaHeadset /> Live Support
            </h3>
            <button onClick={toggleChat} className="text-white/80 hover:text-white transition-colors cursor-pointer">
              <FaTimes />
            </button>
          </header>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            <div className="bg-blue-100 text-blue-900 p-3 rounded-lg rounded-tl-none self-start max-w-[85%] text-sm">
              <span>Welcome! An agent will be with you shortly.</span>
            </div>
            {/* Messages will be injected here */}
          </div>

          <footer className="p-3 border-t border-gray-100 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                  placeholder="Type your message..."
                  maxLength={2000}
                />
                <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <FaPaperPlane />
                </button>
              </div>
              <small className="text-xs text-gray-400 mt-1 block text-right">{message.length} / 2000</small>
            </form>
          </footer>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-105 cursor-pointer"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </button>
    </div>
  );
}
