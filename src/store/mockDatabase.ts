import type { Organization, User, SubscriptionFormData } from '@/types';

const STORAGE_KEYS = {
    ORGANIZATIONS: 'erp_organizations',
    USERS: 'erp_users',
    CURRENT_USER: 'erp_current_user',
    PENDING_SUBSCRIPTION: 'erp_pending_subscription',
};

// Helper functions
function generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function hashPassword(password: string): string {
    // Simple hash for demo - NOT secure for production
    return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
    return btoa(password) === hash;
}

// Organization Operations
export function getOrganizations(): Organization[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
    return data ? JSON.parse(data) : [];
}

export function getOrganization(id: string): Organization | null {
    const orgs = getOrganizations();
    return orgs.find(org => org.id === id) || null;
}

export function createOrganization(data: Partial<Organization>): Organization {
    const orgs = getOrganizations();
    const newOrg: Organization = {
        id: generateId(),
        name: data.name || 'New Organization',
        subscriptionStatus: 'active',
        subscriptionPlan: data.subscriptionPlan || 'basic',
        seatLimit: data.seatLimit || 5,
        usedSeats: 0,
        createdAt: new Date().toISOString(),
        billingEmail: data.billingEmail || '',
        ...data,
    };
    orgs.push(newOrg);
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
    return newOrg;
}

export function updateOrganization(id: string, updates: Partial<Organization>): Organization | null {
    const orgs = getOrganizations();
    const index = orgs.findIndex(org => org.id === id);
    if (index === -1) return null;

    orgs[index] = { ...orgs[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
    return orgs[index];
}

// User Operations
export function getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

export function getUser(id: string): User | null {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
}

export function getUserByEmail(email: string): User | null {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserByToken(token: string): User | null {
    const users = getUsers();
    return users.find(user => user.setupToken === token) || null;
}

export function createUser(data: Partial<User>): User {
    const users = getUsers();
    const newUser: User = {
        id: generateId(),
        name: data.name || '',
        email: data.email || '',
        passwordHash: '',
        role: data.role || 'user',
        organizationId: data.organizationId || '',
        isActivated: false,
        setupToken: generateToken(),
        createdAt: new Date().toISOString(),
        ...data,
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
}

export function activateUser(userId: string, password: string): User | null {
    const users = getUsers();
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) return null;

    users[index] = {
        ...users[index],
        passwordHash: hashPassword(password),
        isActivated: true,
        setupToken: undefined,
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
}

export function updateUser(id: string, updates: Partial<User>): User | null {
    const users = getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
}

// Authentication
export function login(email: string, password: string): { success: boolean; user?: User; organization?: Organization; error?: string } {
    const user = getUserByEmail(email);

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    if (!user.isActivated) {
        return { success: false, error: 'Account not activated. Please check your email for the setup link.' };
    }

    if (!verifyPassword(password, user.passwordHash)) {
        return { success: false, error: 'Invalid password' };
    }

    const organization = getOrganization(user.organizationId);

    if (!organization) {
        return { success: false, error: 'Organization not found' };
    }

    // Check subscription status
    if (organization.subscriptionStatus === 'expired') {
        return { success: false, error: 'Subscription expired. Please contact your billing administrator.' };
    }

    if (organization.subscriptionStatus === 'cancelled') {
        return { success: false, error: 'Subscription cancelled. Please renew your subscription.' };
    }

    // Store current user session
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ userId: user.id }));

    return { success: true, user, organization };
}

export function logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentSession(): { user: User | null; organization: Organization | null } {
    const sessionData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!sessionData) return { user: null, organization: null };

    const { userId } = JSON.parse(sessionData);
    const user = getUser(userId);
    if (!user) return { user: null, organization: null };

    const organization = getOrganization(user.organizationId);
    return { user, organization };
}

// Subscription Flow
export function savePendingSubscription(data: SubscriptionFormData): void {
    localStorage.setItem(STORAGE_KEYS.PENDING_SUBSCRIPTION, JSON.stringify(data));
}

export function getPendingSubscription(): SubscriptionFormData | null {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_SUBSCRIPTION);
    return data ? JSON.parse(data) : null;
}

export function clearPendingSubscription(): void {
    localStorage.removeItem(STORAGE_KEYS.PENDING_SUBSCRIPTION);
}

export interface PaymentResult {
    success: boolean;
    organization?: Organization;
    billingOwner?: User;
    admin?: User;
    setupLinks: {
        billingOwner: string;
        admin?: string;
    };
}

export function processPayment(): PaymentResult {
    const pendingData = getPendingSubscription();
    if (!pendingData) {
        return { success: false, setupLinks: { billingOwner: '' } };
    }

    // Determine seat limit based on plan
    const seatLimits: Record<string, number> = {
        basic: 5,
        pro: 20,
        enterprise: 100,
    };

    // Create organization
    const organization = createOrganization({
        name: pendingData.organizationName || 'My Organization',
        billingEmail: pendingData.billingEmail,
        subscriptionPlan: pendingData.selectedPlan as 'basic' | 'pro' | 'enterprise',
        seatLimit: seatLimits[pendingData.selectedPlan] || 5,
    });

    // Create billing owner
    const billingOwner = createUser({
        name: pendingData.billingName,
        email: pendingData.billingEmail,
        role: pendingData.sameEmail ? 'admin' : 'billing_owner',
        organizationId: organization.id,
    });

    const result: PaymentResult = {
        success: true,
        organization,
        billingOwner,
        setupLinks: {
            billingOwner: `/setup-password/${billingOwner.setupToken}`,
        },
    };

    // Create admin if different email
    if (!pendingData.sameEmail && pendingData.adminEmail !== pendingData.billingEmail) {
        const admin = createUser({
            name: pendingData.adminName,
            email: pendingData.adminEmail,
            role: 'admin',
            organizationId: organization.id,
        });
        result.admin = admin;
        result.setupLinks.admin = `/setup-password/${admin.setupToken}`;
    }

    // Update seat count
    updateOrganization(organization.id, {
        usedSeats: pendingData.sameEmail ? 1 : 2,
    });

    clearPendingSubscription();
    return result;
}

// Clear all data (for testing)
export function clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}
