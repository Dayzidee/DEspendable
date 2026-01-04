"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useDiscreet } from "@/context/DiscreetContext";
import { formatCurrency, formatDate } from "@/lib/formatters";
import DiscreetToggle from "@/components/DiscreetToggle";
import LanguageSwitch from "@/components/LanguageSwitch";
import { Link } from "@/i18n/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FinancialSummary from "@/components/dashboard/FinancialSummary";
import SpendingAnalytics from "@/components/dashboard/SpendingAnalytics";
import AccountIdentifier from "@/components/dashboard/AccountIdentifier";
import AccountsList from "@/components/dashboard/AccountsList";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import VirtualCard from "@/components/dashboard/VirtualCard";
import FloatingChatWidget from "@/components/dashboard/FloatingChatWidget";
import { FaUserShield, FaFileImport, FaBullseye, FaChevronRight, FaChartLine, FaTrophy } from 'react-icons/fa';

export default function Dashboard() {
    const { user, token, loading } = useAuth();
    const t = useTranslations();
    const { isDiscreet } = useDiscreet();
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
            fetch(`/api/dashboard`, {
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

    const accounts = data?.accounts || [];
    const recentTransactions = data?.recent_transactions || [];
    const totalBalance = accounts.reduce((acc: number, curr: any) => acc + parseFloat(curr.balance), 0) || 0;

    // Convert data for SpendingAnalytics if needed
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Income',
                data: [2500, 2700, 2400, 2800, 2600, 3100],
                borderColor: '#00C853',
            },
            {
                label: 'Expenses',
                data: [1800, 2100, 1900, 2200, 2000, 1950],
                borderColor: '#E2001A',
            }
        ]
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <div className="flex justify-between items-start mb-4">
                    <DashboardHeader
                        username={data?.recent_transactions?.[0]?.owner?.username || user.displayName || "User"}
                        tier={data?.account_tier || "Standard"}
                    />
                    <div className="flex items-center gap-3">
                        <LanguageSwitch />
                        <DiscreetToggle />
                    </div>
                </div>

                {fetchError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-[#E2001A] rounded-xl text-sm">
                        {fetchError}
                    </div>
                )}

                <FinancialSummary
                    totalBalance={totalBalance}
                    accountsCount={accounts.length}
                    pendingCount={recentTransactions.filter((tx: any) => tx.status === 'pending').length}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <SpendingAnalytics data={chartData} />
                        <AccountIdentifier accountNumber={user.uid || "DE1234567890"} />
                        <AccountsList accounts={accounts} />
                        <RecentTransactions transactions={recentTransactions} />
                    </div>

                    <aside className="space-y-6">
                        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[#1C1C1C]">Quick Actions</h2>
                            </header>
                            <div className="space-y-3">
                                <Link href="/admin" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <FaUserShield />
                                        </div>
                                        <span className="font-medium text-[#1C1C1C]">Admin Panel</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0018A8] flex items-center justify-center">
                                            <FaFileImport />
                                        </div>
                                        <span className="font-medium text-[#1C1C1C]">Import Statement</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                </Link>

                                <Link href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                            <FaBullseye />
                                        </div>
                                        <span className="font-medium text-[#1C1C1C]">Manage Goals</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                </Link>
                            </div>
                        </section>

                        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[#1C1C1C]">Financial Insights</h2>
                            </header>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                        <FaChartLine />
                                    </div>
                                    <p className="text-sm text-[#666666]">
                                        You&apos;ve spent <strong className="text-[#1C1C1C]">€250.75</strong> on Entertainment, 15% more than last month.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <FaTrophy />
                                    </div>
                                    <p className="text-sm text-[#666666]">
                                        <strong>Goal Alert:</strong> You are <strong className="text-[#1C1C1C]">85%</strong> of the way to your "Vacation Fund" goal!
                                    </p>
                                </div>
                            </div>
                        </section>

                        <VirtualCard cardHolder={data?.recent_transactions?.[0]?.owner?.username || user.displayName || "User"} />
                    </aside>
                </div>
            </div>
            <FloatingChatWidget />
        </DashboardLayout>
    );
}
