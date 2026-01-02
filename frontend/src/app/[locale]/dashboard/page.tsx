"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useTranslations } from 'next-intl';
import { useDiscreet } from "@/context/DiscreetContext";
import { formatCurrency, formatDate } from "@/lib/formatters";
import DiscreetToggle from "@/components/DiscreetToggle";
import LanguageSwitch from "@/components/LanguageSwitch";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

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
            // Use internal Next.js API Route
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

    const blurClass = isDiscreet ? "blur-md select-none" : "";
    const totalBalance = data?.accounts?.reduce((acc: number, curr: any) => acc + parseFloat(curr.balance), 0) || 0;

    // Calculate monthly income and expenses
    const monthlyIncome = data?.recent_transactions
        ?.filter((tx: any) => tx.type === 'receive')
        ?.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0) || 0;

    const monthlyExpenses = data?.recent_transactions
        ?.filter((tx: any) => tx.type === 'send')
        ?.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0) || 0;

    // Spending by category (Fetch from Analytics API in real implementation, using mock fallback from API for now)
    const spendingData = {
        labels: ['Lebensmittel', 'Transport', 'Unterhaltung', 'Shopping', 'Sonstiges'],
        datasets: [{
            data: [450, 230, 180, 320, 150], // TODO: Fetch from /api/analytics
            backgroundColor: [
                '#0018A8',
                '#0025D9',
                '#E2001A',
                '#00C853',
                '#FFA000',
            ],
            borderWidth: 0,
        }]
    };

    // Monthly trend data
    const trendData = {
        labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Einnahmen',
                data: [2400, 2600, 2800, 2500, 2900, 3100],
                borderColor: '#00C853',
                backgroundColor: 'rgba(0, 200, 83, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Ausgaben',
                data: [1800, 1900, 2100, 1850, 2000, 1950],
                borderColor: '#E2001A',
                backgroundColor: 'rgba(226, 0, 26, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white pt-12 pb-32 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-sm opacity-80 mb-1">{t('dashboard.welcome')}</p>
                            <h1 className="text-2xl font-bold">
                                {data?.recent_transactions?.[0]?.owner?.username || user.displayName || "Nutzer"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageSwitch />
                            <DiscreetToggle />
                            <button
                                onClick={() => auth.signOut()}
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Total Balance Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <p className="text-sm opacity-70 uppercase tracking-wide mb-2">{t('dashboard.totalBalance')}</p>
                        <div className={`text-5xl font-bold ${blurClass}`}>
                            {formatCurrency(totalBalance)}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-300" />
                                <span className="text-sm">+12.5% {t('dashboard.thisMonth')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-6 -mt-20 space-y-6">
                {fetchError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-[#E2001A] rounded-xl text-sm">
                        Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#666666]">{t('dashboard.income')}</span>
                            <ArrowUpRight className="w-5 h-5 text-green-500" />
                        </div>
                        <div className={`text-2xl font-bold text-green-600 ${blurClass}`}>
                            {formatCurrency(monthlyIncome)}
                        </div>
                        <div className="text-xs text-[#666666] mt-1">{t('dashboard.thisMonth')}</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#666666]">{t('dashboard.expenses')}</span>
                            <ArrowDownRight className="w-5 h-5 text-red-500" />
                        </div>
                        <div className={`text-2xl font-bold text-[#E2001A] ${blurClass}`}>
                            {formatCurrency(monthlyExpenses)}
                        </div>
                        <div className="text-xs text-[#666666] mt-1">Diesen Monat</div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Spending Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">{t('dashboard.spendingByCategory')}</h3>
                        <div className="h-64">
                            <Doughnut
                                data={spendingData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">{t('dashboard.monthlyTrend')}</h3>
                        <div className="h-64">
                            <Line data={trendData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Accounts List */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-[#1C1C1C]">{t('dashboard.accounts')}</h2>
                        <Link href="/accounts" className="text-sm text-[#0018A8] font-semibold hover:underline">
                            {t('dashboard.viewAll')} →
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {data?.accounts?.map((acc: any, index: number) => (
                            <motion.div
                                key={acc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white">
                                        {acc.type === 'Checking' ? <Wallet className="w-5 h-5" /> : <PiggyBank className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1C1C1C] text-sm">
                                            {acc.type === 'Checking' ? t('accounts.checking') : acc.type === 'Savings' ? t('accounts.savings') : acc.type}
                                        </h3>
                                        <p className="text-xs text-[#666666] font-mono">•••• {acc.id.slice(-4)}</p>
                                    </div>
                                </div>
                                <div className={`text-2xl font-bold text-[#0018A8] ${blurClass}`}>
                                    {formatCurrency(acc.balance)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="/transfer"
                        className="group bg-gradient-to-r from-[#0018A8] to-[#0025D9] hover:shadow-xl text-white p-5 rounded-xl flex flex-col items-center justify-center transition-all hover:-translate-y-1"
                    >
                        <svg className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        <span className="text-sm font-bold">{t('navigation.transfer')}</span>
                    </Link>
                    <Link
                        href="/transfer/scan"
                        className="group bg-white hover:bg-gray-50 text-[#0018A8] border-2 border-[#0018A8] p-5 rounded-xl flex flex-col items-center justify-center transition-all hover:-translate-y-1"
                    >
                        <svg className="w-7 h-7 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-sm font-bold">{t('transfer.photoTransfer')}</span>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <section className="pb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-[#1C1C1C]">{t('dashboard.recentActivity')}</h2>
                        <Link href="/transactions" className="text-sm text-[#0018A8] font-semibold hover:underline">
                            {t('dashboard.viewAll')} →
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {data?.recent_transactions?.slice(0, 5).map((tx: any, index: number) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {tx.type === 'receive' ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1C1C1C]">{tx.notes || "Transaction"}</p>
                                        <p className="text-xs text-[#666666]">{formatDate(tx.timestamp)}</p>
                                    </div>
                                </div>
                                <div className={`font-bold text-sm ${tx.type === 'receive' ? 'text-green-600' : 'text-[#1C1C1C]'} ${blurClass}`}>
                                    {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount)}
                                </div>
                            </motion.div>
                        ))}
                        {data?.recent_transactions?.length === 0 && (
                            <div className="p-8 text-center text-[#666666] text-sm">
                                {t('dashboard.noTransactions')}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
