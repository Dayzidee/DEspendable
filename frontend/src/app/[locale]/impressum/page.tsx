"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Impressum() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <Link href="/login" className="text-gray-400 hover:text-white transition mb-8 block">
                    ← {t("common.back")}
                </Link>

                <h1 className="text-3xl font-bold text-white mb-4">{t("impressum.title")}</h1>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.section_tmg")}</h2>
                    <p className="text-gray-400">
                        DEspendables GmbH<br />
                        Finanzplatz 1<br />
                        60311 Frankfurt am Main<br />
                        Deutschland
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.represented_by")}</h2>
                    <p className="text-gray-400">
                        Max Mustermann (CEO)<br />
                        Erika Musterfrau (CTO)
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.contact")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.phone")}: +49 (0) 69 12345678<br />
                        {t("impressum.email")}: kontakt@despendables.de
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.register")}</h2>
                    <p className="text-gray-400">
                        Eintragung im Handelsregister.<br />
                        Registergericht: Amtsgericht Frankfurt am Main<br />
                        Registernummer: HRB 12345
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.vat_id")}</h2>
                    <p className="text-gray-400">
                        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                        DE 123 456 789
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.authority")}</h2>
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

