"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useTranslations } from 'next-intl';

import { useAuth } from "@/context/AuthContext";

export default function TransactionsPage() {
    const { token } = useAuth();
    const t = useTranslations();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        // Fetch transactions from API
        fetch('/api/transactions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setTransactions(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [token]);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('transactions.your_transactions')}</h1>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('transactions.search_placeholder')}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <FaFilter /> {t('common.filter')}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">{t('transactions.loading_transactions')}</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            // Logic to determine color based on type or if it's admin activity
                                            (tx.type === 'income' ||
                                                tx.description?.toLowerCase().includes('admin') ||
                                                tx.type?.toLowerCase().includes('admin'))
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                            }`}>
                                            {(tx.type === 'income' ||
                                                tx.description?.toLowerCase().includes('admin') ||
                                                tx.type?.toLowerCase().includes('admin'))
                                                ? <FaArrowDown />
                                                : <FaArrowUp />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text-primary)]">
                                                {(
                                                    tx.description?.toLowerCase().includes('admin') ||
                                                    tx.type?.toLowerCase().includes('admin') ||
                                                    tx.author === 'Admin'
                                                ) ? "Credit Alert" : tx.description}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {(
                                                    tx.description?.toLowerCase().includes('admin') ||
                                                    tx.type?.toLowerCase().includes('admin') ||
                                                    tx.author === 'Admin'
                                                ) ? "Money Received" : tx.category} • {new Date(tx.date).toLocaleDateString('de-DE')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-right font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-[var(--color-text-primary)]'
                                        }`}>
                                        {tx.type === 'income' ? '+' : '-'}€{Math.abs(tx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <div className="p-8 text-center text-gray-500">{t('transactions.no_transactions_found')}</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
