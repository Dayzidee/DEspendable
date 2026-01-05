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
import QuickTransfer from "../../../components/dashboard/QuickTransfer";
import VirtualCard from "@/components/dashboard/VirtualCard";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import FloatingChatWidget from "@/components/dashboard/FloatingChatWidget";
import { FaUserShield, FaFileImport, FaBullseye, FaChevronRight, FaChartLine, FaTrophy } from 'react-icons/fa';
import ProfileCompletionModal from "@/components/profile/ProfileCompletionModal";

export default function Dashboard() {
    const { user, token, loading, isAdmin } = useAuth();
    const t = useTranslations();
    const { isDiscreet } = useDiscreet();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [fetchError, setFetchError] = useState("");
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    const loadData = () => {
        if (user && token) {
            setIsDataLoading(true);
            const fetchDashboard = fetch(`/api/dashboard`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store'
            }).then(res => res.json());

            const fetchGoals = fetch(`/api/goals`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json());

            Promise.all([fetchDashboard, fetchGoals])
                .then(([dashboardData, goalsData]) => {
                    if (dashboardData.error) throw new Error(dashboardData.error);
                    setData({ ...dashboardData, goals: goalsData.error ? [] : goalsData });
                    setIsDataLoading(false);
                })
                .catch(err => {
                    setFetchError(err.message);
                    setIsDataLoading(false);
                });
        }
    };

    useEffect(() => {
        loadData();
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
    const totalBalance = data?.total_balance || 0;
    // Use firstName if available, otherwise display name or email part
    const displayName = data?.firstName || user.displayName || user.email?.split('@')[0] || "User";

    const chartData = {
        labels: data?.spending_by_category ? Object.keys(data.spending_by_category) : ['No Data'],
        datasets: [
            {
                data: data?.spending_by_category ? Object.values(data.spending_by_category) as number[] : [1],
                backgroundColor: ['#0018A8', '#00C853', '#FFD600', '#FF6D00', '#E2001A', '#6200EA', '#00BFA5'],
                borderWidth: 0,
            }
        ]
    };

    // Insight Logic
    const highestCategory = data?.spending_by_category
        ? Object.entries(data.spending_by_category as Record<string, number>)
            .sort((a, b) => b[1] - a[1])[0]
        : null;

    const topGoal = data?.goals?.length > 0
        ? [...data.goals].sort((a: any, b: any) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0]
        : null;

    return (
        <DashboardLayout>
            {/* Profile Completion Modal - Blocks interaction if profile is incomplete */}
            {!isDataLoading && data && (
                <ProfileCompletionModal
                    isOpen={!data.isProfileComplete}
                    onSuccess={() => {
                        loadData(); // Reload data to close modal and update UI
                    }}
                />
            )}

            <div className={`max-w-7xl mx-auto pb-12 ${!data?.isProfileComplete ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                    <DashboardHeader
                        username={displayName}
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

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8 min-w-0">
                        <AccountIdentifier />
                        <AccountsList accounts={accounts} />
                        <SpendingAnalytics data={chartData} />
                        <RecentTransactions transactions={recentTransactions} />
                    </div>

                    {/* Right Column - Sidebar Widgets */}
                    <div className="lg:col-span-4 space-y-6 md:space-y-8 min-w-0">
                        {/* <QuickTransfer /> */}


                        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[#1C1C1C]">{t('dashboard.quickActions')}</h2>
                            </header>
                            <div className="space-y-3">
                                {isAdmin && (
                                    <Link href="/admin" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                <FaUserShield />
                                            </div>
                                            <span className="font-medium text-[#1C1C1C]">{t('dashboard.admin_panel')}</span>
                                        </div>
                                        <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                    </Link>
                                )}

                                <Link href="/import" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0018A8] flex items-center justify-center">
                                            <FaFileImport />
                                        </div>
                                        <span className="font-medium text-[#1C1C1C]">{t('dashboard.import_statement')}</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                </Link>

                                <Link href="/goals" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                            <FaBullseye />
                                        </div>
                                        <span className="font-medium text-[#1C1C1C]">{t('dashboard.manage_goals')}</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400 group-hover:text-[#0018A8]" />
                                </Link>
                            </div>
                        </section>

                        <GoalsWidget goals={data?.goals || []} />

                        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
                            <header className="mb-4">
                                <h2 className="text-xl font-bold text-[#1C1C1C]">{t('dashboard.financial_insights')}</h2>
                            </header>
                            <div className="space-y-4">
                                {highestCategory ? (
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                            <FaChartLine />
                                        </div>
                                        <p className="text-sm text-[#666666]">
                                            {t.rich('dashboard.spending_insight', {
                                                bold: (chunks) => <strong className="text-[#1C1C1C]">{chunks}</strong>,
                                                amount: highestCategory[1].toFixed(2),
                                                category: highestCategory[0],
                                                percentage: Math.floor(Math.random() * 20) + 5 // Simulated trend for now
                                            })}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic px-2">{t('dashboard.noSpendingData')}</p>
                                )}

                                {topGoal ? (
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <FaTrophy />
                                        </div>
                                        <p className="text-sm text-[#666666]">
                                            {t.rich('dashboard.goal_alert', {
                                                bold: (chunks) => <strong className="text-[#1C1C1C]">{chunks}</strong>,
                                                percentage: Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100),
                                                goalName: topGoal.name
                                            })}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                            <FaBullseye />
                                        </div>
                                        <p className="text-sm text-[#666666] italic">
                                            {t('goals.no_goals')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* <VirtualCard cardHolder={displayName} /> */}
                    </div>
                </div>
            </div>
            <FloatingChatWidget />
        </DashboardLayout>
    );
}
