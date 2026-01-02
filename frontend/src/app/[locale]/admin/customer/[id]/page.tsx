"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaComments, FaPaperPlane, FaWallet, FaMoneyCheckAlt, FaHistory, FaCheck } from "react-icons/fa";

export default function EditCustomer() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const customerId = params.id;

    const [customer, setCustomer] = useState<any>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Form states for manual deposit
    const [depositAccountType, setDepositAccountType] = useState("");
    const [depositAmount, setDepositAmount] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user && token && customerId) {
            // Fetch customer details
            // In a real app, this would be a single API call or multiple parallel calls
            // Mocking data for now based on previous patterns

            // Simulating API fetch
            setTimeout(() => {
                setCustomer({
                    id: customerId,
                    username: "sample_user",
                    email: "user@example.com",
                });
                setAccounts([
                    { type: "Checking", balance: 1250.50 },
                    { type: "Savings", balance: 5000.00 }
                ]);
                setDepositAccountType("Checking");
                setTransactions([
                    { id: 101, timestamp: new Date().toISOString(), type: "deposit", notes: "Initial deposit", amount: 1000, account_type: "Checking", status: "completed" },
                    { id: 102, timestamp: new Date().toISOString(), type: "manual_deposit", notes: "Admin adjustment", amount: 250.50, account_type: "Checking", status: "pending" },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [user, token, authLoading, router, customerId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        // API call to send message
        alert(`Message sent to ${customer.username}: ${message}`);
        setMessage("");
    };

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!depositAmount || parseFloat(depositAmount) <= 0) return;
        // API call to create deposit
        alert(`Created pending deposit of $${depositAmount} for ${depositAccountType}`);
        setDepositAmount("");
        // Optimistic update
        setTransactions([{
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: "manual_deposit",
            notes: "Manual Deposit",
            amount: parseFloat(depositAmount),
            account_type: depositAccountType,
            status: "pending"
        }, ...transactions]);
    };

    const handleApproveTransaction = (txId: number) => {
        // API call to approve
        setTransactions(transactions.map(t => t.id === txId ? { ...t, status: "completed" } : t));
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-[var(--color-primary)] text-lg">Loading Customer Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-12">
            <div className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Manage Customer: {customer.username}</h1>
                        <p className="text-[var(--color-text-secondary)] mt-1">View balances, manage transactions, and communicate with this customer.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin" className="btn-secondary flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors">
                            <FaArrowLeft /> Back to Admin Panel
                        </Link>
                        <Link href={`/admin/chat?customer_id=${customer.id}`} className="btn-accent flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                            <FaComments /> Live Chat
                        </Link>
                    </div>
                </div>

                {/* Admin-to-User Messaging */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                        <FaPaperPlane className="text-[var(--color-primary)]" /> Send Message to User
                    </h2>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label htmlFor="admin_message" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                Your message will appear in the user's notification panel.
                            </label>
                            <textarea
                                id="admin_message"
                                rows={3}
                                className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                placeholder="e.g., Your recent document submission has been reviewed..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Send Message
                        </button>
                    </form>
                </section>

                {/* Grid for Balances and Deposits */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Account Balances */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                            <FaWallet className="text-[var(--color-secondary)]" /> Account Balances
                        </h2>
                        {accounts.length > 0 ? (
                            <ul className="space-y-3">
                                {accounts.map((acc, idx) => (
                                    <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-[var(--color-text-primary)]">{acc.type}</span>
                                        <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">${acc.balance.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[var(--color-text-secondary)] italic">Customer has no accounts.</p>
                        )}
                    </section>

                    {/* Create Manual Deposit */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 mb-4">
                            <FaMoneyCheckAlt className="text-green-600" /> Create Manual Deposit
                        </h2>
                        <form onSubmit={handleDeposit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Account</label>
                                <select
                                    className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    value={depositAccountType}
                                    onChange={(e) => setDepositAccountType(e.target.value)}
                                    required
                                >
                                    {accounts.map((acc, idx) => (
                                        <option key={idx} value={acc.type}>{acc.type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#0018A8]"
                                    placeholder="e.g., 500.00"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Create Pending Deposit
                            </button>
                        </form>
                    </section>
                </div>

                {/* Transaction History */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                            <FaHistory className="text-gray-600" /> Transaction History
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Date</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Type / Notes</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Amount</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Status</th>
                                    <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-[var(--color-text-primary)]">
                                            {new Date(t.timestamp).toLocaleDateString()} {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-[var(--color-text-primary)] capitalize">{t.type.replace('_', ' ')}</div>
                                            <div className="text-xs text-[var(--color-text-secondary)]">{t.notes || 'No notes'}</div>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--color-text-primary)]">
                                            ${t.amount.toFixed(2)} <span className="text-xs text-[var(--color-text-secondary)]">({t.account_type})</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                t.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {t.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleApproveTransaction(t.id)}
                                                    className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                >
                                                    <FaCheck /> Approve
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)]">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}
