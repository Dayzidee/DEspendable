import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Users, Send, Clock } from "lucide-react";

export default function P2PTransfer() {
    const { user, token } = useAuth();
    const t = useTranslations();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        if (!token || searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setSearchResults(data))
                .catch(err => console.error("Search error", err));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, token]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError(t('transfer.select_recipient_error'));
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/transfer/p2p', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipientId: selectedUser.id,
                    amount: amount,
                    message: message
                })
            });
            const data = await res.json();
            if (data.success) {
                router.push("/dashboard");
            } else {
                setError(data.error || "Transfer failed");
            }
        } catch (err) {
            setError("An error occurred during the transfer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/transfer" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">{t('transfer.types.p2p')}</h1>
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
                        {t('transfer.types.sepa')}
                    </Link>
                    <Link
                        href="/transfer/p2p"
                        className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white p-4 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg"
                    >
                        <Users className="w-5 h-5" />
                        {t('transfer.types.p2p')}
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
                            placeholder={t('transfer.p2p_search_placeholder')}
                            className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Search Results */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#666666] uppercase tracking-wider mb-3">
                        {searchQuery.length >= 3 ? t('transfer.search_results') : t('transfer.recent_contacts')}
                    </h3>
                    <div className="space-y-2">
                        {(searchQuery.length >= 3 ? searchResults : []).map(contact => (
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
                        {searchQuery.length >= 3 && searchResults.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                                {t('transfer.no_users_found')}
                            </div>
                        )}
                        {searchQuery.length < 3 && (
                            <div className="text-center py-4 text-gray-400 italic">
                                {t('transfer.search_hint')}
                            </div>
                        )}
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
                            <div className="text-sm text-[#666666] mb-1">{t('transfer.send_to')}</div>
                            <div className="text-lg font-bold text-[#1C1C1C]">{selectedUser.name}</div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                                {t('transfer.amount')}
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
                                    placeholder="0,00"
                                />
                                <span className="absolute right-4 top-4 text-[#666666] font-semibold text-xl">€</span>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                                {t('transfer.message_label')}
                            </label>
                            <input
                                type="text"
                                maxLength={100}
                                className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder={t('transfer.message_placeholder')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                t('transfer.sending')
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {t('transfer.send_money')}
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
                            <div className="font-semibold text-[#0018A8] mb-1">{t('transfer.instant_transfer_title')}</div>
                            <div className="text-sm text-[#666666]">
                                {t('transfer.instant_transfer_desc')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
