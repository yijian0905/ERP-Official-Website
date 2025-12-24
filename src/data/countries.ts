/**
 * Countries data with currency and timezone mapping
 * Used in subscription flow to auto-determine default currency
 */

export interface Country {
    code: string;      // ISO 3166-1 alpha-2
    name: string;
    currency: string;  // ISO 4217
    timezone: string;  // IANA timezone
}

export const countries: Country[] = [
    // Southeast Asia (Primary Market)
    { code: 'MY', name: 'Malaysia', currency: 'MYR', timezone: 'Asia/Kuala_Lumpur' },
    { code: 'SG', name: 'Singapore', currency: 'SGD', timezone: 'Asia/Singapore' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR', timezone: 'Asia/Jakarta' },
    { code: 'TH', name: 'Thailand', currency: 'THB', timezone: 'Asia/Bangkok' },
    { code: 'PH', name: 'Philippines', currency: 'PHP', timezone: 'Asia/Manila' },
    { code: 'VN', name: 'Vietnam', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh' },
    { code: 'BN', name: 'Brunei', currency: 'BND', timezone: 'Asia/Brunei' },
    { code: 'KH', name: 'Cambodia', currency: 'KHR', timezone: 'Asia/Phnom_Penh' },
    { code: 'LA', name: 'Laos', currency: 'LAK', timezone: 'Asia/Vientiane' },
    { code: 'MM', name: 'Myanmar', currency: 'MMK', timezone: 'Asia/Yangon' },

    // East Asia
    { code: 'CN', name: 'China', currency: 'CNY', timezone: 'Asia/Shanghai' },
    { code: 'JP', name: 'Japan', currency: 'JPY', timezone: 'Asia/Tokyo' },
    { code: 'KR', name: 'South Korea', currency: 'KRW', timezone: 'Asia/Seoul' },
    { code: 'TW', name: 'Taiwan', currency: 'TWD', timezone: 'Asia/Taipei' },
    { code: 'HK', name: 'Hong Kong', currency: 'HKD', timezone: 'Asia/Hong_Kong' },
    { code: 'MO', name: 'Macau', currency: 'MOP', timezone: 'Asia/Macau' },

    // South Asia
    { code: 'IN', name: 'India', currency: 'INR', timezone: 'Asia/Kolkata' },
    { code: 'BD', name: 'Bangladesh', currency: 'BDT', timezone: 'Asia/Dhaka' },
    { code: 'PK', name: 'Pakistan', currency: 'PKR', timezone: 'Asia/Karachi' },
    { code: 'LK', name: 'Sri Lanka', currency: 'LKR', timezone: 'Asia/Colombo' },
    { code: 'NP', name: 'Nepal', currency: 'NPR', timezone: 'Asia/Kathmandu' },

    // Oceania
    { code: 'AU', name: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD', timezone: 'Pacific/Auckland' },

    // Middle East
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', timezone: 'Asia/Dubai' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', timezone: 'Asia/Riyadh' },
    { code: 'QA', name: 'Qatar', currency: 'QAR', timezone: 'Asia/Qatar' },
    { code: 'KW', name: 'Kuwait', currency: 'KWD', timezone: 'Asia/Kuwait' },
    { code: 'BH', name: 'Bahrain', currency: 'BHD', timezone: 'Asia/Bahrain' },
    { code: 'OM', name: 'Oman', currency: 'OMR', timezone: 'Asia/Muscat' },

    // Europe
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London' },
    { code: 'DE', name: 'Germany', currency: 'EUR', timezone: 'Europe/Berlin' },
    { code: 'FR', name: 'France', currency: 'EUR', timezone: 'Europe/Paris' },
    { code: 'IT', name: 'Italy', currency: 'EUR', timezone: 'Europe/Rome' },
    { code: 'ES', name: 'Spain', currency: 'EUR', timezone: 'Europe/Madrid' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR', timezone: 'Europe/Amsterdam' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF', timezone: 'Europe/Zurich' },

    // Americas
    { code: 'US', name: 'United States', currency: 'USD', timezone: 'America/New_York' },
    { code: 'CA', name: 'Canada', currency: 'CAD', timezone: 'America/Toronto' },
    { code: 'MX', name: 'Mexico', currency: 'MXN', timezone: 'America/Mexico_City' },
    { code: 'BR', name: 'Brazil', currency: 'BRL', timezone: 'America/Sao_Paulo' },
];

/**
 * Get country by code
 */
export function getCountryByCode(code: string): Country | undefined {
    return countries.find(c => c.code === code);
}

/**
 * Get currency and timezone for a country
 */
export function getLocaleSettings(countryCode: string): { currency: string; timezone: string } {
    const country = getCountryByCode(countryCode);
    return {
        currency: country?.currency || 'USD',
        timezone: country?.timezone || 'UTC',
    };
}

/**
 * Default country (Malaysia)
 */
export const DEFAULT_COUNTRY = 'MY';
export const DEFAULT_CURRENCY = 'MYR';
export const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';
