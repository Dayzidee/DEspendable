"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, Search, Edit, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";

export default function AdminPanel() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Mock admin check - in production, verify admin role from backend
    const isAdmin = user?.email?.includes("admin") || true; // Allow for demo

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // Fetch users (mock data for now)
        const mockUsers = [
            { id: "1", name: "Max Mustermann", email: "max@example.com", balance: 2500.00, tier: "Silver", status: "active", joined: "2025-01-15" },
            { id: "2", name: "Anna Schmidt", email: "anna@example.com", balance: 5200.00, tier: "Gold", status: "active", joined: "2024-11-20" },
            { id: "3", name: "Lisa Weber", email: "lisa@example.com", balance: 1200.00, tier: "Bronze", status: "active", joined: "2025-12-10" },
            { id: "4", name: "Tom Müller", email: "tom@example.com", balance: 850.00, tier: "Bronze", status: "suspended", joined: "2025-10-05" },
        ];
        setUsers(mockUsers);
    }, [user, router]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Mock analytics data
    const stats = {
        totalUsers: 50234,
        activeUsers: 48120,
        totalVolume: 2450000,
        avgBalance: 2850,
    };

    const userGrowthData = {
        labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Neue Nutzer',
            data: [1200, 1900, 2300, 2100, 2800, 3200],
            backgroundColor: 'rgba(0, 24, 168, 0.8)',
        }]
    };

    const volumeData = {
        labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Transaktionsvolumen (€)',
            data: [320000, 380000, 420000, 390000, 450000, 480000],
            borderColor: '#0018A8',
            backgroundColor: 'rgba(0, 24, 168, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm("Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?")) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const handleSaveUser = () => {
        setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
        setShowEditModal(false);
        setSelectedUser(null);
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white px-6 py-12 rounded-b-[2.5rem]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: <Users className="w-6 h-6" />, label: "Gesamt Nutzer", value: stats.totalUsers.toLocaleString(), color: "bg-blue-500" },
                            { icon: <Activity className="w-6 h-6" />, label: "Aktive Nutzer", value: stats.activeUsers.toLocaleString(), color: "bg-green-500" },
                            { icon: <DollarSign className="w-6 h-6" />, label: "Gesamtvolumen", value: `€${(stats.totalVolume / 1000000).toFixed(1)}M`, color: "bg-purple-500" },
                            { icon: <TrendingUp className="w-6 h-6" />, label: "Ø Guthaben", value: `€${stats.avgBalance.toLocaleString()}`, color: "bg-orange-500" },
                        ].map((stat, index) => (
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
                        <h3 className="font-bold mb-4">Nutzerwachstum</h3>
                        <div className="h-64">
                            <Bar data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="font-bold mb-4">Transaktionsvolumen</h3>
                        <div className="h-64">
                            <Line data={volumeData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Benutzerverwaltung</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white rounded-lg hover:shadow-lg transition">
                            <Plus className="w-5 h-5" />
                            Neuer Benutzer
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#666666]" />
                            <input
                                type="text"
                                placeholder="Suche nach Name oder E-Mail..."
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
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">E-Mail</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">Guthaben</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">Tier</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-[#666666]">Beigetreten</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm text-[#666666]">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="font-semibold">{user.name}</div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-[#666666]">{user.email}</td>
                                        <td className="py-4 px-4 font-bold text-[#0018A8]">€{user.balance.toLocaleString()}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                                                    user.tier === 'Silver' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-orange-100 text-orange-800'
                                                }`}>
                                                {user.tier}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.status === 'active' ? 'Aktiv' : 'Gesperrt'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-[#666666]">{user.joined}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition text-[#0018A8]"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition text-[#E2001A]"
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
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full"
                    >
                        <h3 className="text-2xl font-bold mb-6">Benutzer bearbeiten</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    value={selectedUser.name}
                                    onChange={e => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">E-Mail</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    value={selectedUser.email}
                                    onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Guthaben (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    value={selectedUser.balance}
                                    onChange={e => setSelectedUser({ ...selectedUser, balance: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Status</label>
                                <select
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    value={selectedUser.status}
                                    onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                >
                                    <option value="active">Aktiv</option>
                                    <option value="suspended">Gesperrt</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSaveUser}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white rounded-lg font-semibold hover:shadow-lg transition"
                            >
                                Speichern
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
