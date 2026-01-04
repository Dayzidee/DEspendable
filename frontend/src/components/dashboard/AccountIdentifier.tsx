'use client';

import { useState } from 'react';
import { FaHashtag, FaCopy, FaCheck } from 'react-icons/fa';

import { useAuth } from '@/context/AuthContext';

export default function AccountIdentifier() {
  const { accountNumber } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedAccount = (accountNumber && accountNumber.length === 10)
    ? `${accountNumber.slice(0, 4)}-${accountNumber.slice(4, 7)}-${accountNumber.slice(7, 10)}`
    : (accountNumber || '0000-000-000');

  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white mb-6 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <FaHashtag />
        </div>
        <div>
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Kontonummer / Account Number</span>
          <span className="font-mono text-xl tracking-wide">{formattedAccount}</span>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </section>
  );
}
