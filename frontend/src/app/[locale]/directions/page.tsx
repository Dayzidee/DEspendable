"use client";

import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function DirectionsPage() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("directions.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("directions.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Map Placeholder */}
                        <ScrollReveal direction="left">
                            <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 h-[400px]">
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-16 h-16 text-[#0018A8] mx-auto mb-4" />
                                        <p className="text-[#666666] font-semibold">{t("directions.map_title")}</p>
                                        <p className="text-sm text-[#999999]">{t("directions.address")}, {t("directions.city_zip")}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Contact Information */}
                        <ScrollReveal direction="right">
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white flex-shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{t("directions.address")}</h3>
                                            <p className="text-[#666666]">{t("directions.address")}</p>
                                            <p className="text-[#666666]">{t("directions.city_zip")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{t("impressum.phone")}</h3>
                                            <p className="text-[#666666]">{t("directions.phone")}</p>
                                            <p className="text-sm text-[#999999]">{t("directions.customer_service_247")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{t("impressum.email")}</h3>
                                            <p className="text-[#666666]">{t("directions.email")}</p>
                                            <p className="text-sm text-[#999999]">{t("directions.response_time")}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{t("landing.contact_hours")}</h3>
                                            <p className="text-[#666666]">{t("directions.hours")}</p>
                                            <p className="text-sm text-[#999999]">{t("directions.online_banking_247")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact" className="relative z-10 py-16 px-6 bg-white">
                <div className="max-w-3xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">{t("directions.form_title")}</h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2}>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t("landing.contact_name")}</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder={t("auth.enterEmail").replace("Email", "Name")} // Fallback or new key
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t("landing.contact_email")}</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t("directions.form_subject")}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder={t("directions.form_subject_placeholder")}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t("directions.form_message")}</label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                    placeholder={t("directions.form_message_placeholder")}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                {t("directions.form_submit")}
                            </button>
                        </form>
                    </ScrollReveal>
                </div>
            </section>

            {/* Public Transport */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl font-bold text-center mb-8">{t("directions.reach_us_title")}</h2>
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-[#0018A8] mb-2">U-Bahn</div>
                                    <p className="text-[#666666]">U6 - Französische Straße</p>
                                    <p className="text-sm text-[#999999]">2 {t("directions.walk_suffix")}</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#0018A8] mb-2">S-Bahn</div>
                                    <p className="text-[#666666]">S1, S2, S25 - Friedrichstraße</p>
                                    <p className="text-sm text-[#999999]">5 {t("directions.walk_suffix")}</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#0018A8] mb-2">Bus</div>
                                    <p className="text-[#666666]">147, TXL - Unter den Linden</p>
                                    <p className="text-sm text-[#999999]">3 {t("directions.walk_suffix")}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
