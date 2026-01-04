"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SCAModal from "@/components/SCAModal";
import Link from 'next/link';
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Users, Send } from "lucide-react";

export const dynamic = "force-dynamic";

function TransferContent() {
    const { user, token } = useAuth();
    const t = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [fromAccount, setFromAccount] = useState("");
    const [iban, setIban] = useState(searchParams.get("iban") || "");
    const [amount, setAmount] = useState(searchParams.get("amount") || "");
    const [reference, setReference] = useState(searchParams.get("reference") || "");
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scaRequired, setScaRequired] = useState(false);
    const [mockTan, setMockTan] = useState("");
    const [pendingTxId, setPendingTxId] = useState("");
    const [currentTanId, setCurrentTanId] = useState("");

    useEffect(() => {
        if (user && token) {
            fetch(`/api/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.accounts) setAccounts(data.accounts);
                    if (data.accounts?.[0]) setFromAccount(data.accounts[0].id);
                });
        }
    }, [user, token]);

    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Updated to new API route standard
            // The route is now /api/transfer with action='initiate'
            const res = await fetch(`/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'initiate',
                    data: {
                        from_account_id: fromAccount,
                        amount: parseFloat(amount),
                        reference: reference,
                        type: 'external',
                        recipient_info: {
                            recipient_account_number: iban
                        }
                    }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // New API returns { transactionId, tanId, challengeData: { mock_tan: ... } }
            if (data.transactionId && data.challengeData) {
                setPendingTxId(data.transactionId);
                // The API now returns tanId needed for verification
                // We'll store it in a way we can access (e.g., hidden state or passed to modal)
                // For this component, we might need state for tanId
                // Let's add it via setState below this block if possible, or hack it into pendingTxId

                // Hack: We need to store tanId too.
                // Assuming handleConfirmSCA takes only the input, we need to pass tanId there.
                // I'll update the component state to hold tanId.
                setPendingTxId(data.transactionId);
                setMockTan(data.challengeData.mock_tan);
                setCurrentTanId(data.tanId); // Ensure this is set
                setScaRequired(true);
            }
        } catch (err: any) {
            setError("Die Überweisung konnte nicht initiiert werden. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.");
            console.error("[Transfer Initiate Error]", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSCA = async (tanValue: string) => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'execute',
                    data: {
                        transactionId: pendingTxId,
                        tanInput: tanValue,
                        tanId: currentTanId
                    }
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            router.push("/dashboard");
        } catch (err: any) {
            setError("Die TAN-Bestätigung ist fehlgeschlagen. Bitte überprüfen Sie die eingegebene TAN.");
            console.error("[Transfer Confirm Error]", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pb-24">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5 text-[#0018A8]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">{t("transfer.title")}</h1>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-6 py-8">
                {/* Transfer Type Tabs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link
                        href="/transfer"
                        className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white p-4 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                        SEPA-Überweisung
                    </Link>
                    <Link
                        href="/transfer/p2p"
                        className="bg-white text-[#0018A8] border-2 border-gray-200 p-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:border-[#0018A8] transition"
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

                <form onSubmit={handleInitiate} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6">
                    {/* From Account */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            Von Konto
                        </label>
                        <select
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={fromAccount}
                            onChange={e => setFromAccount(e.target.value)}
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.type} - {parseFloat(acc.balance).toFixed(2)}€
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* IBAN */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t("transfer.iban")}
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition font-mono"
                            value={iban}
                            onChange={e => setIban(e.target.value)}
                            placeholder="DE89 3705 0000 1234 5678 90"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t("transfer.amount")}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0.01"
                                className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg pl-4 pr-12 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                            <span className="absolute right-4 top-3 text-[#666666] font-semibold">€</span>
                        </div>
                    </div>

                    {/* Reference */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t("transfer.reference")} <span className="text-[#E2001A]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={140}
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={reference}
                            onChange={e => setReference(e.target.value)}
                            placeholder={t("transfer.reference_placeholder")}
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold py-4 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Wird verarbeitet..." : t("transfer.submit")}
                        </button>

                        <Link
                            href="/transfer/scan"
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#0018A8] text-[#0018A8] font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                        >
                            <Camera className="w-5 h-5" />
                            Foto-Überweisung
                        </Link>
                    </div>
                </form>

                <SCAModal
                    isOpen={scaRequired}
                    onConfirm={handleConfirmSCA}
                    onCancel={() => setScaRequired(false)}
                    mockTan={mockTan}
                />
            </div>
        </div>
    );
}

export default function Transfer() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
                <div className="text-[#0018A8] text-lg">Loading...</div>
            </div>
        }>
            <TransferContent />
        </Suspense>
    );
}
