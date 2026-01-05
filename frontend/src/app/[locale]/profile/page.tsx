"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { User, Shield, Settings, MapPin, Briefcase, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    employmentStatus: string;
    sourceOfFunds: string;
    annualIncome: string;
    nationality: string;
    dateOfBirth: string;
}

export default function Profile() {
    const { user, token, loading: authLoading } = useAuth();
    const t = useTranslations();
    const tProfile = useTranslations('profile_data');
    const router = useRouter();

    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            if (!token) return;

            try {
                const response = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setProfileData({
                    ...data,
                    email: user?.email || ""
                });
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && token) {
            fetchProfile();
        }
    }, [user, token, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0018A8]"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-6 text-red-600 bg-red-50 rounded-xl">
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    const fullName = profileData ? `${profileData.firstName} ${profileData.lastName}` : (user?.displayName || "User");
    const initial = fullName.charAt(0).toUpperCase();

    const sections = [
        {
            title: t('menu.personalData'),
            icon: <User className="w-5 h-5" />,
            items: [
                { label: tProfile('firstName'), value: profileData?.firstName },
                { label: tProfile('lastName'), value: profileData?.lastName },
                { label: tProfile('email'), value: profileData?.email },
                { label: tProfile('phoneNumber'), value: profileData?.phoneNumber },
                { label: tProfile('dateOfBirth'), value: profileData?.dateOfBirth },
                { label: tProfile('nationality'), value: profileData?.nationality }
            ]
        },
        {
            title: tProfile('financial_info'),
            icon: <Wallet className="w-5 h-5" />,
            items: [
                { label: tProfile('employmentStatus'), value: profileData?.employmentStatus ? tProfile(`options.${profileData.employmentStatus}`) : profileData?.employmentStatus }, // Assuming simple value for now, could be translated
                { label: tProfile('sourceOfFunds'), value: profileData?.sourceOfFunds ? tProfile(`options.${profileData.sourceOfFunds}`) : profileData?.sourceOfFunds },
                { label: tProfile('annualIncome'), value: profileData?.annualIncome ? `€${profileData.annualIncome}` : '' }
            ]
        },
        {
            title: t('menu.security'),
            icon: <Shield className="w-5 h-5" />,
            items: [
                { label: "Password", value: "••••••••••••" },
                { label: "2FA", value: "Enabled" }, // Placeholder logic for now
            ]
        }
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">

                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0018A8] to-[#0025D9] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {initial}
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">{fullName}</h1>
                        <p className="text-gray-500 mb-4">{profileData?.email} • {t('cards.premium')} Member</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-[#0018A8] rounded-full text-sm font-medium flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Verified
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                                Member since {new Date().getFullYear()} {/* Could use creationTime from metadata */}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0018A8] flex items-center justify-center">
                                    {section.icon}
                                </div>
                                <h2 className="text-lg font-bold text-[#1C1C1C]">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-center justify-between group">
                                        <span className="text-gray-500 text-sm">{item.label}</span>
                                        <span className="font-medium text-[#1C1C1C] flex items-center gap-2">
                                            {item.value || '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Address Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-[#1C1C1C]">{tProfile('address_info')}</h2>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[#1C1C1C]">{profileData?.address?.street || '-'}</p>
                            <div className="flex gap-2">
                                <span className="text-[#1C1C1C]">{profileData?.address?.postalCode || '-'}</span>
                                <span className="text-[#1C1C1C]">{profileData?.address?.city || '-'}</span>
                            </div>
                            <p className="text-[#1C1C1C]">{profileData?.address?.country || '-'}</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </DashboardLayout>
    );
}
