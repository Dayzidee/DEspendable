"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FaChartLine, FaArrowUp, FaBriefcase } from "react-icons/fa";

export default function InvestmentsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Investments</h1>
                    <p className="text-gray-500">Track your portfolio performance.</p>
                </header>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="block text-purple-100 mb-1">Total Portfolio Value</span>
                            <h2 className="text-4xl font-bold">$12,450.00</h2>
                            <div className="flex items-center gap-2 mt-2 text-green-300 bg-green-500/20 px-3 py-1 rounded-full w-fit">
                                <FaArrowUp /> +5.2% (Past Month)
                            </div>
                        </div>
                        <button className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg">
                            Invest More
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock Investment Items */}
                    {[
                        { name: "S&P 500 ETF", value: 5200.50, change: "+1.2%", color: "bg-blue-100 text-blue-600" },
                        { name: "Tech Growth Fund", value: 3400.20, change: "+3.5%", color: "bg-green-100 text-green-600" },
                        { name: "Global Bonds", value: 3849.30, change: "+0.4%", color: "bg-orange-100 text-orange-600" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.color}`}>
                                    <FaBriefcase />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--color-text-primary)]">{item.name}</h3>
                                    <span className="text-xs text-gray-500">Equity</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xl font-bold">${item.value.toLocaleString()}</span>
                                <span className="text-green-600 font-medium text-sm">{item.change}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
