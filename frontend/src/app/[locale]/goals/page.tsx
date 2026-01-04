"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";

export default function GoalsPage() {
    const { token, user } = useAuth();
    const t = useTranslations('goals');
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (token) {
            fetchGoals();
        }
    }, [token]);

    const fetchGoals = async () => {
        try {
            const res = await fetch('/api/goals', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!data.error) {
                setGoals(data);
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async (goalData: any) => {
        try {
            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(goalData)
            });
            const newGoal = await res.json();
            if (!newGoal.error) {
                setGoals([newGoal, ...goals]);
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            const res = await fetch(`/api/goals?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setGoals(goals.filter(g => g.id !== id));
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };
    const handleFundGoal = async (id: string, amount: number) => {
        try {
            const res = await fetch('/api/goals', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, amount })
            });
            const updatedGoal = await res.json();
            if (!updatedGoal.error) {
                setGoals(goals.map(g => g.id === id ? updatedGoal : g));
            }
        } catch (error) {
            console.error('Error funding goal:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto pb-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-sm text-[#666666] hover:text-[#0018A8] mb-4 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            {t('common.back')}
                        </Link>
                        <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">{t('title')}</h1>
                        <p className="text-[#666666]">{t('subtitle')}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        {t('add_goal')}
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0018A8]"></div>
                    </div>
                ) : (
                    <>
                        {goals.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                                <Target className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-[#666666] text-lg">{t('no_goals')}</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {goals.map((goal) => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            onDelete={handleDeleteGoal}
                                            onFund={handleFundGoal}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal for adding/editing goals */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <GoalForm
                            onSubmit={handleAddGoal}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
