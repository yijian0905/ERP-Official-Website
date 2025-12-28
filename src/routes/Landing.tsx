import { useNavigate } from 'react-router-dom';
import { PricingCard } from '@/components/PricingCard';
import { savePendingSubscription } from '@/store/mockDatabase';
import './Landing.css';

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: 49,
        seatLimit: 5,
        features: [
            'Core ERP Features',
            'Inventory Management',
            'E-Invoice Submission (LHDN)',
            'Basic Reporting',
            'Email Support',
            'Up to 5 Users',
        ],
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 149,
        seatLimit: 20,
        popular: true,
        features: [
            'Everything in Basic',
            'Advanced E-Invoice (Auto-sync)',
            'Credit/Debit Note Support',
            'Multi-location Support',
            'API Access',
            'Priority Support',
            'Up to 20 Users',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 399,
        seatLimit: 100,
        features: [
            'Everything in Professional',
            'Self-Billed Invoice Support',
            'Bulk E-Invoice Processing',
            'Dedicated Account Manager',
            'SLA Guarantee',
            'On-premise Option',
            'Up to 100 Users',
        ],
    },
];

export function Landing() {
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        savePendingSubscription({
            billingEmail: '',
            billingName: '',
            adminEmail: '',
            adminName: '',
            sameEmail: false,
            selectedPlan: planId,
            organizationName: '',
        });
        navigate('/subscribe');
    };

    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero glow-bg">
                <div className="container">
                    <div className="hero-content animate-slideUp">
                        <div className="hero-badges">
                            <div className="hero-badge lhdn-badge">🇲🇾 LHDN e-Invoice Ready</div>
                            <div className="hero-badge">🚀 Enterprise-Grade ERP Solution</div>
                        </div>
                        <h1 className="hero-title">
                            Malaysia's <span className="text-gradient">E-Invoice Compliant</span> ERP System
                        </h1>
                        <p className="hero-description">
                            Be ready for LHDN's mandatory e-Invoice requirements.
                            Our all-in-one ERP system ensures your business stays compliant
                            while streamlining inventory, sales, and financial operations.
                        </p>
                        <div className="compliance-note">
                            <span className="compliance-icon">✅</span>
                            <span>Compliant with LHDN MyInvois API • Real-time validation • QR code generation</span>
                        </div>
                        <div className="hero-actions">
                            <a href="#pricing" className="btn btn-primary btn-lg">
                                View Pricing
                            </a>
                            <a href="#einvoice" className="btn btn-secondary btn-lg">
                                Learn About E-Invoice
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section features">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Powerful Features</h2>
                        <p className="text-muted text-lg mt-2">
                            Everything you need to run your business efficiently
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">🧾</div>
                            <h4>E-Invoice (LHDN)</h4>
                            <p>Automatic submission to MyInvois, real-time validation, and QR code generation.</p>
                        </div>
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">📦</div>
                            <h4>Inventory Management</h4>
                            <p>Track stock levels, manage warehouses, and automate reordering.</p>
                        </div>
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">💰</div>
                            <h4>Sales & Invoicing</h4>
                            <p>Create quotes, process orders, and generate professional invoices.</p>
                        </div>
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">🛒</div>
                            <h4>Purchasing</h4>
                            <p>Manage suppliers, create purchase orders, and track deliveries.</p>
                        </div>
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">📊</div>
                            <h4>Analytics & Reports</h4>
                            <p>Get insights with real-time dashboards and detailed reports.</p>
                        </div>
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">👥</div>
                            <h4>Team Management</h4>
                            <p>Role-based access control and activity tracking.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* E-Invoice Section */}
            <section id="einvoice" className="section einvoice-section glow-bg">
                <div className="container">
                    <div className="section-header text-center">
                        <div className="lhdn-logo">🇲🇾</div>
                        <h2>Malaysia E-Invoice <span className="text-gradient">Compliance</span></h2>
                        <p className="text-muted text-lg mt-2">
                            Be ready for LHDN's mandatory e-Invoice requirements
                        </p>
                    </div>

                    <div className="einvoice-timeline">
                        <div className="timeline-item">
                            <div className="timeline-date">Aug 2024</div>
                            <div className="timeline-content card card-glass">
                                <h4>Phase 1</h4>
                                <p>Revenue &gt; RM100M</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-date">Jan 2025</div>
                            <div className="timeline-content card card-glass">
                                <h4>Phase 2</h4>
                                <p>Revenue &gt; RM25M</p>
                            </div>
                        </div>
                        <div className="timeline-item active">
                            <div className="timeline-date">Jul 2025</div>
                            <div className="timeline-content card card-glass">
                                <h4>Phase 3</h4>
                                <p>All businesses</p>
                            </div>
                        </div>
                    </div>

                    <div className="einvoice-features">
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>MyInvois API Integration</span>
                        </div>
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>Real-time Validation</span>
                        </div>
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>QR Code Generation</span>
                        </div>
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>Credit/Debit Notes</span>
                        </div>
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>Self-billed Invoices</span>
                        </div>
                        <div className="einvoice-feature">
                            <span className="check-icon">✓</span>
                            <span>SST/Service Tax Ready</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="section pricing">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Simple, Transparent Pricing</h2>
                        <p className="text-muted text-lg mt-2">
                            Choose the plan that fits your business needs
                        </p>
                    </div>

                    <div className="pricing-grid">
                        {PLANS.map((plan) => (
                            <PricingCard
                                key={plan.id}
                                name={plan.name}
                                price={plan.price}
                                seatLimit={plan.seatLimit}
                                features={plan.features}
                                popular={plan.popular}
                                onSelect={() => handleSelectPlan(plan.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta glow-bg">
                <div className="container">
                    <div className="cta-content text-center">
                        <h2>Ready to Transform Your Business?</h2>
                        <p className="text-muted text-lg mt-2 mb-6">
                            Start your journey today with a 14-day free trial
                        </p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => handleSelectPlan('pro')}
                        >
                            Start Free Trial
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
