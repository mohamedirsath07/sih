import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="sgp-header">
            <div className="sgp-header__inner">
                <Link to="/" className="sgp-header__brand">Student Guidance</Link>
                <nav className="sgp-header__nav">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/quiz">Quiz</NavLink>
                    <NavLink to="/colleges">Colleges</NavLink>
                    <NavLink to="/scholarships">Scholarships</NavLink>
                    <NavLink to="/timeline">Timeline</NavLink>
                    <NavLink to="/chatbot">Chatbot</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    <NavLink to="/login" className="sgp-header__login">Login</NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;