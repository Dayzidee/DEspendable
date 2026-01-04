"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Datenschutz() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/login" className="text-gray-400 hover:text-white transition mb-8 block">
                    ← {t("common.back") || "Back"}
                </Link>

                <h1 className="text-3xl font-bold text-white mb-4">Datenschutzerklärung</h1>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">1. Datenschutz auf einen Blick</h2>
                    <p className="text-gray-400">
                        Allgemeine Hinweise: Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">2. Verantwortliche Stelle</h2>
                    <p className="text-gray-400">
                        DEspendables GmbH<br />
                        Finanzplatz 1<br />
                        60311 Frankfurt am Main<br />
                        kontakt@despendables.de
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">3. Datenerfassung auf unserer Website</h2>
                    <p className="text-gray-400 bold">Cookies</p>
                    <p className="text-gray-400">
                        Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an.
                        Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">4. Analyse-Tools und Tools von Drittanbietern</h2>
                    <p className="text-gray-400">
                        Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen.
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <p>This is a demo application for educational purposes.</p>
                </div>
            </div>
        </div>
    );
}
