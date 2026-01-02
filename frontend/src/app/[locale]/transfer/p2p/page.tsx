"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowLeft, Search, Users, Send, Clock } from "lucide-react";

export default function P2PTransfer() {
    const { user, token } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Mock recent contacts
    const recentContacts = [
        { id: "1", name: "Anna Schmidt", email: "anna.schmidt@example.com", avatar: "AS" },
        { id: "2", name: "Max Müller", email: "max.mueller@example.com", avatar: "MM" },
        { id: "3", name: "Lisa Weber", email: "lisa.weber@example.com", avatar: "LW" },
    ];

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError("Bitte wählen Sie einen Empfänger aus.");
            return;
        }

        setLoading(true);
        setError("");

        // TODO: Implement P2P transfer API call
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/transfer" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">P2P Transfer</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-8">
                {/* Transfer Type Tabs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link
                        href="/transfer"
                        className="bg-white text-[#0018A8] border-2 border-gray-200 p-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:border-[#0018A8] transition"
                    >
                        <Send className="w-5 h-5" />
                        SEPA-Überweisung
                    </Link>
                    <Link
                        href="/transfer/p2p"
                        className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white p-4 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg"
                    >
                        <Users className="w-5 h-5" />
                        P2P Transfer
                    </Link>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 mb-6 bg-red-50 border border-red-200 text-[#E2001A] rounded-xl text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#666666]" />
                        <input
                            type="text"
                            placeholder="Suche nach Name oder E-Mail..."
                            className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Recent Contacts */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#666666] uppercase tracking-wider mb-3">
                        Kürzliche Kontakte
                    </h3>
                    <div className="space-y-2">
                        {recentContacts.map(contact => (
                            <motion.div
                                key={contact.id}
                                whileHover={{ x: 4 }}
                                onClick={() => setSelectedUser(contact)}
                                className={`bg-white p-4 rounded-xl border-2 cursor-pointer transition ${selectedUser?.id === contact.id
                                        ? 'border-[#0018A8] bg-blue-50'
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white font-bold">
                                        {contact.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#1C1C1C]">{contact.name}</div>
                                        <div className="text-sm text-[#666666]">{contact.email}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Transfer Form */}
                {selectedUser && (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSend}
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6"
                    >
                        <div className="text-center pb-4 border-b border-gray-100">
                            <div className="text-sm text-[#666666] mb-1">Senden an</div>
                            <div className="text-lg font-bold text-[#1C1C1C]">{selectedUser.name}</div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                                Betrag
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg pl-4 pr-12 py-4 text-2xl font-bold text-[#0018A8] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition text-center"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                                <span className="absolute right-4 top-4 text-[#666666] font-semibold text-xl">€</span>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                                Nachricht (optional)
                            </label>
                            <input
                                type="text"
                                maxLength={100}
                                className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="z.B. Mittagessen, Miete..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                "Wird gesendet..."
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Jetzt senden
                                </>
                            )}
                        </button>
                    </motion.form>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#0018A8] mt-0.5" />
                        <div>
                            <div className="font-semibold text-[#0018A8] mb-1">Sofortige Überweisung</div>
                            <div className="text-sm text-[#666666]">
                                P2P-Transfers werden in Echtzeit verarbeitet. Der Empfänger erhält das Geld sofort.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
