"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Cpu, Link as LinkIcon, Leaf, Globe } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function VisionPage() {
    const { t } = useLanguage();

    const initiatives = [
        {
            icon: <Cpu className="w-8 h-8" />,
            title: t("vision.initiative_ai"),
            description: t("vision.initiative_ai_desc"),
            color: "from-blue-500 to-indigo-600",
            year: "2026",
        },
        {
            icon: <LinkIcon className="w-8 h-8" />,
            title: t("vision.initiative_blockchain"),
            description: t("vision.initiative_blockchain_desc"),
            color: "from-purple-500 to-pink-600",
            year: "2027",
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: t("vision.initiative_open"),
            description: t("vision.initiative_open_desc"),
            color: "from-emerald-500 to-teal-600",
            year: "2028",
        },
        {
            icon: <Leaf className="w-8 h-8" />,
            title: t("vision.initiative_sustainability"),
            description: t("vision.initiative_sustainability_desc"),
            color: "from-green-500 to-lime-600",
            year: "2029",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("vision.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("vision.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                            <p className="text-lg md:text-xl text-[#1C1C1C] leading-relaxed">{t("vision.statement")}</p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">{t("vision.roadmap_title")}</h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.2} direction="up">
                        <div className="space-y-8">
                            {initiatives.map((initiative, index) => (
                                <div key={index} className="flex gap-6 items-start">
                                    <div className="flex-shrink-0 w-24 text-center">
                                        <div className="text-3xl font-bold text-[#0018A8]">{initiative.year}</div>
                                    </div>
                                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${initiative.color} flex items-center justify-center text-white flex-shrink-0`}>
                                                {initiative.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 text-[#1C1C1C]">{initiative.title}</h3>
                                                <p className="text-[#666666] leading-relaxed">{initiative.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-8">European Expansion</h2>
                        <p className="text-lg opacity-90 mb-12">By 2030, we aim to serve customers across 15 European countries</p>
                    </ScrollReveal>
                    <ScrollReveal stagger={0.1} direction="scale">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">5M+</div>
                                <div className="text-sm opacity-80">Target Customers</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">15</div>
                                <div className="text-sm opacity-80">Countries</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-4xl font-bold mb-2">€50B</div>
                                <div className="text-sm opacity-80">Assets Under Management</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-6">Be Part of the Future</h2>
                        <p className="text-xl text-[#666666] mb-8">Join us on our journey to transform banking</p>
                        <Link href="/signup" className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all">
                            Open Your Account
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
