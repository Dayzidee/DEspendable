import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trash2, Calendar, Trophy, Plus, Check, X as XIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useTranslations } from 'next-intl';

interface GoalCardProps {
    goal: {
        id: string;
        name: string;
        targetAmount: number;
        currentAmount: number;
        icon: string;
        deadline: string | null;
        category: string;
    };
    onDelete: (id: string) => void;
    onFund: (id: string, amount: number) => Promise<void>;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onDelete, onFund }) => {
    const t = useTranslations('goals');
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isCompleted = progress === 100;
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

    const [isFunding, setIsFunding] = React.useState(false);
    const [fundAmount, setFundAmount] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleFund = async () => {
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) return;

        setLoading(true);
        try {
            await onFund(goal.id, amount);
            setIsFunding(false);
            setFundAmount("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
        >
            {isCompleted && (
                <div className="absolute top-0 right-0 p-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
            )}

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-2xl flex items-center justify-center">
                    {goal.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-[#1C1C1C] text-lg">{goal.name}</h3>
                    <p className="text-sm text-[#666666]">{t(`categories.${goal.category.toLowerCase()}`) || goal.category}</p>
                </div>
                <button
                    onClick={() => onDelete(goal.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-[#999999] uppercase font-semibold mb-1">{t('progress')}</p>
                        <p className="text-2xl font-bold text-[#0018A8]">
                            {formatCurrency(goal.currentAmount)}
                            <span className="text-sm text-[#666666] font-normal ml-1">
                                / {formatCurrency(goal.targetAmount)}
                            </span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-[#1C1C1C]">{Math.round(progress)}%</p>
                    </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-[#0018A8] to-[#0025D9]'}`}
                    />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-[#666666]">
                        <Calendar className="w-4 h-4" />
                        <span>{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : t('no_deadline')}</span>
                    </div>
                    <p className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-[#666666]'}`}>
                        {isCompleted ? t('completed') : `${t('remaining')}: ${formatCurrency(remaining)}`}
                    </p>
                </div>

                {!isCompleted && (
                    <div className="pt-2">
                        {isFunding ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex gap-2"
                            >
                                <input
                                    type="number"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    placeholder="Amount"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#0018A8] outline-none text-sm"
                                    autoFocus
                                />
                                <button
                                    onClick={handleFund}
                                    disabled={loading || !fundAmount}
                                    className="p-2 bg-[#0018A8] text-white rounded-lg disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsFunding(false)}
                                    className="p-2 bg-gray-100 text-gray-400 rounded-lg"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <button
                                onClick={() => setIsFunding(true)}
                                className="w-full py-2 bg-blue-50 text-[#0018A8] font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                {t('add_funds') || "Add Funds"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default GoalCard;
