import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
    tenantName: string;
    tier: string;
    permissions: string[];
}

export function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Get user from localStorage (stored after login)
        const storedUser = localStorage.getItem('erp_user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(storedUser) as User;
            setUser(userData);
        } catch {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('erp_access_token');
        localStorage.removeItem('erp_refresh_token');
        localStorage.removeItem('erp_user');
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    const getTierName = (tier: string) => {
        const names: Record<string, string> = {
            L1: 'Basic',
            L2: 'Professional',
            L3: 'Enterprise',
        };
        return names[tier] || tier;
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header animate-slideUp">
                    <h1>Welcome to the ERP System</h1>
                    <p className="text-muted">
                        You're logged in as <strong>{user.email}</strong>
                    </p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card card card-glass animate-slideUp">
                        <h3>Account Information</h3>
                        <div className="info-list">
                            <div className="info-row">
                                <span className="info-label">Name</span>
                                <span className="info-value">{user.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Role</span>
                                <span className={`badge ${user.role === 'ADMIN' ? 'badge-success' : 'badge-info'}`}>
                                    {user.role === 'ADMIN' ? 'System Administrator' : user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card card card-glass animate-slideUp">
                        <h3>Organization</h3>
                        <div className="info-list">
                            <div className="info-row">
                                <span className="info-label">Name</span>
                                <span className="info-value">{user.tenantName}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Plan</span>
                                <span className="info-value">{getTierName(user.tier)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Status</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card card card-glass animate-slideUp dashboard-card-full">
                        <h3>Quick Actions</h3>
                        <p className="text-muted mb-4">
                            This is the web portal. For full ERP functionality, please use the desktop application.
                        </p>
                        <div className="quick-actions">
                            <div className="action-item">
                                <div className="action-icon">📦</div>
                                <span>Inventory</span>
                            </div>
                            <div className="action-item">
                                <div className="action-icon">💰</div>
                                <span>Sales</span>
                            </div>
                            <div className="action-item">
                                <div className="action-icon">🛒</div>
                                <span>Purchasing</span>
                            </div>
                            <div className="action-item">
                                <div className="action-icon">📊</div>
                                <span>Reports</span>
                            </div>
                            <div className="action-item">
                                <div className="action-icon">👥</div>
                                <span>Team</span>
                            </div>
                            <div className="action-item">
                                <div className="action-icon">⚙️</div>
                                <span>Settings</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card card card-glass animate-slideUp dashboard-card-full">
                        <h3>Desktop Application</h3>
                        <p className="text-muted mb-4">
                            Download and install the ERP desktop application to access all features.
                            Use your email and password to login.
                        </p>
                        <div className="download-actions">
                            <button className="btn btn-primary btn-lg">
                                Download for Windows
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dashboard-footer">
                    <Link to="/billing" className="btn btn-outline">
                        Manage Billing
                    </Link>
                </div>
            </div>
        </div>
    );
}
