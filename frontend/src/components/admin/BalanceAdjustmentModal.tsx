import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BalanceAdjustmentModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        balance: number;
    };
    onClose: () => void;
    onSuccess: (newBalance: number) => void;
    token: string;
}

const BalanceAdjustmentModal: React.FC<BalanceAdjustmentModalProps> = ({ user, onClose, onSuccess, token }) => {
    const t = useTranslations('admin');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'credit' | 'debit'>('credit');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    amount: parseFloat(amount),
                    type,
                    description
                })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            onSuccess(data.newBalance);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-[#1C1C1C]">{t('adjustBalance')}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-sm text-[#666666] mb-1">{user.name}</p>
                    <p className="font-bold text-[#0018A8]">{user.email}</p>
                    <p className="text-xs text-[#666666] mt-2 uppercase tracking-wider font-semibold">Current Balance</p>
                    <p className="text-xl font-bold text-[#1C1C1C]">€{user.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setType('credit')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${type === 'credit'
                                    ? 'border-[#0018A8] bg-blue-50 text-[#0018A8]'
                                    : 'border-gray-200 text-[#666666] grayscale opacity-60'
                                }`}
                        >
                            <ArrowUpCircle className="w-5 h-5" />
                            <span className="font-bold">{t('credit')}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('debit')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${type === 'debit'
                                    ? 'border-[#E2001A] bg-red-50 text-[#E2001A]'
                                    : 'border-gray-200 text-[#666666] grayscale opacity-60'
                                }`}
                        >
                            <ArrowDownCircle className="w-5 h-5" />
                            <span className="font-bold">{t('debit')}</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('amount')} (€)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('description')}</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all resize-none h-24"
                            placeholder="Reason for adjustment..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-[#E2001A] text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 font-bold text-[#666666] hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className={`flex-1 py-4 font-bold text-white rounded-xl shadow-lg transition-all ${loading || !amount
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : type === 'credit'
                                        ? 'bg-gradient-to-r from-[#0018A8] to-[#0025D9]'
                                        : 'bg-gradient-to-r from-[#E2001A] to-[#C00016]'
                                }`}
                        >
                            {loading ? 'Processing...' : t('save')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default BalanceAdjustmentModal;
