import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, updateOrganization, getUsers, updateUser, createUser } from '@/store/mockDatabase';
import type { User, Organization } from '@/types';
import './BillingPortal.css';

export function BillingPortal() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [orgUsers, setOrgUsers] = useState<User[]>([]);
    const [showChangeAdmin, setShowChangeAdmin] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        const session = getCurrentSession();
        if (!session.user) {
            navigate('/login');
            return;
        }
        if (session.user.role !== 'billing_owner' && session.user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        setUser(session.user);
        setOrganization(session.organization);

        // Get all users in the organization
        const allUsers = getUsers().filter(u => u.organizationId === session.organization?.id);
        setOrgUsers(allUsers);
    }, [navigate]);

    const handleChangeStatus = (newStatus: 'active' | 'past_due' | 'expired' | 'cancelled') => {
        if (!organization) return;
        const updated = updateOrganization(organization.id, { subscriptionStatus: newStatus });
        if (updated) {
            setOrganization(updated);
        }
        setShowStatusModal(false);
    };

    const handleChangeAdmin = () => {
        if (!organization || !newAdminEmail) return;

        // Check if user already exists
        const existingUser = orgUsers.find(u => u.email.toLowerCase() === newAdminEmail.toLowerCase());

        if (existingUser) {
            // Promote existing user to admin
            updateUser(existingUser.id, { role: 'admin' });
        } else {
            // Create new admin user
            createUser({
                email: newAdminEmail,
                role: 'admin',
                organizationId: organization.id,
            });
            updateOrganization(organization.id, { usedSeats: organization.usedSeats + 1 });
        }

        // Refresh users list
        const allUsers = getUsers().filter(u => u.organizationId === organization.id);
        setOrgUsers(allUsers);
        setShowChangeAdmin(false);
        setNewAdminEmail('');
    };

    if (!user || !organization) return null;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            active: 'badge-success',
            past_due: 'badge-warning',
            expired: 'badge-error',
            cancelled: 'badge-error',
        };
        return colors[status] || 'badge-info';
    };

    const mockInvoices = [
        { id: 'INV-001', date: '2024-12-01', amount: organization.subscriptionPlan === 'basic' ? 49 : organization.subscriptionPlan === 'pro' ? 149 : 399, status: 'paid' },
        { id: 'INV-002', date: '2024-11-01', amount: organization.subscriptionPlan === 'basic' ? 49 : organization.subscriptionPlan === 'pro' ? 149 : 399, status: 'paid' },
        { id: 'INV-003', date: '2024-10-01', amount: organization.subscriptionPlan === 'basic' ? 49 : organization.subscriptionPlan === 'pro' ? 149 : 399, status: 'paid' },
    ];

    return (
        <div className="billing-page">
            <div className="container">
                <div className="billing-header animate-slideUp">
                    <h1>Billing Portal</h1>
                    <p className="text-muted">
                        Manage your subscription and billing information
                    </p>
                </div>

                <div className="billing-grid">
                    {/* Subscription Status */}
                    <div className="billing-card card card-glass animate-slideUp">
                        <div className="billing-card-header">
                            <h3>Subscription</h3>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setShowStatusModal(true)}
                            >
                                Change Status (Demo)
                            </button>
                        </div>
                        <div className="subscription-status">
                            <div className="status-plan">
                                <span className="plan-name capitalize">{organization.subscriptionPlan} Plan</span>
                                <span className={`badge ${getStatusColor(organization.subscriptionStatus)}`}>
                                    {organization.subscriptionStatus.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="status-price">
                                ${organization.subscriptionPlan === 'basic' ? 49 : organization.subscriptionPlan === 'pro' ? 149 : 399}
                                <span>/month</span>
                            </div>
                        </div>
                        <div className="subscription-details">
                            <div className="detail-row">
                                <span>Seat Usage</span>
                                <span>{organization.usedSeats} / {organization.seatLimit}</span>
                            </div>
                            <div className="detail-row">
                                <span>Billing Email</span>
                                <span>{organization.billingEmail}</span>
                            </div>
                            <div className="detail-row">
                                <span>Next Billing Date</span>
                                <span>January 1, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="billing-card card card-glass animate-slideUp">
                        <h3>Payment Method</h3>
                        <div className="payment-method">
                            <div className="card-display">
                                <div className="card-brand">💳</div>
                                <div className="card-info">
                                    <span className="card-number">•••• •••• •••• 4242</span>
                                    <span className="card-expiry">Expires 12/26</span>
                                </div>
                            </div>
                            <button className="btn btn-secondary btn-sm">Update</button>
                        </div>
                    </div>

                    {/* Admin Management */}
                    <div className="billing-card card card-glass animate-slideUp">
                        <div className="billing-card-header">
                            <h3>System Administrator</h3>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setShowChangeAdmin(true)}
                            >
                                Add/Change Admin
                            </button>
                        </div>
                        <div className="admin-list">
                            {orgUsers.filter(u => u.role === 'admin' || (u.role === 'billing_owner' && user.id === u.id)).map(admin => (
                                <div key={admin.id} className="admin-item">
                                    <div className="admin-info">
                                        <span className="admin-email">{admin.email}</span>
                                        <span className={`badge ${admin.role === 'admin' ? 'badge-success' : 'badge-info'}`}>
                                            {admin.role === 'admin' ? 'Admin' : 'Billing Owner + Admin'}
                                        </span>
                                    </div>
                                    <span className={`status-dot ${admin.isActivated ? 'active' : ''}`}>
                                        {admin.isActivated ? 'Active' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoice History */}
                    <div className="billing-card card card-glass animate-slideUp billing-card-full">
                        <h3>Invoice History</h3>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockInvoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td>{invoice.id}</td>
                                        <td>{invoice.date}</td>
                                        <td>${invoice.amount}</td>
                                        <td><span className="badge badge-success">Paid</span></td>
                                        <td><button className="btn btn-ghost btn-sm">Download</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Change Admin Modal */}
            {showChangeAdmin && (
                <div className="modal-overlay" onClick={() => setShowChangeAdmin(false)}>
                    <div className="modal card" onClick={e => e.stopPropagation()}>
                        <h3>Add or Change Admin</h3>
                        <p className="text-muted mb-4">
                            Enter the email address of the new system administrator.
                        </p>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@company.com"
                                value={newAdminEmail}
                                onChange={e => setNewAdminEmail(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowChangeAdmin(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleChangeAdmin}>
                                Add Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Change Modal (Demo) */}
            {showStatusModal && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal card" onClick={e => e.stopPropagation()}>
                        <h3>Change Subscription Status (Demo)</h3>
                        <p className="text-muted mb-4">
                            For testing purposes, you can change the subscription status.
                        </p>
                        <div className="status-buttons">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleChangeStatus('active')}
                            >
                                Active
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleChangeStatus('past_due')}
                            >
                                Past Due
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleChangeStatus('expired')}
                            >
                                Expired
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleChangeStatus('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
