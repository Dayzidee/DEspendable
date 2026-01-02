"use client";

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { Linkedin } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";
import Image from "next/image";

export default function TeamPage() {
    const t = useTranslations();

    const leadership = [
        {
            name: "Dr. Anna Schmidt",
            title: "Chief Executive Officer",
            bio: "Former VP at Deutsche Bank with 20+ years in fintech innovation",
            image: "/team/ceo.jpg",
        },
        {
            name: "Michael Weber",
            title: "Chief Technology Officer",
            bio: "Ex-Google engineer specializing in AI and distributed systems",
            image: "/team/cto.jpg",
        },
        {
            name: "Sarah Müller",
            title: "Chief Financial Officer",
            bio: "Previously CFO at N26, expert in digital banking economics",
            image: "/team/cfo.jpg",
        },
        {
            name: "Thomas Klein",
            title: "Chief Operating Officer",
            bio: "Operations leader with experience scaling startups to unicorns",
            image: "/team/coo.jpg",
        },
        {
            name: "Lisa Hoffmann",
            title: "Chief Product Officer",
            bio: "Product visionary from Revolut, focused on user-centric design",
            image: "/team/cpo.jpg",
        },
        {
            name: "David Schneider",
            title: "Chief Security Officer",
            bio: "Cybersecurity expert, former head of security at Commerzbank",
            image: "/team/cso.jpg",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("team.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("team.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">{t("team.leadership")}</h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.15} direction="scale">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {leadership.map((member, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white text-4xl font-bold">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h3 className="text-xl font-bold text-center mb-1 text-[#1C1C1C]">{member.name}</h3>
                                    <p className="text-sm text-[#0018A8] text-center mb-3 font-semibold">{member.title}</p>
                                    <p className="text-[#666666] text-center text-sm leading-relaxed mb-4">{member.bio}</p>
                                    <div className="flex justify-center">
                                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Linkedin className="w-5 h-5 text-[#0018A8]" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
                        <p className="text-xl text-[#666666] mb-8">We're always looking for talented individuals to join our mission</p>
                        <Link href="/careers" className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all">
                            View Open Positions
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
