import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingSubscription, savePendingSubscription } from '@/store/mockDatabase';
import './Subscribe.css';

const PLAN_DETAILS: Record<string, { name: string; price: number; seats: number }> = {
    basic: { name: 'Basic', price: 49, seats: 5 },
    pro: { name: 'Professional', price: 149, seats: 20 },
    enterprise: { name: 'Enterprise', price: 399, seats: 100 },
};

export function Subscribe() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        organizationName: '',
        billingEmail: '',
        adminEmail: '',
        sameEmail: false,
        selectedPlan: 'pro',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const pending = getPendingSubscription();
        if (pending?.selectedPlan) {
            setFormData(prev => ({ ...prev, selectedPlan: pending.selectedPlan }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            // Auto-fill admin email if sameEmail is checked
            if (name === 'sameEmail' && checked) {
                updated.adminEmail = updated.billingEmail;
            }
            if (name === 'billingEmail' && prev.sameEmail) {
                updated.adminEmail = value;
            }

            return updated;
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.organizationName.trim()) {
            newErrors.organizationName = 'Organization name is required';
        }

        if (!formData.billingEmail.trim()) {
            newErrors.billingEmail = 'Billing email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingEmail)) {
            newErrors.billingEmail = 'Please enter a valid email address';
        }

        if (!formData.sameEmail) {
            if (!formData.adminEmail.trim()) {
                newErrors.adminEmail = 'Admin email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
                newErrors.adminEmail = 'Please enter a valid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        savePendingSubscription({
            ...formData,
            adminEmail: formData.sameEmail ? formData.billingEmail : formData.adminEmail,
        });

        navigate('/payment');
    };

    const plan = PLAN_DETAILS[formData.selectedPlan];

    return (
        <div className="subscribe-page">
            <div className="container">
                <div className="subscribe-content">
                    <div className="subscribe-form-wrapper card card-glass animate-slideUp">
                        <div className="subscribe-header">
                            <h1>Complete Your Subscription</h1>
                            <p className="text-muted">Fill in your details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="subscribe-form">
                            <div className="form-group">
                                <label className="form-label">Organization Name</label>
                                <input
                                    type="text"
                                    name="organizationName"
                                    className="form-input"
                                    placeholder="Your Company Name"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                />
                                {errors.organizationName && (
                                    <span className="form-error">{errors.organizationName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Select Plan</label>
                                <select
                                    name="selectedPlan"
                                    className="form-input"
                                    value={formData.selectedPlan}
                                    onChange={handleChange}
                                >
                                    <option value="basic">Basic - $49/month (5 users)</option>
                                    <option value="pro">Professional - $149/month (20 users)</option>
                                    <option value="enterprise">Enterprise - $399/month (100 users)</option>
                                </select>
                            </div>

                            <div className="form-divider">
                                <span>Account Information</span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Billing Email
                                    <span className="form-hint">This will be the Billing Owner account</span>
                                </label>
                                <input
                                    type="email"
                                    name="billingEmail"
                                    className="form-input"
                                    placeholder="billing@company.com"
                                    value={formData.billingEmail}
                                    onChange={handleChange}
                                />
                                {errors.billingEmail && (
                                    <span className="form-error">{errors.billingEmail}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="sameEmail"
                                        checked={formData.sameEmail}
                                        onChange={handleChange}
                                    />
                                    <span>Billing Owner and System Admin are the same person</span>
                                </label>
                            </div>

                            {!formData.sameEmail && (
                                <div className="form-group animate-fadeIn">
                                    <label className="form-label">
                                        Admin Email
                                        <span className="form-hint">This will be the System Administrator account</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="adminEmail"
                                        className="form-input"
                                        placeholder="admin@company.com"
                                        value={formData.adminEmail}
                                        onChange={handleChange}
                                    />
                                    {errors.adminEmail && (
                                        <span className="form-error">{errors.adminEmail}</span>
                                    )}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-lg subscribe-btn">
                                Proceed to Payment
                            </button>
                        </form>
                    </div>

                    <div className="subscribe-summary card card-glass animate-slideUp">
                        <h3>Order Summary</h3>
                        <div className="summary-plan">
                            <span className="summary-plan-name">{plan.name} Plan</span>
                            <span className="summary-plan-price">${plan.price}/mo</span>
                        </div>
                        <ul className="summary-details">
                            <li>Up to {plan.seats} users</li>
                            <li>14-day free trial</li>
                            <li>Cancel anytime</li>
                        </ul>
                        <div className="summary-total">
                            <span>Total today</span>
                            <span>$0.00</span>
                        </div>
                        <p className="summary-note">
                            You won't be charged until your trial ends
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
