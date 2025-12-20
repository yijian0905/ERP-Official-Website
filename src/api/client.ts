// API client for communicating with the ERP System backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();
        return data as ApiResponse<T>;
    } catch (error) {
        console.error('API request failed:', error);
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: 'Failed to connect to server. Please check your connection.',
            },
        };
    }
}

// Subscription types
export interface SubscriptionData {
    organizationName: string;
    billingEmail: string;
    adminEmail?: string;
    plan: 'basic' | 'pro' | 'enterprise';
    sameEmail: boolean;
}

export interface SubscriptionResult {
    organization: {
        id: string;
        name: string;
        plan: string;
        tier: string;
    };
    billingOwner: {
        id: string;
        email: string;
        setupToken: string;
        setupUrl: string;
    };
    admin: {
        id: string;
        email: string;
        setupToken: string;
        setupUrl: string;
    } | null;
    license: {
        key: string;
        expiresAt: string;
        maxUsers: number;
    };
}

export interface ActivationResult {
    user: {
        id: string;
        email: string;
        role: string;
    };
    organization: {
        id: string;
        name: string;
    };
}

export interface TokenVerifyResult {
    email: string;
    role: string;
    organizationName: string;
}

// API functions

/**
 * Create a new subscription
 */
export async function createSubscription(data: SubscriptionData): Promise<ApiResponse<SubscriptionResult>> {
    return apiRequest<SubscriptionResult>('/subscription/create', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Activate a user account
 */
export async function activateAccount(token: string, password: string): Promise<ApiResponse<ActivationResult>> {
    return apiRequest<ActivationResult>('/subscription/activate', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    });
}

/**
 * Verify an activation token
 */
export async function verifyToken(token: string): Promise<ApiResponse<TokenVerifyResult>> {
    return apiRequest<TokenVerifyResult>(`/subscription/verify-token/${encodeURIComponent(token)}`);
}

/**
 * Check if an email is available
 */
export async function checkEmailAvailable(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiRequest<{ available: boolean }>(`/subscription/check-email/${encodeURIComponent(email)}`);
}

// Auth types
export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        role: string;
        tenantId: string;
        tenantName: string;
        tier: string;
        permissions: string[];
    };
}

/**
 * Login to the ERP system
 */
export async function login(data: LoginData): Promise<ApiResponse<LoginResult>> {
    return apiRequest<LoginResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Logout from the ERP system
 */
export async function logout(refreshToken?: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}
