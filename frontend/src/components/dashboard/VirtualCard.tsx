'use client';

import { useState } from 'react';
import { FaSyncAlt, FaLeaf } from 'react-icons/fa';

interface VirtualCardProps {
  cardHolder: string;
}

export default function VirtualCard({ cardHolder }: VirtualCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  return (
    <section className="animate-fade-in-up">
      <div className="perspective-1000 w-full h-56 relative mb-4">
        <div
          className={`w-full h-full transition-all duration-700 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Card Front */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-xl flex flex-col justify-between">
            <button
              onClick={toggleFlip}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Flip Card"
            >
              <FaSyncAlt />
            </button>
            <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-yellow-400 rounded-md opacity-80"></div>
              <div className="flex items-center gap-2 font-bold text-lg">
                <FaLeaf /> DE
              </div>
            </div>
            <div className="text-2xl font-mono tracking-widest my-4">
              {showDetails ? '5555 1234 5678 4242' : '•••• •••• •••• 4242'}
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <span className="block text-white/70 text-xs uppercase">Card Holder</span>
                <span className="font-medium tracking-wide">{cardHolder}</span>
              </div>
              <div>
                <span className="block text-white/70 text-xs uppercase">Expires</span>
                <span className="font-medium tracking-wide">12/28</span>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl text-white shadow-xl overflow-hidden">
            <button
              onClick={toggleFlip}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 cursor-pointer"
              title="Flip Card"
            >
              <FaSyncAlt />
            </button>
            <div className="w-full h-12 bg-black mt-6"></div>
            <div className="p-6">
              <div className="bg-white text-gray-800 p-2 rounded w-16 ml-auto text-center font-mono font-bold">
                {showDetails ? '123' : '•••'}
              </div>
              <div className="text-right text-xs text-white/70 mt-1 uppercase mr-1">CVV</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showDetails}
            onChange={() => setShowDetails(!showDetails)}
            className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">Show Details</span>
        </label>
      </div>
    </section>
  );
}
