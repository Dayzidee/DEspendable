"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, Lock, Unlock, Settings, Eye, EyeOff } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function VirtualCard() {
    const { token, user } = useAuth();
    const t = useTranslations('cards');
    const [cardData, setCardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFrozen, setIsFrozen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetch('/api/cards', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setCardData(data);
                setIsFrozen(data.status === 'frozen');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    const toggleFreeze = async () => {
        if (!cardData || !token) return;
        const newStatus = isFrozen ? 'unfreeze' : 'freeze';
        try {
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cardId: cardData.id, action: newStatus })
            });
            const result = await res.json();
            if (result.success) {
                setIsFrozen(!isFrozen);
            }
        } catch (err) {
            console.error("Failed to update card status", err);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || !cardData) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-[#0018A8] text-lg">Loading Card...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">{t('virtualCard')}</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 md:px-6 mt-8">

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
                                        <div className="text-xs opacity-80 mb-1">DEspendables {t('premium')}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                                            <div className="text-xs opacity-60">{t('contactless')}</div>
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
                                            <div className="font-semibold">
                                                {(cardData.holder === "User" && user?.displayName)
                                                    ? user.displayName
                                                    : (cardData.holder === "User" && user?.email)
                                                        ? user.email.split('@')[0]
                                                        : cardData.holder}
                                            </div>
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
                    {isFlipped ? t('hideDetails') : t('showDetails')}
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
                        onClick={toggleFreeze}
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
                            <h3 className="font-bold mb-4">{t('title')}</h3>
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
                    <h3 className="font-bold mb-4">{t('settings')}</h3>

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
                            <span className="text-[#0018A8] font-bold">€{cardData?.spending?.limit?.toLocaleString('de-DE') || '1.000'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] h-2 rounded-full"
                                style={{ width: `${Math.min(((cardData?.spending?.monthly || 0) / (cardData?.spending?.limit || 1000)) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-[#666666] mt-1">
                            €{(cardData?.spending?.monthly || 0).toLocaleString('de-DE')} {t('limitUsed')} €{cardData?.spending?.limit?.toLocaleString('de-DE') || '1.000'}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold mb-4">{t('recentTransactions')}</h3>
                    <div className="space-y-3">
                        {(cardData?.transactions && cardData.transactions.length > 0) ? (
                            cardData.transactions.map((tx: any, index: number) => {
                                const isCreditAlert = tx.merchant === "Admin Adjustment" || tx.type === 'admin_adjustment';
                                const displayTitle = isCreditAlert ? "Credit Alert" : tx.merchant;
                                const displaySubtitle = isCreditAlert ? "Money Received" : "";

                                return (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-sm">{displayTitle}</div>
                                            <div className="text-xs text-[#666666]">
                                                {displaySubtitle ? `${displaySubtitle} • ` : ''}
                                                {new Date(tx.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className={`font-bold ${tx.amount < 0 ? 'text-[#1C1C1C]' : 'text-green-600'}`}>
                                            {tx.amount < 0 ? "" : "+"}€{Math.abs(tx.amount).toFixed(2).replace('.', ',')}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 py-4 italic">Keine Transaktionen gefunden</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
