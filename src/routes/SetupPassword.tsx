import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyToken, activateAccount, type TokenVerifyResult } from '@/api/client';
import './SetupPassword.css';

export function SetupPassword() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [tokenData, setTokenData] = useState<TokenVerifyResult | null>(null);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid setup link');
            setIsLoading(false);
            return;
        }

        // Verify the token with the API
        verifyToken(token).then(response => {
            if (!response.success) {
                setError(response.error?.message || 'Invalid or expired setup link');
                setIsLoading(false);
                return;
            }

            setTokenData(response.data!);
            setIsLoading(false);
        });
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) return;

        setIsSubmitting(true);

        const response = await activateAccount(token, formData.password);

        if (!response.success) {
            setError(response.error?.message || 'Failed to activate account');
            setIsSubmitting(false);
            return;
        }

        setSuccess(true);
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="setup-page">
                <div className="container">
                    <div className="setup-loading">
                        <div className="spinner-lg"></div>
                        <p>Verifying your link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="setup-page">
                <div className="container">
                    <div className="setup-success card card-glass animate-slideUp">
                        <div className="success-icon">✓</div>
                        <h1>Account Activated!</h1>
                        <p className="text-muted mb-6">
                            Your password has been set. You can now log in to the ERP system.
                        </p>
                        <div className="success-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/login')}
                            >
                                Login Here
                            </button>
                            <p className="text-sm text-muted mt-4">
                                Or download the ERP desktop app and login there.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !tokenData) {
        return (
            <div className="setup-page">
                <div className="container">
                    <div className="setup-error card card-glass animate-slideUp">
                        <div className="error-icon">✕</div>
                        <h1>Setup Error</h1>
                        <p className="text-muted mb-6">{error}</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/')}
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="setup-page">
            <div className="container">
                <div className="setup-content card card-glass animate-slideUp">
                    <div className="setup-header">
                        <h1>Set Up Your Password</h1>
                        <p className="text-muted">
                            Create a password for <strong>{tokenData?.email}</strong>
                        </p>
                        <div className="setup-info mt-4">
                            <span className="badge badge-info">
                                {tokenData?.role === 'ADMIN' ? 'System Administrator' : 'Billing Owner'}
                            </span>
                            <span className="org-name">{tokenData?.organizationName}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="setup-form">
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

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <ul className="password-requirements">
                            <li className={formData.password.length >= 8 ? 'valid' : ''}>
                                At least 8 characters
                            </li>
                        </ul>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg setup-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Activating...' : 'Activate Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
