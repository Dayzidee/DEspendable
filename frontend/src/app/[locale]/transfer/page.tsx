"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { FaExchangeAlt, FaSitemap, FaRetweet, FaUserFriends, FaArrowAltCircleUp, FaArrowAltCircleDown, FaStickyNote, FaPaperPlane, FaTimes, FaCheckDouble } from "react-icons/fa";

function TransferContent() {
    const { user, token, loading: authLoading } = useAuth();
    const t = useTranslations('transfer');
    const router = useRouter();

    const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [recipientInfo, setRecipientInfo] = useState<{name: string, status: 'success' | 'error' | null}>({ name: '', status: null });
    const [error, setError] = useState("");
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [transferData, setTransferData] = useState<any>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const fromAccount = watch('from_account');
    const recipientAccountNumber = watch('recipient_account_number');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && token) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.accounts) {
                        setAccounts(data.accounts);
                        if (data.accounts.length > 0) {
                            setValue('from_account', data.accounts[0].id);
                        }
                    }
                })
                .catch(console.error);
        }
    }, [user, token, setValue]);

    const handleVerifyRecipient = async () => {
        if (!recipientAccountNumber) return;
        setVerifyLoading(true);
        setRecipientInfo({ name: '', status: null });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/transfer/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ account_number: recipientAccountNumber })
            });
            const data = await res.json();

            if (res.ok) {
                setRecipientInfo({ name: data.recipient_name, status: 'success' });
            } else {
                setRecipientInfo({ name: data.error || 'Verification failed', status: 'error' });
            }
        } catch (error) {
            setRecipientInfo({ name: 'Error connecting to server', status: 'error' });
        } finally {
            setVerifyLoading(false);
        }
    };

    const onSubmit = (data: any) => {
        setTransferData(data);
        setConfirmationStep(true);
    };

    const handleConfirmTransfer = async () => {
        setLoading(true);
        setError("");

        try {
            const payload = {
                from_account_id: transferData.from_account,
                amount: parseFloat(transferData.amount),
                memo: transferData.memo,
                type: transferType,
                ...(transferType === 'internal'
                    ? { to_account_id: transferData.to_account_internal }
                    : { recipient_account_number: transferData.recipient_account_number }
                )
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/transfer/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Transfer failed");
            setConfirmationStep(false);
        } finally {
            setLoading(false);
        }
    };

    const getAccountName = (id: string) => {
        const acc = accounts.find(a => a.id.toString() === id.toString());
        return acc ? `${acc.type} (...${acc.id.slice(-4)})` : id;
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <div className="text-[var(--color-primary)] text-lg">Loading...</div>
            </div>
        );
    }

    if (confirmationStep) {
        return (
            <main className="section min-h-screen bg-[#F4F6F8] p-4 flex items-center justify-center">
                <div className="container" style={{ maxWidth: '550px' }}>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 animate-fade-in-up">
                        <header className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl mb-4">
                                <FaCheckDouble />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1C1C1C]">Confirm Your Transfer</h2>
                            <p className="text-[#666666] mt-1">Please review the details below. This action cannot be undone.</p>
                        </header>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-[#666666]">From Account</span>
                                <strong className="text-[#1C1C1C] flex items-center gap-2">
                                    <FaArrowAltCircleUp className="text-[var(--color-primary)]" />
                                    {getAccountName(transferData.from_account)}
                                </strong>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-[#666666]">To Recipient</span>
                                <strong className="text-[#1C1C1C] flex items-center gap-2 text-right">
                                    <FaArrowAltCircleDown className="text-green-500" />
                                    {transferType === 'internal'
                                        ? getAccountName(transferData.to_account_internal)
                                        : `${recipientInfo.name || transferData.recipient_account_number} (...${transferData.recipient_account_number?.slice(-4) || ''})`
                                    }
                                </strong>
                            </div>
                            {transferData.memo && (
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <span className="text-[#666666]">Memo</span>
                                    <strong className="text-[#1C1C1C] flex items-center gap-2">
                                        <FaStickyNote className="text-yellow-500" />
                                        {transferData.memo}
                                    </strong>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-4 text-lg">
                                <span className="text-[#1C1C1C] font-bold">Amount to Transfer</span>
                                <strong className="text-[var(--color-primary)] font-bold text-2xl">
                                    ${parseFloat(transferData.amount).toFixed(2)}
                                </strong>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 mb-6 text-sm bg-red-50 text-[#E2001A] border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleConfirmTransfer}
                                disabled={loading}
                                className="w-full bg-[var(--color-secondary)] hover:bg-[#c50017] text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Processing...' : <><FaPaperPlane /> Confirm & Send Funds</>}
                            </button>
                            <button
                                onClick={() => setConfirmationStep(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-[#1C1C1C] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <FaTimes /> Cancel Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="section min-h-screen bg-[#F4F6F8] p-4 flex items-center justify-center">
            <div className="container" style={{ maxWidth: '550px' }}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 animate-fade-in-up">

                    <header className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl mb-4">
                            <FaExchangeAlt />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1C1C1C]">Transfer Funds</h2>
                        <p className="text-[#666666] mt-1">Move money between your accounts or to another user.</p>
                    </header>

                    {accounts.length > 0 ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Transfer Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#1C1C1C]">
                                    <FaSitemap /> Transfer Type
                                </label>
                                <div className="flex bg-[#F4F6F8] p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setTransferType('internal')}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${transferType === 'internal' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-[#666666] hover:text-[#1C1C1C]'}`}
                                    >
                                        <FaRetweet /> Internal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTransferType('external')}
                                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${transferType === 'external' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-[#666666] hover:text-[#1C1C1C]'}`}
                                    >
                                        <FaUserFriends /> External
                                    </button>
                                </div>
                            </div>

                            {/* From Account */}
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-[#1C1C1C]">From Account</label>
                                <select
                                    {...register("from_account", { required: true })}
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.type === 'Checking' ? 'Checking' : acc.type === 'Savings' ? 'Savings' : acc.type} (...{acc.id.slice(-4)}) - ${parseFloat(acc.balance).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Internal Transfer Fields */}
                            {transferType === 'internal' && (
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-[#1C1C1C]">To Account</label>
                                    <select
                                        {...register("to_account_internal", { required: transferType === 'internal' })}
                                        className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                    >
                                        {accounts.filter(acc => acc.id.toString() !== fromAccount?.toString()).map(acc => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.type === 'Checking' ? 'Checking' : acc.type === 'Savings' ? 'Savings' : acc.type} (...{acc.id.slice(-4)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* External Transfer Fields */}
                            {transferType === 'external' && (
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-[#1C1C1C]">Recipient Account Number</label>
                                    <div className="flex gap-2">
                                        <input
                                            {...register("recipient_account_number", { required: transferType === 'external' })}
                                            type="text"
                                            className="flex-1 bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                            placeholder="10-digit account number"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyRecipient}
                                            disabled={verifyLoading}
                                            className="bg-gray-200 hover:bg-gray-300 text-[#1C1C1C] font-medium px-4 py-2 rounded-lg transition-colors"
                                        >
                                            {verifyLoading ? '...' : 'Verify'}
                                        </button>
                                    </div>
                                    {recipientInfo.status && (
                                        <div className={`text-sm mt-1 ${recipientInfo.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {recipientInfo.status === 'success' ? `✓ Recipient: ${recipientInfo.name}` : `✗ ${recipientInfo.name}`}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Amount */}
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-[#1C1C1C]">Amount</label>
                                <input
                                    {...register("amount", { required: true, min: 0.01 })}
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                    placeholder="0.00"
                                />
                                {errors.amount && <span className="text-xs text-[#E2001A]">Amount is required</span>}
                            </div>

                            {/* Memo */}
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-[#1C1C1C]">Memo</label>
                                <input
                                    {...register("memo")}
                                    type="text"
                                    className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                    placeholder="(Optional) e.g., For monthly savings"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 rounded-lg transition-all shadow-md mt-6"
                            >
                                Continue to Confirmation
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                            You need at least one account to make a transfer. Please contact support.
                        </div>
                    )}
                </div>
            </div>
        </main>
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
