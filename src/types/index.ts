// Organization Types
export interface Organization {
    id: string;
    name: string;
    subscriptionStatus: 'active' | 'past_due' | 'expired' | 'cancelled';
    subscriptionPlan: 'basic' | 'pro' | 'enterprise';
    seatLimit: number;
    usedSeats: number;
    createdAt: string;
    billingEmail: string;
}

// User Types
export interface User {
    id: string;
    email: string;
    passwordHash: string;
    role: 'billing_owner' | 'admin' | 'user';
    organizationId: string;
    isActivated: boolean;
    setupToken?: string;
    createdAt: string;
}

// Subscription Plan Types
export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    seatLimit: number;
    features: string[];
}

// Form Types
export interface SubscriptionFormData {
    billingEmail: string;
    adminEmail: string;
    sameEmail: boolean;
    selectedPlan: string;
    organizationName: string;
}

// Auth Context Types
export interface AuthState {
    user: User | null;
    organization: Organization | null;
    isAuthenticated: boolean;
}
