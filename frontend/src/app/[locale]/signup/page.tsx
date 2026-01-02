"use client";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import LanguageSwitch from "@/components/LanguageSwitch";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const t = useTranslations('auth');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t('errors.passwordsDontMatch'));
            return;
        }

        if (password.length < 6) {
            setError(t('errors.passwordTooShort'));
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
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
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] p-4">
            <div className="absolute top-6 right-6">
                <LanguageSwitch />
            </div>

            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0018A8] mb-2">
                        {t('createAccount')}
                    </h1>
                    <p className="text-[#666666]">{t('signup')}</p>
                </div>

                {error && (
                    <div className="p-4 mb-6 text-sm bg-red-50 text-[#E2001A] border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ihre.email@beispiel.de"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">
                            {t('confirmPassword')}
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full bg-[#F4F6F8] border border-gray-300 rounded-lg px-4 py-3 text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#0018A8] focus:border-transparent transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0018A8] text-white font-bold py-3 rounded-lg hover:bg-[#00127a] transition-all shadow-md mt-6"
                    >
                        {t('signupButton')}
                    </button>
                </form>

                <p className="mt-8 text-center text-[#666666] text-sm">
                    {t('alreadyHaveAccount')}{" "}
                    <Link href="/login" className="text-[#0018A8] font-semibold hover:underline">
                        {t('loginHere')}
                    </Link>
                </p>
            </div>

            <footer className="mt-8 flex gap-6 text-sm text-[#666666]">
                <Link href="/impressum" className="hover:text-[#0018A8] transition">
                    Impressum
                </Link>
                <Link href="/datenschutz" className="hover:text-[#0018A8] transition">
                    Datenschutz
                </Link>
            </footer>
        </div>
    );
}
