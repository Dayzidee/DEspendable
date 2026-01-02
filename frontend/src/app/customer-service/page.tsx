"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { MessageCircle, Phone, Mail, Clock, HelpCircle } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import LandingHeader from "@/components/navigation/LandingHeader";

export default function CustomerServicePage() {
    const { t } = useLanguage();

    const contactMethods = [
        {
            icon: <MessageCircle className="w-8 h-8" />,
            title: t("customer_service.chat_title"),
            description: t("customer_service.chat_desc"),
            action: "Start Chat",
            color: "from-blue-500 to-indigo-600",
        },
        {
            icon: <Phone className="w-8 h-8" />,
            title: t("customer_service.phone_title"),
            description: t("customer_service.phone_desc"),
            action: "Call Now",
            color: "from-emerald-500 to-teal-600",
        },
        {
            icon: <Mail className="w-8 h-8" />,
            title: t("customer_service.email_title"),
            description: t("customer_service.email_desc"),
            action: "Send Email",
            color: "from-purple-500 to-pink-600",
        },
    ];

    const faqs = [
        {
            question: "How do I open an account?",
            answer: "Click 'Open Account' and complete the online application. You'll need a valid ID and proof of address. The process takes about 5 minutes.",
        },
        {
            question: "Are there any monthly fees?",
            answer: "Our basic account is completely free with no monthly fees. Premium accounts start at €4.99/month with additional benefits.",
        },
        {
            question: "How long do transfers take?",
            answer: "Internal transfers are instant. SEPA transfers typically arrive within 1 business day. International transfers take 2-5 business days.",
        },
        {
            question: "Is my money insured?",
            answer: "Yes, deposits are insured up to €100,000 per customer through the German deposit insurance scheme.",
        },
        {
            question: "Can I use DEspendables abroad?",
            answer: "Absolutely! Use your card worldwide with no foreign transaction fees. We support 30+ currencies.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F4F6F8] via-white to-[#E3E7FF] relative overflow-hidden">
            <AnimatedBackground />

            <LandingHeader />

            <section className="relative z-10 pt-20 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t("customer_service.title")}</h1>
                        <p className="text-xl text-[#666666] mb-8">{t("customer_service.subtitle")}</p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Live Chat Demo */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Live Support Chat</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm text-[#666666]">Online now</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 h-64 overflow-y-auto">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-xs">
                                        <p className="text-sm">Hello! How can I help you today?</p>
                                        <span className="text-xs text-[#999999] mt-1 block">Support Agent • 2 min ago</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <div className="bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white rounded-2xl rounded-tr-none p-4 max-w-xs">
                                        <p className="text-sm">I have a question about virtual cards</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-xs">
                                        <p className="text-sm">I'd be happy to help! You can create unlimited virtual cards in the app. Would you like me to walk you through the process?</p>
                                        <span className="text-xs text-[#999999] mt-1 block">Support Agent • Just now</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-100 outline-none"
                                    disabled
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                                    Send
                                </button>
                            </div>

                            <p className="text-center text-sm text-[#666666] mt-4">
                                {t("customer_service.response_time")}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="relative z-10 py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal direction="up">
                        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Preferred Contact Method</h2>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.15} direction="scale">
                        <div className="grid md:grid-cols-3 gap-8">
                            {contactMethods.map((method, index) => (
                                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center text-white`}>
                                        {method.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[#1C1C1C]">{method.title}</h3>
                                    <p className="text-[#666666] mb-6">{method.description}</p>
                                    <button className="w-full px-6 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                                        {method.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal direction="up">
                        <div className="flex items-center justify-center gap-3 mb-12">
                            <HelpCircle className="w-10 h-10 text-[#0018A8]" />
                            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal stagger={0.1} direction="up">
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <details key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 group">
                                    <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between text-[#1C1C1C]">
                                        {faq.question}
                                        <span className="text-[#0018A8] group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <p className="mt-4 text-[#666666] leading-relaxed">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up">
                        <div className="text-center mt-12">
                            <p className="text-[#666666] mb-4">Can't find what you're looking for?</p>
                            <Link href="/faq" className="inline-block px-8 py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all">
                                View All FAQs
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Support Hours */}
            <section className="relative z-10 py-16 px-6 bg-gradient-to-br from-[#0018A8] to-[#0025D9] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollReveal direction="up">
                        <Clock className="w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-6">We're Here When You Need Us</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-2xl font-bold mb-2">Live Chat & Phone</div>
                                <div className="opacity-80">24/7 • Every day of the year</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="text-2xl font-bold mb-2">Email Support</div>
                                <div className="opacity-80">Response within 24 hours</div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
