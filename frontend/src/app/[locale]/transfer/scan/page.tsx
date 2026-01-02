"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function PhotoTransfer() {
    const { t } = useLanguage();
    const router = useRouter();
    const [scanning, setScanning] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (scanning) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setScanning(false);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [scanning]);

    const handleScanSuccess = () => {
        const mockIBAN = "DE89370500001234567890";
        const mockAmount = "124.50";
        const mockRef = "Rechnung Nr. 2025-001";

        router.push(`/transfer?iban=${mockIBAN}&amount=${mockAmount}&reference=${encodeURIComponent(mockRef)}`);
    };

    return (
        <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <span className="text-gray-500 animate-pulse text-sm">Kamera aktiv...</span>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-center text-white">
                    <Link href="/dashboard" className="p-3 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </Link>
                    <h1 className="text-lg font-semibold drop-shadow-lg">Foto-Überweisung</h1>
                    <div className="w-12"></div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-full max-w-sm aspect-[3/4] border-4 border-white/60 rounded-3xl relative overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]">
                        <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-[#E2001A]"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-[#E2001A]"></div>
                        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-[#E2001A]"></div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-[#E2001A]"></div>

                        {scanning && (
                            <div
                                className="absolute left-0 right-0 h-1 bg-[#E2001A] shadow-[0_0_15px_rgba(226,0,26,0.8)]"
                                style={{ top: `${progress}%`, transition: 'top 0.05s linear' }}
                            ></div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <p className="text-white text-center text-sm font-medium drop-shadow-lg leading-relaxed">
                                Halten Sie die Rechnung oder den Überweisungsträger in den Rahmen.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pb-10">
                    <button
                        onClick={handleScanSuccess}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md active:scale-95 transition shadow-lg"
                    >
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}
