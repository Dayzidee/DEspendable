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
                        {t("impressum.address_name")}<br />
                        {t("impressum.address_street")}<br />
                        {t("impressum.address_city")}<br />
                        {t("impressum.address_country")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.represented_by")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.management")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.contact")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.phone")}: {t("directions.phone")}<br />
                        {t("impressum.email")}: {t("directions.email")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.register")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.register_text")}<br />
                        {t("impressum.register_court")}<br />
                        {t("impressum.register_number")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.vat_id")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.vat_id_text")}<br />
                        {t("impressum.vat_number")}
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-200">{t("impressum.authority")}</h2>
                    <p className="text-gray-400">
                        {t("impressum.authority_name")}<br />
                        {t("impressum.authority_address")}
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <p>{t("impressum.demo_notice")}</p>
                </div>
            </div>
        </div>
    );
}

