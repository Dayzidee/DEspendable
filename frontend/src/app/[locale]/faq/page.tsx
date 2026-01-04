"use client";

import { useTranslations } from "next-intl";

export default function FAQ() {
    const t = useTranslations("faq");

    const faqs = [
        {
            question: t("q1"),
            answer: t("a1")
        },
        {
            question: t("q2"),
            answer: t("a2")
        },
        {
            question: t("q3"),
            answer: t("a3")
        },
        {
            question: t("q4"),
            answer: t("a4")
        },
        {
            question: t("q5"),
            answer: t("a5")
        },
        {
            question: t("q6"),
            answer: t("a6")
        },
        {
            question: t("q7"),
            answer: t("a7")
        },
        {
            question: t("q8"),
            answer: t("a8")
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F6F8] py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-[#0018A8] mb-4 text-center">{t("title")}</h1>
                <p className="text-xl text-[#666666] text-center mb-12">
                    {t("subtitle")}
                </p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 group">
                            <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-[#1C1C1C]">
                                {faq.question}
                                <span className="text-[#0018A8] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="text-[#666666] mt-4 leading-relaxed">{faq.answer}</p>
                        </details>
                    ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-[#0018A8] to-[#0025D9] rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">{t("more_questions")}</h3>
                    <p className="mb-6">{t("support_text")}</p>
                    <a href="mailto:support@despendables.de" className="inline-block px-8 py-3 bg-white text-[#0018A8] font-bold rounded-lg hover:shadow-lg transition">
                        {t("contact_button")}
                    </a>
                </div>
            </div>
        </div>
    );
}

