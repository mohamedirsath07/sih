import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="sgp-footer">
            <div className="sgp-footer__inner">
                <span>&copy; {new Date().getFullYear()} Student Guidance Platform</span>
                <nav className="sgp-footer__links">
                    <a href="/privacy-policy">Privacy</a>
                    <a href="/terms-of-service">Terms</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;