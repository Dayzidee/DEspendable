"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "@/messages/en.json";
import de from "@/messages/de.json";

type Locale = "en" | "de";
type Translations = typeof en;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Locale, Translations> = { en, de };

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>("de"); // Default to German as per requirements

    useEffect(() => {
        // Check localStorage first for saved preference
        const savedLocale = localStorage.getItem("language") as Locale | null;

        if (savedLocale && (savedLocale === "en" || savedLocale === "de")) {
            setLocaleState(savedLocale);
        } else {
            // Auto-detect browser language if no saved preference
            const browserLang = navigator.language.split("-")[0];
            const detectedLocale: Locale = browserLang === "de" ? "de" : "en";
            setLocaleState(detectedLocale);
            localStorage.setItem("language", detectedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("language", newLocale);
    };

    const t = (path: string) => {
        const keys = path.split(".");
        let current: any = dictionaries[locale];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path}`);
                return path;
            }
            current = current[key];
        }
        return current as string;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
