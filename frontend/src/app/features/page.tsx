"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Zap, Brain, CreditCard, Gift, Globe, HeadphonesIcon, Shield, Check } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function FeaturesPage() {
    const { t } = useLanguage();

    const features = [
        {
            icon: <Zap className="w-12 h-12" />,
            title: t("features_page.instant_transfers"),
            description: t("features_page.instant_transfers_desc"),
            color: "from-blue-500 to-indigo-600",
            benefits: [
                "Send money in seconds",
                "No transaction fees for P2P transfers",
                "Works 24/7, even on weekends",
                "Instant notifications",
            ],
            image: "instant-transfer",
        },
        {
            icon: <Brain className="w-12 h-12" />,
            title: t("features_page.ai_analytics"),
            description: t("features_page.ai_analytics_desc"),
            color: "from-purple-500 to-pink-600",
            benefits: [
                "Automatic expense categorization",
                "Personalized savings recommendations",
                "Spending trend analysis",
                "Budget alerts and insights",
            ],
            image: "ai-analytics",
        },
        {
            icon: <CreditCard className="w-12 h-12" />,
            title: t("features_page.virtual_cards"),
            description: t("features_page.virtual_cards_desc"),
            color: "from-emerald-500 to-teal-600",
            benefits: [
                "Create unlimited virtual cards",
                "Set custom spending limits",
                "One-time use for maximum security",
                "Instant card generation",
            ],
            image: "virtual-cards",
        },
        {
            icon: <Gift className="w-12 h-12" />,
            title: t("features_page.rewards"),
            description: t("features_page.rewards_desc"),
            color: "from-amber-500 to-orange-600",
            benefits: [
                "Earn 1% on all transactions",
                "Bonus points for partner merchants",
                "Redeem for cashback or travel",
                "No expiration on points",
            ],
            image: "rewards",
        },
        {
            icon: <Globe className="w-12 h-12" />,
            title: t("features_page.multi_currency"),
            description: t("features_page.multi_currency_desc"),
            color: "from-cyan-500 to-blue-600",
            benefits: [
                "Hold 30+ currencies",
                "Real-time exchange rates",
                "No hidden fees",
                "Perfect for travelers",
            ],
            image: "multi-currency",
        },
        {
            icon: <HeadphonesIcon className="w-12 h-12" />,
            title: t("features_page.support"),
            description: t("features_page.support_desc"),
            color: "from-rose-500 to-red-600",
            benefits: [
                "24/7 live chat support",
                "Phone support in 5 languages",
                "Average 2-minute response time",
                "Dedicated account managers for premium",
            ],
            image: "support",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("features_page.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("features_page.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Features List */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    {features.map((feature, index) => (
                        <ScrollReveal key={index} direction={index % 2 === 0 ? "left" : "right"}>
                            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                                {/* Content */}
                                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6`}>
                                        {feature.icon}
                                    </div>
                                    <h2 className="text-4xl font-bold mb-4 text-[#1C1C1C]">{feature.title}</h2>
                                    <p className="text-lg text-[#666666] mb-6 leading-relaxed">{feature.description}</p>

                                    <div className="space-y-3 mb-8">
                                        {feature.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-[#666666]">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href="/signup"
                                        className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </div>

                                {/* Image Placeholder */}
                                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                                    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                                        <div className={`w-full h-80 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white`}>
                                            <div className="text-center">
                                                {feature.icon}
                                                <p className="mt-4 font-semibold opacity-80">Feature Mockup</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            {/* Security Section */}
            <section id="security" className="relative z-10 py-16 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <Shield className="w-20 h-20 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold mb-6">Bank-Level Security</h2>
                        <p className="text-lg opacity-90 mb-12">
                            Your security is our top priority. We use the same encryption standards as major banks.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.1} direction="scale">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-3xl font-bold mb-2">256-bit</div>
                                <div className="text-sm opacity-80">AES Encryption</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-3xl font-bold mb-2">2FA</div>
                                <div className="text-sm opacity-80">Multi-Factor Auth</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-3xl font-bold mb-2">€100k</div>
                                <div className="text-sm opacity-80">Deposit Insurance</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-6">Ready to Experience Modern Banking?</h2>
                        <p className="text-xl text-[#666666] mb-8">
                            Join over 50,000 customers who trust DEspendables
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Open Your Free Account
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
