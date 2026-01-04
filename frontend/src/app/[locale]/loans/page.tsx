"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FaHandHoldingUsd, FaPercent, FaCalendarAlt, FaHistory } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function LoansPage() {
    const { token } = useAuth();
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [formData, setFormData] = useState({ amount: "5000", term: "24", purpose: "Personal" });

    useEffect(() => {
        if (!token) return;
        fetchLoans();
    }, [token]);

    const fetchLoans = () => {
        setLoading(true);
        fetch('/api/loans', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setLoans(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplyLoading(true);
        try {
            const res = await fetch('/api/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.id) {
                setShowApplyModal(false);
                fetchLoans();
            }
        } catch (err) {
            console.error("Loan application error", err);
        } finally {
            setApplyLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1C1C1C]">Loans & Credit</h1>
                    <p className="text-[#666666]">Manage your active loans and explore personalized credit offers.</p>
                </header>

                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
                        <div className="animate-spin w-8 h-8 border-4 border-[#0018A8] border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading loans...
                    </div>
                ) : loans.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center py-20">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0018A8] text-3xl">
                            <FaHandHoldingUsd />
                        </div>
                        <h2 className="text-xl font-bold mb-2">You don't have any active loans</h2>
                        <p className="text-[#666666] max-w-md mx-auto mb-8">
                            Need extra funds? Apply for a personal loan with competitive interest rates today.
                        </p>
                        <button
                            onClick={() => setShowApplyModal(true)}
                            className="bg-[#0018A8] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition shadow-md"
                        >
                            Apply for a Loan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {loans.map((loan) => (
                            <div key={loan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0018A8] text-xl">
                                            <FaHandHoldingUsd />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#1C1C1C]">{loan.purpose} Loan</h3>
                                            <p className="text-xs text-[#666666]">Applied on {formatDate(loan.created_at)}</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        Active
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-xs text-[#666666] mb-1">Total Loan Amount</p>
                                        <p className="text-xl font-bold text-[#1C1C1C]">{formatCurrency(loan.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#666666] mb-1">Monthly Payment</p>
                                        <p className="text-xl font-bold text-[#0018A8]">{formatCurrency(loan.monthly_payment)}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                                        <FaCalendarAlt />
                                        <span>{loan.term} months left</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                                        <FaPercent />
                                        <span>{loan.interest_rate}% APR</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setShowApplyModal(true)}
                            className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-[#0018A8] hover:bg-blue-50/30 transition text-[#666666] hover:text-[#0018A8]"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl">
                                +
                            </div>
                            <span className="font-bold">Apply for Another Loan</span>
                        </button>
                    </div>
                )}

                <div className="mt-12">
                    <h3 className="text-lg font-bold mb-6 text-[#1C1C1C]">Available Offers</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaPercent className="text-yellow-400" />
                                    <span className="font-semibold text-gray-400">Personal Loan</span>
                                </div>
                                <h4 className="text-3xl font-bold mb-2 text-white">Low APR from 3.5%</h4>
                                <p className="text-gray-400 mb-6">Borrow up to €50.000 with flexible terms.</p>
                                <button className="text-white border border-white/30 px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#0018A8] to-[#0025D9] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaHistory className="text-blue-300" />
                                    <span className="font-semibold text-blue-100">Overdraft</span>
                                </div>
                                <h4 className="text-3xl font-bold mb-2 text-white">Instant Safety Net</h4>
                                <p className="text-blue-100 mb-6">Get a flexible overdraft limit up to €2.500.</p>
                                <button className="bg-white text-[#0018A8] px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                                    Activate Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowApplyModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-md p-8 relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Apply for a Loan</h2>
                            <form onSubmit={handleApply} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Loan Amount (€)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0018A8] outline-none"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Term (Months)</label>
                                    <select
                                        className="w-full bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0018A8] outline-none"
                                        value={formData.term}
                                        onChange={e => setFormData({ ...formData, term: e.target.value })}
                                    >
                                        <option value="12">12 Months</option>
                                        <option value="24">24 Months</option>
                                        <option value="36">36 Months</option>
                                        <option value="48">48 Months</option>
                                        <option value="60">60 Months</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Purpose</label>
                                    <select
                                        className="w-full bg-[#F4F6F8] border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0018A8] outline-none"
                                        value={formData.purpose}
                                        onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Vehicle">Vehicle</option>
                                        <option value="Home Improvement">Home Improvement</option>
                                        <option value="Business">Business</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowApplyModal(false)}
                                        className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-[#666666] hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={applyLoading}
                                        type="submit"
                                        className="flex-1 bg-[#0018A8] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center"
                                    >
                                        {applyLoading ? "Processing..." : "Confirm"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
