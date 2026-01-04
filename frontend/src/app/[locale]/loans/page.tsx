"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FaHandHoldingUsd, FaPercent } from "react-icons/fa";

export default function LoansPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Loans</h1>
                    <p className="text-gray-500">Manage your loans and credit lines.</p>
                </header>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center py-20">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0018A8] text-3xl">
                        <FaHandHoldingUsd />
                    </div>
                    <h2 className="text-xl font-bold mb-2">You don&apos;t have any active loans</h2>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Need extra funds? Apply for a personal loan with competitive interest rates today.
                    </p>
                    <button className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg">
                        Apply for a Loan
                    </button>
                </div>

                <div className="mt-12">
                    <h3 className="text-lg font-bold mb-6">Available Offers</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaPercent className="text-yellow-400" />
                                    <span className="font-semibold text-gray-300">Personal Loan</span>
                                </div>
                                <h4 className="text-2xl font-bold mb-1">Low APR from 3.5%</h4>
                                <p className="text-gray-400 text-sm mb-6">Borrow up to $50,000 for 12-60 months.</p>
                                <button className="text-white border border-white/30 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#0018A8] to-[#0025D9] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaHandHoldingUsd className="text-blue-300" />
                                    <span className="font-semibold text-blue-100">Overdraft</span>
                                </div>
                                <h4 className="text-2xl font-bold mb-1">Instant Overdraft</h4>
                                <p className="text-blue-100 text-sm mb-6">Get a safety net of up to $2,000 instantly.</p>
                                <button className="bg-white text-[#0018A8] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition">
                                    Activate Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
