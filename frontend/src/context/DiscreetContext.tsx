"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface DiscreetContextType {
    isDiscreet: boolean;
    toggleDiscreet: () => void;
}

const DiscreetContext = createContext<DiscreetContextType>({
    isDiscreet: false,
    toggleDiscreet: () => { },
});

export const DiscreetProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDiscreet, setIsDiscreet] = useState(false);

    useEffect(() => {
        // Load preference
        const saved = localStorage.getItem("discreetMode");
        if (saved) {
            setIsDiscreet(JSON.parse(saved));
        }
    }, []);

    const toggleDiscreet = () => {
        setIsDiscreet((prev) => {
            const newValue = !prev;
            localStorage.setItem("discreetMode", JSON.stringify(newValue));
            return newValue;
        });
    };

    return (
        <DiscreetContext.Provider value={{ isDiscreet, toggleDiscreet }}>
            {children}
        </DiscreetContext.Provider>
    );
};

export const useDiscreet = () => useContext(DiscreetContext);
