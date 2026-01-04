import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, X, PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GoalFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onClose }) => {
    const t = useTranslations('goals');
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        category: 'Savings',
        deadline: '',
        icon: '🎯'
    });

    const icons = ['🎯', '🏠', '🚗', '✈️', '🎓', '💍', '💻', '🏖️', '🏥', '🎁'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-lg w-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-2">
                    <PlusCircle className="text-[#0018A8]" />
                    {t('add_goal')}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('name')}</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                        placeholder="e.g. Dream House"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('target_amount')}</label>
                        <input
                            required
                            type="number"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('current_amount')}</label>
                        <input
                            type="number"
                            value={formData.currentAmount}
                            onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('category')}</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all bg-white"
                        >
                            <option value="savings">{t('categories.savings')}</option>
                            <option value="investment">{t('categories.investment')}</option>
                            <option value="major_purchase">{t('categories.major_purchase')}</option>
                            <option value="emergency_fund">{t('categories.emergency_fund')}</option>
                            <option value="travel">{t('categories.travel')}</option>
                            <option value="education">{t('categories.education')}</option>
                            <option value="housing">{t('categories.housing')}</option>
                            <option value="car">{t('categories.car')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{t('deadline')}</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0018A8] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">Icon</label>
                    <div className="grid grid-cols-5 gap-3">
                        {icons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon })}
                                className={`h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${formData.icon === icon
                                    ? 'bg-[#0018A8] text-white scale-110 shadow-lg'
                                    : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Target className="w-5 h-5" />
                    {t('save_goal')}
                </button>
            </form>
        </motion.div>
    );
};

export default GoalForm;
