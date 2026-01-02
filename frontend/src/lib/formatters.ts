/**
 * DIN 5008 compliant formatters for German banking standards.
 * Uses Intl API for proper localization.
 */

export const formatCurrency = (amount: number | string, locale: string = 'de-DE') => {
    const value = typeof amount === "string" ? parseFloat(amount) : amount;

    // DIN 5008: German format is "1.234,56 €" with space before €
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
    }).format(value);
};

export const formatDate = (dateString: string | Date, locale: string = 'de-DE') => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // DIN 5008: German format is DD.MM.YYYY
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};

export const formatTime = (dateString: string | Date, locale: string = 'de-DE') => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // DIN 5008: German format is HH:MM Uhr (24-hour clock)
    const timeStr = new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(date);

    return locale === 'de-DE' ? `${timeStr} Uhr` : timeStr;
};

export const formatDateTime = (dateString: string | Date, locale: string = 'de-DE') => {
    if (!dateString) return "";
    const date = new Date(dateString);

    // DIN 5008: "31.12.2025, 14:30 Uhr"
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(date) + (locale === 'de-DE' ? ' Uhr' : '');
};

export const formatIBAN = (iban: string): string => {
    if (!iban) return "";

    // Remove existing spaces and convert to uppercase
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

    // Add space every 4 characters for readability
    // DIN 5008: "DE89 3704 0044 0532 0130 00"
    return cleanIBAN.match(/.{1,4}/g)?.join(' ') || cleanIBAN;
};

export const formatAccountNumber = (accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return accountNumber;

    // Mask middle digits for privacy
    // Show first 4 and last 2: "1234••••90"
    const visibleStart = accountNumber.slice(0, 4);
    const visibleEnd = accountNumber.slice(-2);
    const maskedMiddle = '••••';

    return `${visibleStart}${maskedMiddle}${visibleEnd}`;
};

export const formatPercentage = (value: number, locale: string = 'de-DE'): string => {
    // DIN 5008: German format is "2,5 %" with space before %
    const formatted = new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(value / 100);

    // Intl API already handles the space in German locale
    return formatted;
};

export const maskIBAN = (iban: string): string => {
    if (!iban) return "";

    const cleanIBAN = iban.replace(/\s/g, '');

    // Show country code and last 4 digits: "DE•• •••• •••• •••• ••30 00"
    if (cleanIBAN.length < 6) return iban;

    const countryCode = cleanIBAN.slice(0, 2);
    const lastFour = cleanIBAN.slice(-4);
    const maskedLength = cleanIBAN.length - 6;
    const masked = '•'.repeat(maskedLength);

    const fullMasked = `${countryCode}${masked}${lastFour}`;

    // Format with spaces
    return fullMasked.match(/.{1,4}/g)?.join(' ') || fullMasked;
};

export const validateIBAN = (iban: string): boolean => {
    // Basic IBAN validation (checksum validation should be done server-side)
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();

    // Check length (German IBAN is 22 characters)
    if (!/^[A-Z]{2}\d{20}$/.test(cleanIBAN)) {
        return false;
    }

    // For German IBANs, must start with DE
    if (cleanIBAN.startsWith('DE')) {
        return cleanIBAN.length === 22;
    }

    return true; // Basic validation passed
};
