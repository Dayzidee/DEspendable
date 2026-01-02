"use client";

import { useEffect, useState } from "react";
import { useLocale } from 'next-intl';

export default function ConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const locale = useLocale();

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookie_consent", "rejected");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const content = {
        de: {
            text: "Wir verwenden Cookies, um Ihr Erlebnis zu verbessern und die Sicherheit zu gewährleisten.",
            accept: "Alles akzeptieren",
            reject: "Nur Essenzielle"
        },
        en: {
            text: "We use cookies to improve your experience and ensure security.",
            accept: "Accept All",
            reject: "Essential Only"
        }
    };

    const t = content[locale as keyof typeof content] || content.en;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 shadow-2xl z-50">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-300 text-sm text-center sm:text-left">
                    {t.text}
                </p>
                <div className="flex space-x-3">
                    <button
                        onClick={handleReject}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
                    >
                        {t.reject}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 text-sm bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
                    >
                        {t.accept}
                    </button>
                </div>
            </div>
        </div>
    );
}
