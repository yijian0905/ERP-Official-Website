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
            'Advanced Analytics',
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
            'Custom Integrations',
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
                        <div className="hero-badge">🚀 Enterprise-Grade ERP Solution</div>
                        <h1 className="hero-title">
                            Streamline Your <span className="text-gradient">Business Operations</span>
                        </h1>
                        <p className="hero-description">
                            All-in-one enterprise resource planning system designed for modern businesses.
                            Manage inventory, sales, purchasing, and more with ease.
                        </p>
                        <div className="hero-actions">
                            <a href="#pricing" className="btn btn-primary btn-lg">
                                View Pricing
                            </a>
                            <a href="#features" className="btn btn-secondary btn-lg">
                                Learn More
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
                        <div className="feature-card card card-glass card-hover">
                            <div className="feature-icon">🔌</div>
                            <h4>Integrations</h4>
                            <p>Connect with your favorite tools and services via API.</p>
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
