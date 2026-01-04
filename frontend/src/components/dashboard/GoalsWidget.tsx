"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaChevronRight } from 'react-icons/fa';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/lib/formatters';

interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    icon: string;
}

interface GoalsWidgetProps {
    goals: Goal[];
}

export default function GoalsWidget({ goals }: GoalsWidgetProps) {
    const t = useTranslations('goals');

    // Only show top 2 goals in the widget
    const displayGoals = goals.slice(0, 2);

    return (
        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1C1C1C]">{t('title')}</h2>
                <Link href="/goals" className="text-sm font-medium text-[#0018A8] hover:underline flex items-center gap-1">
                    {t('add_goal')}
                    <FaChevronRight className="w-3 h-3" />
                </Link>
            </header>

            {goals.length > 0 ? (
                <div className="space-y-4">
                    {displayGoals.map((goal) => {
                        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{goal.icon}</span>
                                        <span className="font-medium text-[#1C1C1C] text-sm">{goal.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#0018A8]">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="bg-[#0018A8] h-full rounded-full"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-[#666666]">
                                    <span>{formatCurrency(goal.currentAmount)}</span>
                                    <span>{formatCurrency(goal.targetAmount)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-4 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-300">
                        <FaBullseye />
                    </div>
                    <p className="text-sm text-[#666666]">{t('no_goals')}</p>
                </div>
            )}
        </section>
    );
}
