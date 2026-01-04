"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FaChartLine, FaArrowUp, FaBriefcase } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export default function InvestmentsPage() {
    const { token } = useAuth();
    const t = useTranslations('investments');
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('/api/investments', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setInvestments(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token]);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('title')}</h1>
                    <p className="text-gray-500">{t('subtitle')}</p>
                </header>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="block text-purple-100 mb-1">{t('total_value')}</span>
                            <h2 className="text-4xl font-bold">€12.450,00</h2>
                            <div className="flex items-center gap-2 mt-2 text-green-300 bg-green-500/20 px-3 py-1 rounded-full w-fit">
                                <FaArrowUp /> +5.2% ({t('past_month')})
                            </div>
                        </div>
                        <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                            {t('invest_more')}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-gray-500">Loading Investments...</div>
                    ) : (
                        investments.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        item.color === 'green' ? 'bg-green-100 text-green-600' :
                                            'bg-orange-100 text-orange-600'
                                        }`}>
                                        <FaBriefcase />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--color-text-primary)]">{item.name}</h3>
                                        <span className="text-xs text-gray-500">{item.category}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-bold">€{item.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                                    <span className="text-green-600 font-medium text-sm">{item.change}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
