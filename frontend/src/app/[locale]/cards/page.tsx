"use client";

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, Lock, Unlock, Settings, Eye, EyeOff } from "lucide-react";

export default function VirtualCard() {
    const t = useTranslations('cards');
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mock card data
    const cardData = {
        number: "4532 1234 5678 9012",
        cvv: "123",
        expiry: "12/28",
        holder: "Max Mustermann",
        balance: 2500.00
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">{t('virtualCard')}</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-8">
                {/* 3D Card */}
                <div className="perspective-1000 mb-8">
                    <motion.div
                        className="relative w-full h-56 cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                    >
                        {/* Front of Card */}
                        <div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0018A8] via-[#0025D9] to-[#0018A8] p-8 shadow-2xl"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(0deg)"
                            }}
                        >
                            <div className="flex flex-col justify-between h-full text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs opacity-80 mb-1">DEspendables Premium</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                                            <div className="text-xs opacity-60">Contactless</div>
                                        </div>
                                    </div>
                                    {isFrozen && (
                                        <div className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold">
                                            {t('frozen').toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="text-2xl font-mono tracking-wider mb-4">
                                        {showDetails ? cardData.number : "•••• •••• •••• " + cardData.number.slice(-4)}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-xs opacity-80">{t('expiryDate')}</div>
                                            <div className="font-semibold">{cardData.expiry}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs opacity-80">{t('cardHolder')}</div>
                                            <div className="font-semibold">{cardData.holder}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Back of Card */}
                        <div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0025D9] to-[#0018A8] shadow-2xl"
                            style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)"
                            }}
                        >
                            <div className="h-full flex flex-col">
                                <div className="bg-black h-12 mt-6"></div>
                                <div className="flex-1 p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="bg-white h-10 rounded flex items-center justify-end px-4 mb-4">
                                            <span className="text-black font-mono font-bold">
                                                {showDetails ? cardData.cvv : "•••"}
                                            </span>
                                        </div>
                                        <div className="text-white text-xs opacity-80">
                                            {t('cvv')} Code
                                        </div>
                                    </div>
                                    <div className="text-white text-xs opacity-60 text-center">
                                        © 2026 DEspendables Bank AG
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="text-center text-sm text-[#666666] mb-8">
                    {isFlipped ? t('showDetails') : t('showDetails')} {/* Fallback for instructions */}
                </div>

                {/* Card Controls */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="bg-white border-2 border-gray-200 p-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:border-[#0018A8] transition"
                    >
                        {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        {showDetails ? t('hideDetails') : t('showDetails')}
                    </button>

                    <button
                        onClick={() => setIsFrozen(!isFrozen)}
                        className={`p-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${isFrozen
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                    >
                        {isFrozen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        {isFrozen ? t('unfreeze') : t('freeze')}
                    </button>
                </div>

                {/* Card Details */}
                <AnimatePresence>
                    {showDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8 overflow-hidden"
                        >
                            <h3 className="font-bold mb-4">{t('cardNumber')}</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-[#666666] mb-1">{t('cardNumber')}</div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-semibold">{cardData.number}</span>
                                        <button
                                            onClick={() => copyToClipboard(cardData.number.replace(/\s/g, ""))}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <Copy className="w-4 h-4 text-[#0018A8]" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-[#666666] mb-1">{t('expiryDate')}</div>
                                        <div className="font-semibold">{cardData.expiry}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-[#666666] mb-1">{t('cvv')}</div>
                                        <div className="font-semibold">{cardData.cvv}</div>
                                    </div>
                                </div>
                            </div>
                            {copied && (
                                <div className="mt-4 text-sm text-green-600 text-center">
                                    ✓ {t('copied')}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Card Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                    <h3 className="font-bold mb-4">{t('title')}</h3>

                    <Link
                        href="/cards"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-[#0018A8]" />
                            <div>
                                <div className="font-semibold">{t('spendingLimit')}</div>
                                <div className="text-sm text-[#666666]">{t('spendingLimit')}</div>
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{t('dailyLimit')}</span>
                            <span className="text-[#0018A8] font-bold">€1.000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                        <div className="text-xs text-[#666666] mt-1">€450 {t('limitUsed')} €1.000</div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold mb-4">{t('recentTransactions')}</h3>
                    <div className="space-y-3">
                        {[
                            { merchant: "Amazon.de", amount: -45.99, date: "Heute, 14:30" },
                            { merchant: "Spotify", amount: -9.99, date: "Gestern, 10:15" },
                            { merchant: "Rewe", amount: -23.50, date: "28.12.2025" },
                        ].map((tx, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-sm">{tx.merchant}</div>
                                    <div className="text-xs text-[#666666]">{tx.date}</div>
                                </div>
                                <div className="font-bold text-[#1C1C1C]">
                                    {tx.amount < 0 ? "-" : "+"}€{Math.abs(tx.amount).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
