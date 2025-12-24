import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPendingSubscription, clearPendingSubscription } from '@/store/mockDatabase';
import { createSubscription, type SubscriptionResult } from '@/api/client';
import './Payment.css';

export function Payment() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<SubscriptionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
    });
    const [pendingData, setPendingData] = useState<ReturnType<typeof getPendingSubscription>>(null);

    useEffect(() => {
        const pending = getPendingSubscription();
        if (!pending || !pending.billingEmail) {
            navigate('/subscribe');
            return;
        }
        setPendingData(pending);
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pendingData) return;

        setIsProcessing(true);
        setError(null);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Call the ERP API to create subscription
        const response = await createSubscription({
            organizationName: pendingData.organizationName,
            billingEmail: pendingData.billingEmail,
            billingName: pendingData.billingName,
            adminEmail: pendingData.sameEmail ? undefined : pendingData.adminEmail,
            adminName: pendingData.sameEmail ? undefined : pendingData.adminName,
            plan: pendingData.selectedPlan as 'basic' | 'pro' | 'enterprise',
            sameEmail: pendingData.sameEmail,
            // Billing Address
            billingCountry: pendingData.billingCountry,
            billingAddress1: pendingData.billingAddress1,
            billingAddress2: pendingData.billingAddress2,
            billingCity: pendingData.billingCity,
            billingState: pendingData.billingState,
            billingPostcode: pendingData.billingPostcode,
            taxId: pendingData.taxId,
            // Locale settings
            defaultCurrency: pendingData.defaultCurrency,
            defaultTimezone: pendingData.defaultTimezone,
        });

        if (!response.success) {
            setError(response.error?.message || 'Failed to create subscription');
            setIsProcessing(false);
            return;
        }

        setResult(response.data!);
        clearPendingSubscription();
        setIsProcessing(false);
    };

    if (result) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="payment-success card card-glass animate-slideUp">
                        <div className="success-icon">✓</div>
                        <h1>Payment Successful!</h1>
                        <p className="text-muted">
                            Your subscription has been activated. We've sent setup instructions to the following email addresses.
                        </p>

                        <div className="organization-info">
                            <h4>Organization: {result.organization.name}</h4>
                            <p>Plan: {result.organization.plan.charAt(0).toUpperCase() + result.organization.plan.slice(1)}</p>
                            <p>License Key: <code>{result.license.key}</code></p>
                        </div>

                        <div className="email-links">
                            <h3>📧 Account Setup Links</h3>
                            <p className="text-sm text-muted mb-4">
                                (In production, these would be sent via email. Click to activate your account.)
                            </p>

                            <div className="email-link-card">
                                <div className="email-role">
                                    <span className="badge badge-info">
                                        {result.admin ? 'Billing Owner' : 'Billing Owner + Admin'}
                                    </span>
                                </div>
                                <p className="email-address">{result.billingOwner.email}</p>
                                <Link to={result.billingOwner.setupUrl} className="btn btn-primary">
                                    Set Up Password
                                </Link>
                            </div>

                            {result.admin && (
                                <div className="email-link-card">
                                    <div className="email-role">
                                        <span className="badge badge-success">System Admin</span>
                                    </div>
                                    <p className="email-address">{result.admin.email}</p>
                                    <Link to={result.admin.setupUrl} className="btn btn-primary">
                                        Set Up Password
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="success-info alert alert-info">
                            <strong>What's Next?</strong>
                            <ol>
                                <li>Click the setup links above to create your password</li>
                                <li>Download and install the ERP desktop application</li>
                                <li>Login with your email and password</li>
                                <li>Your subscription is automatically activated!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="container">
                <div className="payment-content">
                    <div className="payment-form-wrapper card card-glass animate-slideUp">
                        <div className="payment-header">
                            <h1>Payment Details</h1>
                            <p className="text-muted">Enter your card information to complete the purchase</p>
                        </div>

                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="form-group">
                                <label className="form-label">Cardholder Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={cardData.name}
                                    onChange={e => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Card Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="4242 4242 4242 4242"
                                    value={cardData.number}
                                    onChange={e => setCardData(prev => ({ ...prev, number: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="MM/YY"
                                        value={cardData.expiry}
                                        onChange={e => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CVC</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="123"
                                        value={cardData.cvc}
                                        onChange={e => setCardData(prev => ({ ...prev, cvc: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-error">{error}</div>
                            )}

                            <div className="alert alert-warning">
                                <strong>Demo Mode:</strong> This is a simulated payment. No real charges will be made.
                                The account will be created in the ERP system database.
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg payment-btn"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    'Complete Payment'
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="payment-secure">
                        <div className="secure-badge">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M10 1.667L3.333 4.167v5.416c0 4.167 2.917 7.917 6.667 8.75 3.75-.833 6.667-4.583 6.667-8.75V4.167L10 1.667z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7.5 10l1.667 1.667L12.5 8.333"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Secure Payment
                        </div>
                        <p className="text-sm text-muted">
                            Your payment information is encrypted and secure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
