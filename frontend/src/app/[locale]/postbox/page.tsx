"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/formatters";
import { Link } from "@/i18n/navigation";
import { FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export default function Postbox() {
    const { user, token } = useAuth();
    const t = useTranslations('postbox');
    const router = useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (user && token) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/documents`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('API endpoint not available');
                    }
                    return res.json();
                })
                .then(data => {
                    setDocuments(data || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.log('[Postbox] API not available, using empty state');
                    setDocuments([]);
                    setLoading(false);
                });
        }
    }, [user, token, router]);

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('title')}</h1>
                    <p className="text-gray-500">Manage and download your documents.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    {loading ? (
                        <div className="p-12 text-center text-[#666666]">
                            <div className="animate-spin w-8 h-8 border-4 border-[#0018A8] border-t-transparent rounded-full mx-auto mb-4"></div>
                            {t('search')}
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="p-12 text-center">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-[#666666]">{t('noDocuments')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {documents.map((doc, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-6 flex items-center justify-between hover:bg-gray-50 transition group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#0018A8] group-hover:bg-blue-100 transition">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#1C1C1C] group-hover:text-[#0018A8] transition">
                                                {doc.title}
                                            </h3>
                                            <p className="text-sm text-[#666666]">
                                                {formatDate(doc.created_at)} · {doc.type}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#0018A8] text-[#0018A8] rounded-lg text-sm font-semibold hover:bg-[#0018A8] hover:text-white transition">
                                        <Download className="w-4 h-4" />
                                        {t('download')}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-[#0018A8] mb-2">{t('retention')}</h3>
                    <p className="text-sm text-[#666666]">
                        {t('retentionInfo')}
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
