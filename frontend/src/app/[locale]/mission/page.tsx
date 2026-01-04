"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Shield, Lightbulb, Eye, Users } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function MissionPage() {
    const { t } = useLanguage();

    const values = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: t("mission.value_security"),
            description: t("mission.value_security_desc"),
            color: "from-blue-500 to-blue-600",
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: t("mission.value_innovation"),
            description: t("mission.value_innovation_desc"),
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: <Eye className="w-8 h-8" />,
            title: t("mission.value_transparency"),
            description: t("mission.value_transparency_desc"),
            color: "from-emerald-500 to-emerald-600",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: t("mission.value_customer"),
            description: t("mission.value_customer_desc"),
            color: "from-amber-500 to-amber-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            {/* Header */}
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                            {t("mission.title")}
                        </h1>
                        <p className="text-xl text-[#666666] mb-8">
                            {t("mission.subtitle")}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                            <p className="text-lg md:text-xl text-[#1C1C1C] leading-relaxed">
                                {t("mission.statement")}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Core Values */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">
                            {t("mission.values_title")}
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.15} direction="scale">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <div
                                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4`}
                                    >
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#1C1C1C]">
                                        {value.title}
                                    </h3>
                                    <p className="text-[#666666] leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Regulatory Compliance */}
            <section className="relative z-10 py-16 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-8">Regulatory Compliance</h2>
                        <p className="text-lg opacity-90 mb-12">
                            We adhere to the highest standards of financial regulation and data protection
                        </p>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.1} direction="scale">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">BaFin</div>
                                <div className="text-sm opacity-80">Regulated</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">GDPR</div>
                                <div className="text-sm opacity-80">Compliant</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">PCI-DSS</div>
                                <div className="text-sm opacity-80">Certified</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
                        <p className="text-xl text-[#666666] mb-8">
                            Experience banking that aligns with your values
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            Open Your Account
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
