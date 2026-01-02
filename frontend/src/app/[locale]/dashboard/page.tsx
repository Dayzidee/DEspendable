"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useTranslations } from 'next-intl';
import { useDiscreet } from "@/context/DiscreetContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import SpendingAnalytics from "@/components/dashboard/SpendingAnalytics";
import AccountIdentifier from "@/components/dashboard/AccountIdentifier";
import AccountsList from "@/components/dashboard/AccountsList";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import VirtualCard from "@/components/dashboard/VirtualCard";
import FloatingChatWidget from "@/components/dashboard/FloatingChatWidget";
import { FaUserShield, FaFileImport, FaBullseye, FaChevronRight, FaChartLine, FaTrophy, FaLightbulb } from 'react-icons/fa';
import Link from "next/link";

export default function Dashboard() {
    const { user, token, loading } = useAuth();
    const t = useTranslations();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && token) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setData(data);
                })
                .catch(err => setFetchError(err.message));
        }
    }, [user, token]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-[#0018A8] text-lg">{t('common.loading')}</div>
            </div>
        );
    }

    const totalBalance = data?.accounts?.reduce((acc: number, curr: any) => acc + parseFloat(curr.balance), 0) || 0;
    const accounts = data?.accounts?.map((acc: any) => ({
        id: acc.id,
        account_name: acc.type === 'Checking' ? 'Checking Account' : acc.type === 'Savings' ? 'Savings Account' : acc.type,
        masked_account_number: `•••• ${acc.id.slice(-4)}`,
        balance: parseFloat(acc.balance)
    })) || [];

    const recentTransactions = data?.recent_transactions?.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        amount: parseFloat(tx.amount),
        timestamp: tx.timestamp
    })) || [];

    // Mock chart data if not provided by API
    const chartData = {
        labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping'],
        datasets: [
            {
                data: [300, 150, 100, 450, 200],
                backgroundColor: [
                    '#0018A8',
                    '#E2001A',
                    '#00C853',
                    '#FFA000',
                    '#6200EA',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] pb-12">
            <div className="container mx-auto px-4 py-8">
                {/* 1. DASHBOARD HEADER */}
                <DashboardHeader
                    username={data?.recent_transactions?.[0]?.owner?.username || user.displayName || "User"}
                    tier={data?.account_tier || "Standard"}
                />

                {/* 2. FINANCIAL SUMMARY */}
                <FinancialSummary
                    totalBalance={totalBalance}
                    accountsCount={accounts.length}
                    pendingCount={0}
                />

                {/* 3. MAIN DASHBOARD GRID */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* [A] Main Content Column */}
                    <main className="w-full lg:w-2/3 space-y-6">
                        {/* Analytics Card */}
                        <SpendingAnalytics data={chartData} />

                        {/* Account Identifier */}
                        <AccountIdentifier accountNumber={user.uid || "1234567890"} />

                        {/* Accounts Card */}
                        <AccountsList accounts={accounts} />

                        {/* Recent Transactions Card */}
                        <RecentTransactions transactions={recentTransactions} />
                    </main>

                    {/* [B] Sidebar Column */}
                    <Sidebar>
                        {/* Quick Actions Card */}
                        <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Quick Actions</h2>
                            </header>
                            <div className="space-y-3">
                                {/* Admin Panel - Show conditionally if needed, simplified here */}
                                <Link href="/admin" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <FaUserShield />
                                        </div>
                                        <span className="font-medium text-[var(--color-text-primary)]">Admin Panel</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[var(--color-primary)]" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                                            <FaFileImport />
                                        </div>
                                        <span className="font-medium text-[var(--color-text-primary)]">Import Statement</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[var(--color-primary)]" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] flex items-center justify-center">
                                            <FaBullseye />
                                        </div>
                                        <span className="font-medium text-[var(--color-text-primary)]">Manage Goals</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[var(--color-primary)]" />
                                </Link>
                            </div>
                        </section>

                        {/* Financial Insights Card */}
                        <section className="bg-white rounded-xl shadow-sm p-6 mb-6 card-hover">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Financial Insights</h2>
                            </header>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] flex items-center justify-center">
                                        <FaChartLine />
                                    </div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        You&apos;ve spent <strong className="text-[var(--color-text-primary)]">$250.75</strong> on Entertainment, 15% more than last month.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center">
                                        <FaTrophy />
                                    </div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        <strong>Goal Alert:</strong> You are <strong className="text-[var(--color-text-primary)]">85%</strong> of the way to your "Vacation Fund" goal!
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Virtual Card */}
                        <VirtualCard cardHolder={data?.recent_transactions?.[0]?.owner?.username || user.displayName || "User"} />
                    </Sidebar>
                </div>
            </div>

            {/* 4. FLOATING CHAT WIDGET */}
            <FloatingChatWidget />
        </div>
    );
}
