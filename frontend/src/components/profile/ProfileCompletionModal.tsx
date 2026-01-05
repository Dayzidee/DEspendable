"use client";

import { useTranslations } from 'next-intl';
import ProfileForm from './ProfileForm';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export default function ProfileCompletionModal({ isOpen, onSuccess }: ProfileCompletionModalProps) {
    const t = useTranslations('profile_data');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                📝
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('modal_title')}</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {t('modal_desc')}
                            </p>
                        </div>

                        <ProfileForm onSuccess={onSuccess} />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
