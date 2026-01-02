"use client";


import { useState, useEffect } from "react";
import { formatCurrency, formatIBAN } from "@/lib/formatters";

interface TransactionDetails {
    amount: number;
    recipient: string;
    reference?: string;
}

interface SCAModalProps {
    isOpen: boolean;
    onConfirm: (tan: string) => void;
    onCancel: () => void;
    mockTan?: string; // For simulation
    transactionDetails?: TransactionDetails;
    expiresIn?: number; // seconds
}

export default function SCAModal({
    isOpen,
    onConfirm,
    onCancel,
    mockTan,
    transactionDetails,
    expiresIn = 300 // 5 minutes default
}: SCAModalProps) {
    
    const [tan, setTan] = useState("");
    const [timeLeft, setTimeLeft] = useState(expiresIn);
    const [error, setError] = useState("");

    // Countdown timer
    useEffect(() => {
        if (!isOpen) return;

        setTimeLeft(expiresIn);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError("TAN ist abgelaufen");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, expiresIn]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (timeLeft <= 0) {
            setError("TAN ist abgelaufen");
            return;
        }
        if (tan.length !== 6) {
            setError("TAN muss 6 Ziffern haben");
            return;
        }
        onConfirm(tan);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-[#0018A8]/10 rounded-full flex items-center justify-center text-[#0018A8] mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1C1C1C] text-center mb-2">
                        Transaktion freigeben
                    </h3>
                    <p className="text-sm text-[#666666] text-center">
                        Bitte geben Sie den Auftrag frei
                    </p>
                </div>

                {/* Transaction Details - Critical for Dynamic Linking */}
                {transactionDetails && (
                    <div className="mb-6 bg-[#F4F6F8] rounded-xl p-4 border border-gray-200">
                        <div className="text-xs font-bold text-[#666666] uppercase tracking-wide mb-3">
                            Transaktionsdetails
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[#666666]">Betrag:</span>
                                <span className="text-lg font-bold text-[#0018A8]">
                                    {formatCurrency(transactionDetails.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-[#666666]">Empfänger:</span>
                                <span className="text-sm font-mono text-[#1C1C1C] text-right">
                                    {formatIBAN(transactionDetails.recipient)}
                                </span>
                            </div>
                            {transactionDetails.reference && (
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-[#666666]">Verwendungszweck:</span>
                                    <span className="text-sm text-[#1C1C1C] text-right">
                                        {transactionDetails.reference}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Timer */}
                <div className="mb-4 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className={`text-sm font-mono ${timeLeft < 60 ? 'text-[#E2001A]' : 'text-[#666666]'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Simulation Only: Show the mocked TAN */}
                {mockTan && (
                    <div className="mb-6 bg-gradient-to-r from-[#0018A8]/5 to-[#0025D9]/5 border-2 border-dashed border-[#0018A8]/30 rounded-lg p-4 text-center">
                        <span className="text-xs text-[#666666] uppercase tracking-widest block mb-2">
                            🔔 Simulierte pushTAN
                        </span>
                        <span className="text-3xl font-mono font-bold text-[#0018A8] tracking-[0.5em]">
                            {mockTan}
                        </span>
                        <p className="text-xs text-[#666666] mt-2">
                            In Produktion würde dies per Push-Benachrichtigung gesendet
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-[#666666] mb-2 uppercase tracking-wide">
                            TAN eingeben
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={tan}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setTan(value);
                                setError("");
                            }}
                            className="w-full bg-[#F4F6F8] border-2 border-gray-300 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] text-[#1C1C1C] focus:outline-none focus:border-[#0018A8] focus:ring-2 focus:ring-[#0018A8]/20 transition font-mono"
                            placeholder="••••••"
                            maxLength={6}
                            autoFocus
                            disabled={timeLeft <= 0}
                        />
                        {error && (
                            <p className="text-sm text-[#E2001A] mt-2 text-center">{error}</p>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 bg-gray-100 text-[#666666] font-semibold rounded-lg hover:bg-gray-200 transition"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={tan.length < 6 || timeLeft <= 0}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            Freigeben
                        </button>
                    </div>
                </form>

                {/* Security Notice */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-[#666666] text-center leading-relaxed">
                        🔒 Ihre TAN ist nur für diese Transaktion gültig und läuft nach {Math.floor(expiresIn / 60)} Minuten ab.
                    </p>
                </div>
            </div>
        </div>
    );
}
