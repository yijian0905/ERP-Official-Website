import { Link, useLocation } from 'react-router-dom';
import { getCurrentSession, logout } from '@/store/mockDatabase';
import { useEffect, useState } from 'react';
import type { User } from '@/types';
import './Header.css';

export function Header() {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { user: currentUser } = getCurrentSession();
        setUser(currentUser);
    }, [location]);

    const handleLogout = () => {
        logout();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#logoGradient)" />
                                <path d="M8 10h16M8 16h12M8 22h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop stopColor="#6366F1" />
                                        <stop offset="1" stopColor="#0EA5E9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">ERP System</span>
                    </Link>

                    <nav className="nav">
                        {!user ? (
                            <>
                                <Link to="/#features" className="nav-link">Features</Link>
                                <Link to="/#einvoice" className="nav-link nav-highlight">E-Invoice</Link>
                                <Link to="/#pricing" className="nav-link">Pricing</Link>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/subscribe" className="btn btn-primary btn-sm">Get Started</Link>
                            </>
                        ) : (
                            <>
                                {user.role === 'billing_owner' && (
                                    <Link to="/billing" className="nav-link">Billing Portal</Link>
                                )}
                                {(user.role === 'admin' || user.role === 'user') && (
                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                )}
                                <span className="user-email">{user.email}</span>
                                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
