"use client";

import { useTranslations } from "next-intl";

export default function Terms() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-[#F4F6F8] py-20 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-12 shadow-lg">
                <h1 className="text-4xl font-bold text-[#0018A8] mb-8">{t("terms.title")}</h1>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section1_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section1_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section2_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section2_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section3_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section3_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section4_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section4_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section5_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section5_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section6_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section6_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section7_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section7_text")}
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{t("terms.section8_title")}</h2>
                        <p className="text-[#666666] leading-relaxed mb-4">
                            {t("terms.section8_text")}
                        </p>
                    </section>

                    <p className="text-sm text-[#666666] mt-12">
                        {t("terms.status")}<br />
                        DEspendables Bank AG<br />
                        Friedrichstraße 123, 10117 Berlin
                    </p>
                </div>
            </div>
        </div>
    );
}

