"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, Search, Edit, Trash2, Plus, ArrowLeft, MoreHorizontal, ShieldCheck, ShieldAlert, History } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import { useTranslations } from 'next-intl';
import BalanceAdjustmentModal from "@/components/admin/BalanceAdjustmentModal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
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
    Title,
    Tooltip,
    Legend,
    Filler
);

import AdminRoute from "@/components/auth/AdminRoute";

export default function AdminPanel() {
    return (
        <AdminRoute>
            <AdminContent />
        </AdminRoute>
    );
}

function AdminContent() {
    const { user, token } = useAuth();
    const t = useTranslations('admin');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [systemStats, setSystemStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [view, setView] = useState<'users' | 'transactions'>('users');
    const [showBalanceModal, setShowBalanceModal] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (token) {
            fetchData();
        }
    }, [user, token, router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const fetchUsers = fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());
            const fetchStats = fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());
            const fetchTx = fetch('/api/admin/transactions', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());

            const [userData, statsData, txData] = await Promise.all([fetchUsers, fetchStats, fetchTx]);

            if (!userData.error) setUsers(userData);
            if (!statsData.error) setSystemStats(statsData);
            if (!txData.error) setTransactions(txData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, status: newStatus })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const filteredUsers = users.filter((u: any) =>
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: t('userGrowth'),
            data: systemStats?.growth || [0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(0, 24, 168, 0.8)',
        }]
    };

    const volumeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: `${t('transactionVolume')} (€)`,
            data: systemStats?.volumeHistory || [0, 0, 0, 0, 0, 0],
            borderColor: '#0018A8',
            backgroundColor: 'rgba(0, 24, 168, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm(t('deleteConfirm'))) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0018A8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Lade Admin-Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white px-6 py-12 rounded-b-[2.5rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: <Users className="w-6 h-6" />, label: t('totalUsers'), value: systemStats?.totalUsers?.toLocaleString('de-DE') || "0", color: "bg-blue-500" },
                            { icon: <Activity className="w-6 h-6" />, label: t('activeUsers'), value: systemStats?.activeUsers?.toLocaleString('de-DE') || "0", color: "bg-green-500" },
                            { icon: <DollarSign className="w-6 h-6" />, label: t('totalVolume'), value: systemStats ? `€${(systemStats.totalVolume / 1000).toFixed(1)}k` : "0", color: "bg-purple-500" },
                            { icon: <TrendingUp className="w-6 h-6" />, label: t('avgBalance'), value: systemStats ? `€${systemStats.avgBalance.toLocaleString('de-DE', { maximumFractionDigits: 0 })}` : "0", color: "bg-orange-500" },
                        ].map((stat: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                            >
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                                    {stat.icon}
                                </div>
                                <div className="text-sm opacity-80 mb-1">{stat.label}</div>
                                <div className="text-3xl font-bold">{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Analytics Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="font-bold mb-4">{t('userGrowth')}</h3>
                        <div className="h-64">
                            <Bar data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="font-bold mb-4">{t('transactionVolume')}</h3>
                        <div className="h-64">
                            <Line data={volumeData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Content Switcher */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setView('users')}
                                className={`px-6 py-2 rounded-lg font-semibold transition ${view === 'users' ? 'bg-white shadow-sm text-[#0018A8]' : 'text-[#666666]'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {t('users')}
                                </div>
                            </button>
                            <button
                                onClick={() => setView('transactions')}
                                className={`px-6 py-2 rounded-lg font-semibold transition ${view === 'transactions' ? 'bg-white shadow-sm text-[#0018A8]' : 'text-[#666666]'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    {t('transactions')}
                                </div>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold">{view === 'users' ? t('userManagement') : t('transactionVolume')}</h2>
                    </div>

                    {view === 'users' ? (
                        <>
                            {/* Search */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#666666]" />
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        className="w-full bg-[#F4F6F8] border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('name')}</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('email')}</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('balance')}</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('tier')}</th>
                                            <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('status')}</th>
                                            <th className="text-right py-3 px-4 font-semibold text-sm text-[#666666]">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user: any, index: number) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold">{user.name || user.email?.split('@')[0]}</div>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-[#666666]">{user.email}</td>
                                                <td className="py-4 px-4 font-bold text-[#0018A8]">{formatCurrency(user.balance || 0)}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                                        user.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-orange-100 text-orange-800'
                                                        }`}>
                                                        {user.tier || 'Standard'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.status)}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                            }`}
                                                    >
                                                        {user.status === 'active' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                                        {user.status === 'active' ? t('active') : t('suspended')}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowBalanceModal(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-blue-50 text-[#0018A8] rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                                                        >
                                                            {t('adjustBalance')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('date')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('description')}</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">{t('recipient')}</th>
                                        <th className="text-right py-3 px-4 font-semibold text-sm text-[#666666]">{t('amount')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx: any, index: number) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-4 px-4 text-sm text-[#666666]">{formatDate(tx.date)}</td>
                                            <td className="py-4 px-4 font-medium">{tx.description}</td>
                                            <td className="py-4 px-4 text-sm text-[#666666]">{tx.recipient}</td>
                                            <td className={`py-4 px-4 text-right font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-[#E2001A]'}`}>
                                                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Balance Adjustment Modal */}
            {showBalanceModal && selectedUser && (
                <BalanceAdjustmentModal
                    user={{
                        id: selectedUser.id,
                        name: selectedUser.name || selectedUser.email?.split('@')[0],
                        email: selectedUser.email,
                        balance: selectedUser.balance || 0
                    }}
                    token={token!}
                    onClose={() => {
                        setShowBalanceModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={(newBalance: number) => {
                        setUsers(users.map((u: any) => u.id === selectedUser.id ? { ...u, balance: newBalance } : u));
                        setShowBalanceModal(false);
                        setSelectedUser(null);
                        fetchData(); // Refresh stats
                    }}
                />
            )}
        </div>
    );
}
