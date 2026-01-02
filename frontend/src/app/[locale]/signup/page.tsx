"use client";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import LanguageSwitch from "@/components/LanguageSwitch";
import { useForm } from "react-hook-form";
import { FaLeaf, FaSpinner } from "react-icons/fa";

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const t = useTranslations('auth');

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password");

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError("");

        if (data.password !== data.confirmPassword) {
            setError(t('errors.passwordsDontMatch'));
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            router.push("/dashboard");
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError(t('errors.emailInUse'));
            } else if (err.code === 'auth/invalid-email') {
                setError(t('errors.invalidCredentials'));
            } else if (err.code === 'auth/weak-password') {
                setError(t('errors.weakPassword'));
            } else if (err.code === 'auth/network-request-failed') {
                setError(t('errors.networkError'));
            } else {
                setError(t('errors.unknownError'));
            }
            console.error("[Signup Error]", err.code);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center bg-[#F4F6F8] p-4 font-sans">
            <div className="container mx-auto px-4">
                <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 animate-fade-in-up">

                    <header className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl mb-4 hover:scale-110 transition-transform">
                            <FaLeaf />
                        </Link>
                        <h2 className="text-2xl font-bold text-[#1C1C1C]">Create Your Account</h2>
                        <p className="text-[#666666] mt-1">Join Well Care Spendables and start your journey to financial wellness.</p>
                    </header>

                    {error && (
                        <div className="p-4 mb-6 text-sm bg-red-50 text-[#E2001A] border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-[#1C1C1C]">
                                {t('email')}
                            </label>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                placeholder="Choose a unique username"
                            />
                            {errors.email && <span className="text-xs text-[#E2001A]">Email is required</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-[#1C1C1C]">
                                {t('password')}
                            </label>
                            <input
                                {...register("password", { required: true, minLength: 6 })}
                                type="password"
                                className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                placeholder="Create a strong password (min. 8 characters)"
                            />
                            {errors.password && <span className="text-xs text-[#E2001A]">Password must be at least 6 characters</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-[#1C1C1C]">
                                {t('confirmPassword')}
                            </label>
                            <input
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                type="password"
                                className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <span className="text-xs text-[#E2001A]">{errors.confirmPassword.message as string}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#E2001A] to-[#FF1744] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                        >
                            {loading && <FaSpinner className="animate-spin" />}
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-[#666666]">
                        By creating an account, you agree to our <a href="#" className="underline hover:text-[#0018A8]">Terms of Service</a>.
                    </div>

                    <footer className="mt-8 text-center text-sm">
                        <p className="text-[#666666]">
                            Already have an account? <Link href="/login" className="text-[#0018A8] font-bold hover:underline">Sign In</Link>
                        </p>
                    </footer>

                </div>
            </div>

            <div className="absolute top-6 right-6">
                <LanguageSwitch />
            </div>
        </div>
    );
}
