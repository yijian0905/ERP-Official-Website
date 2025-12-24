import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingSubscription, savePendingSubscription } from '@/store/mockDatabase';
import { countries, DEFAULT_COUNTRY, getLocaleSettings } from '@/data/countries';
import './Subscribe.css';

const PLAN_DETAILS: Record<string, { name: string; price: number; seats: number }> = {
    basic: { name: 'Basic', price: 49, seats: 5 },
    pro: { name: 'Professional', price: 149, seats: 20 },
    enterprise: { name: 'Enterprise', price: 399, seats: 100 },
};

export function Subscribe() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Plan
        selectedPlan: 'pro',
        // Step 2: Account
        name: '',
        email: '',
        // Step 3: Organization
        organizationName: '',
        // Step 4: Billing Address
        billingCountry: DEFAULT_COUNTRY,
        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingState: '',
        billingPostcode: '',
        taxId: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const pending = getPendingSubscription();
        if (pending) {
            setFormData(prev => ({
                ...prev,
                selectedPlan: pending.selectedPlan || 'pro',
                name: pending.billingName || '',
                email: pending.billingEmail || '',
                organizationName: pending.organizationName || '',
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                // Plan selection - always valid
                break;
            case 2:
                if (!formData.name.trim()) {
                    newErrors.name = 'Name is required';
                }
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                }
                break;
            case 3:
                if (!formData.organizationName.trim()) {
                    newErrors.organizationName = 'Organization name is required';
                }
                break;
            case 4:
                if (!formData.billingCountry) {
                    newErrors.billingCountry = 'Country is required';
                }
                if (!formData.billingAddress1.trim()) {
                    newErrors.billingAddress1 = 'Address is required';
                }
                if (!formData.billingCity.trim()) {
                    newErrors.billingCity = 'City is required';
                }
                if (!formData.billingPostcode.trim()) {
                    newErrors.billingPostcode = 'Postcode is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step - save and go to payment
            const localeSettings = getLocaleSettings(formData.billingCountry);

            savePendingSubscription({
                selectedPlan: formData.selectedPlan,
                billingName: formData.name,
                billingEmail: formData.email,
                adminName: formData.name,
                adminEmail: formData.email,
                organizationName: formData.organizationName,
                sameEmail: true,
                // Extended billing address
                billingCountry: formData.billingCountry,
                billingAddress1: formData.billingAddress1,
                billingAddress2: formData.billingAddress2,
                billingCity: formData.billingCity,
                billingState: formData.billingState,
                billingPostcode: formData.billingPostcode,
                taxId: formData.taxId,
                // Locale settings
                defaultCurrency: localeSettings.currency,
                defaultTimezone: localeSettings.timezone,
            });

            navigate('/payment');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const plan = PLAN_DETAILS[formData.selectedPlan];

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content animate-fadeIn">
                        <h2>Choose Your Plan</h2>
                        <p className="step-subtitle">Select the plan that best fits your needs</p>

                        <div className="plan-options">
                            {Object.entries(PLAN_DETAILS).map(([key, planInfo]) => (
                                <label
                                    key={key}
                                    className={`plan-option ${formData.selectedPlan === key ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedPlan"
                                        value={key}
                                        checked={formData.selectedPlan === key}
                                        onChange={handleChange}
                                    />
                                    <div className="plan-option-content">
                                        <span className="plan-name">{planInfo.name}</span>
                                        <span className="plan-price">${planInfo.price}/mo</span>
                                        <span className="plan-seats">Up to {planInfo.seats} users</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content animate-fadeIn">
                        <h2>Create Your Account</h2>
                        <p className="step-subtitle">This will be your login credentials</p>

                        <div className="form-group">
                            <label className="form-label">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="you@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                            <span className="form-hint">You'll use this email to log in</span>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content animate-fadeIn">
                        <h2>Organization Details</h2>
                        <p className="step-subtitle">Tell us about your company</p>

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
                            {errors.organizationName && <span className="form-error">{errors.organizationName}</span>}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="step-content animate-fadeIn">
                        <h2>Billing Address</h2>
                        <p className="step-subtitle">This will be used for invoicing</p>

                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <select
                                name="billingCountry"
                                className="form-input"
                                value={formData.billingCountry}
                                onChange={handleChange}
                            >
                                {countries.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                            {errors.billingCountry && <span className="form-error">{errors.billingCountry}</span>}
                            <span className="form-hint">
                                Currency will be set to {getLocaleSettings(formData.billingCountry).currency}
                            </span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address Line 1</label>
                            <input
                                type="text"
                                name="billingAddress1"
                                className="form-input"
                                placeholder="Street address"
                                value={formData.billingAddress1}
                                onChange={handleChange}
                            />
                            {errors.billingAddress1 && <span className="form-error">{errors.billingAddress1}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address Line 2 <span className="optional">(optional)</span></label>
                            <input
                                type="text"
                                name="billingAddress2"
                                className="form-input"
                                placeholder="Apartment, suite, unit, etc."
                                value={formData.billingAddress2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Postcode</label>
                                <input
                                    type="text"
                                    name="billingPostcode"
                                    className="form-input"
                                    placeholder="47810"
                                    value={formData.billingPostcode}
                                    onChange={handleChange}
                                />
                                {errors.billingPostcode && <span className="form-error">{errors.billingPostcode}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="billingCity"
                                    className="form-input"
                                    placeholder="Petaling Jaya"
                                    value={formData.billingCity}
                                    onChange={handleChange}
                                />
                                {errors.billingCity && <span className="form-error">{errors.billingCity}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">State / Province <span className="optional">(optional)</span></label>
                            <input
                                type="text"
                                name="billingState"
                                className="form-input"
                                placeholder="Selangor"
                                value={formData.billingState}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-divider">
                            <span>Tax Information</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tax ID (SST/GST) <span className="optional">(optional)</span></label>
                            <input
                                type="text"
                                name="taxId"
                                className="form-input"
                                placeholder="Tax registration number"
                                value={formData.taxId}
                                onChange={handleChange}
                            />
                            <span className="form-hint">This will be synced to your ERP tax settings</span>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="subscribe-page">
            <div className="container">
                <div className="subscribe-content">
                    <div className="subscribe-form-wrapper card card-glass animate-slideUp">
                        {/* Step Indicator */}
                        <div className="step-indicator">
                            {[1, 2, 3, 4].map(step => (
                                <div
                                    key={step}
                                    className={`step-dot ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                                >
                                    <span className="step-number">{step}</span>
                                    <span className="step-label">
                                        {step === 1 && 'Plan'}
                                        {step === 2 && 'Account'}
                                        {step === 3 && 'Organization'}
                                        {step === 4 && 'Billing'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="subscribe-form">
                            {renderStep()}

                            <div className="form-actions">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleBack}
                                    >
                                        Back
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary">
                                    {currentStep < 4 ? 'Continue' : 'Proceed to Payment'}
                                </button>
                            </div>
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
