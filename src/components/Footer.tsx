import './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="url(#footerLogoGradient)" />
                                <path d="M8 10h16M8 16h12M8 22h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="32" y2="32">
                                        <stop stopColor="#6366F1" />
                                        <stop offset="1" stopColor="#0EA5E9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span>ERP System</span>
                        </div>
                        <p className="footer-tagline">
                            Streamline your business operations with our enterprise-grade ERP solution.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h5>Product</h5>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#">Documentation</a>
                        </div>
                        <div className="footer-section">
                            <h5>Company</h5>
                            <a href="#">About</a>
                            <a href="#">Contact</a>
                            <a href="#">Careers</a>
                        </div>
                        <div className="footer-section">
                            <h5>Legal</h5>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ERP System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
