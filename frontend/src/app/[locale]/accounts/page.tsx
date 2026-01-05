"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { FaPiggyBank, FaWallet, FaPlus } from "react-icons/fa";
import { useTranslations } from 'next-intl';

import { useAuth } from "@/context/AuthContext";
import InternalTransferModal from "@/components/accounts/InternalTransferModal";

export default function AccountsPage() {
    const { token } = useAuth();
    const t = useTranslations();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const fetchAccounts = () => {
        if (!token) return;
        setLoading(true);
        fetch('/api/accounts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setAccounts(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAccounts();
    }, [token]);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('accounts.your_accounts')}</h1>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowTransferModal(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#0018A8] rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-semibold whitespace-nowrap"
                        >
                            <FaWallet /> {t('transfer.transfer')}
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-md whitespace-nowrap">
                            <FaPlus /> {t('accounts.addAccount')}
                        </button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500 py-12">{t('accounts.loading_accounts')}</div>
                    ) : (
                        accounts.map((acc) => (
                            <div key={acc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] text-xl">
                                            {acc.type === 'Savings' ? <FaPiggyBank /> : <FaWallet />}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${acc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {acc.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{acc.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 font-mono">{acc.iban}</p>

                                    <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                        €{acc.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-xs text-gray-400">{t('accounts.available_balance')}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <InternalTransferModal
                isOpen={showTransferModal}
                onClose={() => setShowTransferModal(false)}
                accounts={accounts}
                token={token}
                onSuccess={fetchAccounts}
            />
        </DashboardLayout >
    );
}
