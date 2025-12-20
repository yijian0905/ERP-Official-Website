import './PricingCard.css';

interface PricingCardProps {
    name: string;
    price: number;
    period?: string;
    features: string[];
    seatLimit: number;
    popular?: boolean;
    onSelect: () => void;
}

export function PricingCard({
    name,
    price,
    period = '/month',
    features,
    seatLimit,
    popular = false,
    onSelect,
}: PricingCardProps) {
    return (
        <div className={`pricing-card ${popular ? 'pricing-card-popular' : ''}`}>
            {popular && <div className="pricing-badge">Most Popular</div>}

            <div className="pricing-header">
                <h3 className="pricing-name">{name}</h3>
                <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    <span className="pricing-amount">{price}</span>
                    <span className="pricing-period">{period}</span>
                </div>
                <p className="pricing-seats">Up to {seatLimit} users</p>
            </div>

            <ul className="pricing-features">
                {features.map((feature, index) => (
                    <li key={index}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M16.667 5L7.5 14.167 3.333 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                className={`btn ${popular ? 'btn-primary' : 'btn-secondary'} pricing-btn`}
                onClick={onSelect}
            >
                Get Started
            </button>
        </div>
    );
}
