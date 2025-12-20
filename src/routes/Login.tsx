import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '@/api/client';
import './Login.css';

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const response = await apiLogin({
            email: formData.email,
            password: formData.password,
        });

        if (!response.success) {
            setError(response.error?.message || 'Login failed');
            setIsLoading(false);
            return;
        }

        // Store tokens in localStorage
        const { accessToken, refreshToken, user } = response.data!;
        localStorage.setItem('erp_access_token', accessToken);
        localStorage.setItem('erp_refresh_token', refreshToken);
        localStorage.setItem('erp_user', JSON.stringify(user));

        setIsLoading(false);

        // Redirect to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="login-content card card-glass animate-slideUp">
                    <div className="login-header">
                        <div className="login-logo">
                            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#loginLogoGradient)" />
                                <path d="M8 10h16M8 16h12M8 22h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="loginLogoGradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop stopColor="#6366F1" />
                                        <stop offset="1" stopColor="#0EA5E9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className="text-muted">Sign in to your ERP account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="text-sm text-muted">
                            Don't have an account?{' '}
                            <Link to="/subscribe">Get started</Link>
                        </p>
                    </div>

                    <div className="login-note">
                        <p className="text-sm text-muted">
                            <strong>Note:</strong> Use the same credentials to login in the ERP desktop application.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
