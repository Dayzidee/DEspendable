"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Send, User, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function QuickTransfer() {
    const t = useTranslations('dashboard');
    const tTransfer = useTranslations('transfer');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');

    // Mock recent contacts for the quick transfer widget
    const recentContacts = [
        { id: 1, name: 'Alex M.', avatar: 'AM', color: 'bg-blue-100 text-blue-600' },
        { id: 2, name: 'Sarah K.', avatar: 'SK', color: 'bg-green-100 text-green-600' },
        { id: 3, name: 'Mike R.', avatar: 'MR', color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <section className="bg-white rounded-xl shadow-sm p-6 card-hover border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1C1C1C]">{t('quickActions')}</h2>
                <Link href="/transfer" className="text-sm font-semibold text-[#0018A8] hover:underline flex items-center gap-1">
                    {t('viewAll')} <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="space-y-6">
                {/* Quick Send Options */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/transfer" className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group cursor-pointer border border-blue-100">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                            <Send className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{tTransfer('sendNow')}</span>
                    </Link>
                    <Link href="/transfer/p2p" className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group cursor-pointer border border-purple-100">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{tTransfer('p2pTransfer')}</span>
                    </Link>
                </div>

                {/* Recent Contacts Quick List */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{tTransfer('recentContacts')}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {recentContacts.map((contact) => (
                            <motion.button
                                key={contact.id}
                                whileHover={{ y: -2 }}
                                className="flex flex-col items-center space-y-1 min-w-[60px]"
                            >
                                <div className={`w-12 h-12 rounded-full ${contact.color} flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white ring-1 ring-gray-100`}>
                                    {contact.avatar}
                                </div>
                                <span className="text-xs font-medium text-gray-600 truncate w-full text-center">{contact.name}</span>
                            </motion.button>
                        ))}
                        <Link href="/transfer" className="flex flex-col items-center space-y-1 min-w-[60px]">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors border-2 border-dashed border-gray-200">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">{t('viewAll')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
