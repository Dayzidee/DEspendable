"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    token: string | null;
    isAdmin: boolean;
    accountNumber: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    token: null,
    isAdmin: false,
    accountNumber: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accountNumber, setAccountNumber] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const idToken = await getIdToken(currentUser);
                    setToken(idToken);

                    // Fetch admin status from public Firestore (client-side)
                    // Note: This matches the user's document structure in /src/app/api/signup/route.ts
                    const { doc, getDoc, getFirestore } = await import("firebase/firestore");
                    const { app } = await import("@/lib/firebase");
                    const db = getFirestore(app);
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setIsAdmin(data.is_admin === true);
                        setAccountNumber(data.account_number || null);
                    } else {
                        setIsAdmin(false);
                        setAccountNumber(null);
                    }
                } catch (error) {
                    console.error("[AuthContext] Error fetching user data:", error);
                    setIsAdmin(false);
                }
            } else {
                setToken(null);
                setIsAdmin(false);
                setAccountNumber(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, token, isAdmin, accountNumber }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
