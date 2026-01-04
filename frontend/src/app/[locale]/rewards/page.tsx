"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Star } from "lucide-react";
import { useTranslations } from 'next-intl';

interface RewardHistoryItem {
    descriptionKey: string;
    date: string;
    points: number;
}

interface RewardsData {
    points: number;
    tier: string;
    history: RewardHistoryItem[];
}

export default function Rewards() {
    const { token } = useAuth();
    const t = useTranslations('rewards');
    const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/rewards', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setRewardsData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    if (loading || !rewardsData) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-[#0018A8] text-lg">Loading Rewards...</div>
                </div>
            </DashboardLayout>
        );
    }

    const { points: userPoints, tier: rawTier } = rewardsData;
    const currentTierKey = rawTier.toLowerCase();
    const nextTierKey = currentTierKey === "bronze" ? "silver" : currentTierKey === "silver" ? "gold" : "platinum";
    const pointsToNext = 5000 - userPoints > 0 ? 5000 - userPoints : 0;
    const pointsHistory = rewardsData.history || [];

    const tiers = [
        { key: "bronze", min: 0, max: 999, color: "from-amber-600 to-amber-800", benefits: ["cashback_1", "basic_support"] },
        { key: "silver", min: 1000, max: 4999, color: "from-gray-400 to-gray-600", benefits: ["cashback_1_5", "priority_support", "free_card"] },
        { key: "gold", min: 5000, max: 9999, color: "from-yellow-400 to-yellow-600", benefits: ["cashback_2", "priority_support_24_7", "free_transfers"] },
        { key: "platinum", min: 10000, max: 999999, color: "from-purple-400 to-purple-600", benefits: ["cashback_3", "dedicated_manager", "exclusive_events"] },
    ];

    const redeemOptions = [
        { id: 1, nameKey: "cashback_10", points: 1000, icon: "💰" },
        { id: 2, nameKey: "cashback_25", points: 2500, icon: "💰" },
        { id: 3, nameKey: "cashback_50", points: 5000, icon: "💰" },
        { id: 4, nameKey: "amazon_voucher", points: 2000, icon: "🎁" },
        { id: 5, nameKey: "netflix", points: 3000, icon: "🎬" },
        { id: 6, nameKey: "spotify", points: 4000, icon: "🎵" },
    ];


    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white px-6 py-12 rounded-2xl mb-8">
                    <div className="text-center">
                        <div className="text-sm opacity-80 mb-2">{t('yourPoints')}</div>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold mb-4"
                        >
                            {userPoints.toLocaleString('de-DE')}
                        </motion.div>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                            <span className="font-semibold">{t(currentTierKey)} {t('currentTier')}</span>
                        </div>
                    </div>
                </header>

                {/* Tier Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">{t('tier_progress', { tier: t(nextTierKey) })}</h3>
                        <span className="text-sm text-[#666666]">{t('points_remaining', { points: pointsToNext.toLocaleString('de-DE') })}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(userPoints / 5000) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-[#666666]">
                        {userPoints.toLocaleString('de-DE')} / 5.000 Punkte
                    </div>
                </div>

                {/* Tier Benefits */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{t('tierBenefits')}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {tiers.map((tier, index) => (
                            <motion.div
                                key={tier.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl p-6 border-2 ${tier.key === currentTierKey ? "border-[#0018A8] shadow-lg" : "border-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-white font-bold`}>
                                        {t(tier.key)[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{t(tier.key)}</div>
                                        <div className="text-xs text-[#666666]">
                                            {tier.min.toLocaleString('de-DE')} - {tier.max.toLocaleString('de-DE')} {t('points_label').toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {tier.benefits.map((benefitKey, i) => (
                                        <li key={i} className="text-sm flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            {t(`benefits.${benefitKey}`)}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Redeem Points */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{t('redeemPoints')}</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {redeemOptions.map((option, index) => (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:border-[#0018A8] transition"
                            >
                                <div className="text-4xl mb-3 text-center">{option.icon}</div>
                                <div className="text-center">
                                    <div className="font-semibold mb-2">{t(option.nameKey)}</div>
                                    <div className="text-sm text-[#666666] mb-4">{option.points.toLocaleString('de-DE')} {t('points_label').toLowerCase()}</div>
                                    <button
                                        disabled={userPoints < option.points}
                                        className={`w-full py-2 rounded-lg font-semibold transition ${userPoints >= option.points
                                            ? "bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white hover:shadow-lg"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {userPoints >= option.points ? t('redeem') : t('notEnoughPoints')}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* How to Earn Points */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#0018A8]" />
                        {t('howToEarn')}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl mb-2">💳</div>
                            <div className="font-semibold mb-1">{t('transactions')}</div>
                            <div className="text-sm text-[#666666]">{t('transactions_earn')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">👥</div>
                            <div className="font-semibold mb-1">{t('referrals')}</div>
                            <div className="text-sm text-[#666666]">{t('referral_earn')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎯</div>
                            <div className="font-semibold mb-1">{t('monthlyGoals')}</div>
                            <div className="text-sm text-[#666666]">{t('monthly_goals_earn')}</div>
                        </div>
                    </div>
                </div>

                {/* Points History */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold mb-4">{t('pointsHistory')}</h3>
                    <div className="space-y-3">
                        {pointsHistory.map((item: RewardHistoryItem, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-sm">{t(`history.${item.descriptionKey}`)}</div>
                                    <div className="text-xs text-[#666666]">{item.date}</div>
                                </div>
                                <div className="text-green-600 font-bold">+{item.points}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Referral Section */}
                <div className="mt-8 bg-gradient-to-r from-[#0018A8] to-[#0025D9] rounded-2xl p-8 text-white text-center">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{t('inviteFriends')}</h3>
                    <p className="mb-6 opacity-90">
                        {t('invite_desc')}
                    </p>
                    <div className="bg-white/20 rounded-lg p-4 mb-4 font-mono text-sm">
                        https://despendables.de/ref/MAX123
                    </div>
                    <button className="bg-white text-[#0018A8] px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
                        {t('shareLink')}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
