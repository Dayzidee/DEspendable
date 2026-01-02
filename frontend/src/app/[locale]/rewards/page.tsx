"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Users, Star } from "lucide-react";

export default function Rewards() {
    // Mock rewards data
    const userPoints = 4250;
    const currentTier = "Silver";
    const nextTier = "Gold";
    const pointsToNext = 750;

    const tiers = [
        { name: "Bronze", min: 0, max: 999, color: "from-amber-600 to-amber-800", benefits: ["1% Cashback", "Basic Support"] },
        { name: "Silver", min: 1000, max: 4999, color: "from-gray-400 to-gray-600", benefits: ["1.5% Cashback", "Priority Support", "Free Virtual Card"] },
        { name: "Gold", min: 5000, max: 9999, color: "from-yellow-400 to-yellow-600", benefits: ["2% Cashback", "24/7 Support", "Free Int'l Transfers"] },
        { name: "Platinum", min: 10000, max: 999999, color: "from-purple-400 to-purple-600", benefits: ["3% Cashback", "Dedicated Manager", "Exclusive Events"] },
    ];

    const redeemOptions = [
        { id: 1, name: "€10 Cashback", points: 1000, icon: "💰" },
        { id: 2, name: "€25 Cashback", points: 2500, icon: "💰" },
        { id: 3, name: "€50 Cashback", points: 5000, icon: "💰" },
        { id: 4, name: "Amazon Gutschein €20", points: 2000, icon: "🎁" },
        { id: 5, name: "Netflix 3 Monate", points: 3000, icon: "🎬" },
        { id: 6, name: "Spotify Premium 6 Monate", points: 4000, icon: "🎵" },
    ];

    const pointsHistory = [
        { date: "01.01.2026", description: "Einkauf bei Rewe", points: 23 },
        { date: "31.12.2025", description: "Online-Shopping", points: 45 },
        { date: "30.12.2025", description: "Tankstelle", points: 60 },
        { date: "28.12.2025", description: "Restaurant", points: 35 },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white px-6 py-12 rounded-2xl mb-8">
                    <div className="text-center">
                        <div className="text-sm opacity-80 mb-2">Ihre Punkte</div>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-6xl font-bold mb-4"
                        >
                            {userPoints.toLocaleString()}
                        </motion.div>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                            <span className="font-semibold">{currentTier} Tier</span>
                        </div>
                    </div>
                </header>

                {/* Tier Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Fortschritt zu {nextTier}</h3>
                        <span className="text-sm text-[#666666]">{pointsToNext} Punkte verbleibend</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(userPoints / 5000) * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-[#666666]">
                        {userPoints} / 5.000 Punkte
                    </div>
                </div>

                {/* Tier Benefits */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Tier-Vorteile</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {tiers.map((tier, index) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-xl p-6 border-2 ${tier.name === currentTier ? "border-[#0018A8] shadow-lg" : "border-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-white font-bold`}>
                                        {tier.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{tier.name}</div>
                                        <div className="text-xs text-[#666666]">
                                            {tier.min.toLocaleString()} - {tier.max.toLocaleString()} Punkte
                                        </div>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {tier.benefits.map((benefit, i) => (
                                        <li key={i} className="text-sm flex items-center gap-2">
                                            <span className="text-green-500">✓</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Redeem Points */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Punkte einlösen</h2>
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
                                    <div className="font-semibold mb-2">{option.name}</div>
                                    <div className="text-sm text-[#666666] mb-4">{option.points.toLocaleString()} Punkte</div>
                                    <button
                                        disabled={userPoints < option.points}
                                        className={`w-full py-2 rounded-lg font-semibold transition ${userPoints >= option.points
                                                ? "bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white hover:shadow-lg"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {userPoints >= option.points ? "Einlösen" : "Nicht genug Punkte"}
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
                        Wie Sie Punkte sammeln
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl mb-2">💳</div>
                            <div className="font-semibold mb-1">Transaktionen</div>
                            <div className="text-sm text-[#666666]">1 Punkt pro €1 Ausgabe</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">👥</div>
                            <div className="font-semibold mb-1">Freunde werben</div>
                            <div className="text-sm text-[#666666]">500 Punkte pro Empfehlung</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎯</div>
                            <div className="font-semibold mb-1">Monatliche Ziele</div>
                            <div className="text-sm text-[#666666]">Bonus-Punkte verdienen</div>
                        </div>
                    </div>
                </div>

                {/* Points History */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold mb-4">Punkte-Verlauf</h3>
                    <div className="space-y-3">
                        {pointsHistory.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-sm">{item.description}</div>
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
                    <h3 className="text-2xl font-bold mb-2">Freunde einladen</h3>
                    <p className="mb-6 opacity-90">
                        Laden Sie Freunde ein und erhalten Sie beide 500 Punkte!
                    </p>
                    <div className="bg-white/20 rounded-lg p-4 mb-4 font-mono text-sm">
                        https://despendables.de/ref/MAX123
                    </div>
                    <button className="bg-white text-[#0018A8] px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
                        Link teilen
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
