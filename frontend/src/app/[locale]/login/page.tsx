"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import LanguageSwitch from "@/components/LanguageSwitch";
import { useForm } from "react-hook-form";
import { FaLeaf, FaSpinner } from "react-icons/fa";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const t = useTranslations('auth');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            router.push("/dashboard");
        } catch (err: any) {
            // Sanitized error messages using translations
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError(t('errors.invalidCredentials'));
            } else if (err.code === 'auth/too-many-requests') {
                setError(t('errors.tooManyAttempts'));
            } else if (err.code === 'auth/network-request-failed') {
                setError(t('errors.networkError'));
            } else {
                setError(t('errors.unknownError'));
            }
            console.error("[Login Error]", err.code);
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
                        <h2 className="text-2xl font-bold text-[#1C1C1C]">Welcome Back</h2>
                        <p className="text-[#666666] mt-1">Sign in to your DEspendables account.</p>
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
                                placeholder="e.g., yourusername"
                            />
                            {errors.email && <span className="text-xs text-[#E2001A]">Email is required</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-[#1C1C1C]">
                                {t('password')}
                            </label>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                className="w-full bg-[#F4F6F8] border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                                placeholder="Enter your password"
                            />
                            {errors.password && <span className="text-xs text-[#E2001A]">Password is required</span>}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)] border-gray-300" />
                                <span className="text-[#666666]">Remember me</span>
                            </label>
                            <a href="#" className="text-[var(--color-primary)] font-medium hover:underline">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0018A8] to-[#0025D9] text-white font-bold py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading && <FaSpinner className="animate-spin" />}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <footer className="mt-8 text-center text-sm">
                        <p className="text-[#666666]">
                            Don&apos;t have an account? <Link href="/signup" className="text-[#0018A8] font-bold hover:underline">Sign up for free</Link>
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
