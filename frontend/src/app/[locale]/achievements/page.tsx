"use client";

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Trophy, Award, Star, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function AchievementsPage() {
    const t = useTranslations();

    const timeline = [
        { year: "2020", event: "Company Founded", description: "DEspendables Bank AG established in Berlin" },
        { year: "2021", event: "10,000 Customers", description: "Reached first major milestone in user growth" },
        { year: "2022", event: "BaFin License", description: "Received full banking license from German regulator" },
        { year: "2023", event: "€100M Volume", description: "Processed over €100 million in transactions" },
        { year: "2024", event: "AI Integration", description: "Launched AI-powered financial insights" },
        { year: "2025", event: "50,000+ Users", description: "Serving over 50,000 active customers" },
        { year: "2026", event: "European Expansion", description: "Expanding services across EU markets" },
    ];

    const awards = [
        { title: "Best Digital Bank 2025", org: "Fintech Awards Germany", icon: <Trophy className="w-8 h-8" /> },
        { title: "Innovation in Banking", org: "European Banking Association", icon: <Award className="w-8 h-8" /> },
        { title: "Customer Choice Award", org: "Banking Excellence Awards", icon: <Star className="w-8 h-8" /> },
        { title: "Fastest Growing Fintech", org: "TechCrunch Europe", icon: <TrendingUp className="w-8 h-8" /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("achievements.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("achievements.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">{t("achievements.timeline_title")}</h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.15} direction="up">
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0018A8] to-[#0025D9]" />
                            <div className="space-y-8">
                                {timeline.map((item, index) => (
                                    <div key={index} className="relative pl-20">
                                        <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white font-bold shadow-lg">
                                            {item.year}
                                        </div>
                                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                            <h3 className="text-xl font-bold mb-2 text-[#1C1C1C]">{item.event}</h3>
                                            <p className="text-[#666666]">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">{t("achievements.awards_title")}</h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.15} direction="scale">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {awards.map((award, index) => (
                                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white">
                                        {award.icon}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-[#1C1C1C]">{award.title}</h3>
                                    <p className="text-sm text-[#666666]">{award.org}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-8">{t("achievements.metrics_title")}</h2>
                    </ScrollReveal>
                    <ScrollReveal stagger={0.1} direction="scale">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2"><AnimatedCounter end={50000} suffix="+" duration={2.5} /></div>
                                <div className="text-sm opacity-80">Active Customers</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2"><AnimatedCounter end={99.9} decimals={1} suffix="%" duration={2.5} /></div>
                                <div className="text-sm opacity-80">Customer Satisfaction</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2"><AnimatedCounter end={2} suffix="M€+" duration={2.5} /></div>
                                <div className="text-sm opacity-80">Daily Transactions</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
