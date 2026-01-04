"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Datenschutz() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/login" className="text-gray-400 hover:text-white transition mb-8 block">
                    ← {t("common.back")}
                </Link>

                <h1 className="text-3xl font-bold text-white mb-4">{t("datenschutz.title")}</h1>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("datenschutz.section1_title")}</h2>
                    <p className="text-gray-400">
                        {t("datenschutz.section1_text")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("datenschutz.section2_title")}</h2>
                    <p className="text-gray-400">
                        DEspendables GmbH<br />
                        Finanzplatz 1<br />
                        60311 Frankfurt am Main<br />
                        kontakt@despendables.de
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("datenschutz.section3_title")}</h2>
                    <p className="text-gray-400 bold">{t("datenschutz.section3_subtitle")}</p>
                    <p className="text-gray-400">
                        {t("datenschutz.section3_text")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("datenschutz.section4_title")}</h2>
                    <p className="text-gray-400">
                        {t("datenschutz.section4_text")}
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <p>This is a demo application for educational purposes.</p>
                </div>
            </div>
        </div>
    );
}

