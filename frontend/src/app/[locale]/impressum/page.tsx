"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Impressum() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/login" className="text-gray-400 hover:text-white transition mb-8 block">
                    ← {t("common.back") || "Back"}
                </Link>

                <h1 className="text-3xl font-bold text-white mb-4">Impressum</h1>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Angaben gemäß § 5 TMG</h2>
                    <p className="text-gray-400">
                        DEspendables GmbH<br />
                        Finanzplatz 1<br />
                        60311 Frankfurt am Main<br />
                        Deutschland
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Vertreten durch</h2>
                    <p className="text-gray-400">
                        Max Mustermann (CEO)<br />
                        Erika Musterfrau (CTO)
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Kontakt</h2>
                    <p className="text-gray-400">
                        Telefon: +49 (0) 69 12345678<br />
                        E-Mail: kontakt@despendables.de
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Registereintrag</h2>
                    <p className="text-gray-400">
                        Eintragung im Handelsregister.<br />
                        Registergericht: Amtsgericht Frankfurt am Main<br />
                        Registernummer: HRB 12345
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Umsatzsteuer-ID</h2>
                    <p className="text-gray-400">
                        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                        DE 123 456 789
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">Aufsichtsbehörde</h2>
                    <p className="text-gray-400">
                        Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)<br />
                        Graurheindorfer Str. 108<br />
                        53117 Bonn
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <p>This is a demo application for educational purposes.</p>
                </div>
            </div>
        </div>
    );
}
