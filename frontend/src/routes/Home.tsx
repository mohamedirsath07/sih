import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have a CSS file for styling

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to the Student Guidance Platform</h1>
                <p>Your one-stop solution for career and education guidance.</p>
            </header>
            <main className="home-content">
                <section className="home-intro">
                    <h2>Explore Your Future</h2>
                    <p>Discover the right subject streams, degree programs, and career paths tailored to your interests and strengths.</p>
                </section>
                <section className="home-links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li>
                            <Link to="/quiz">
                                <span className="link-content">
                                    <span className="link-icon">🎯</span>
                                    <span className="link-text">Take the Aptitude Test</span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/colleges">
                                <span className="link-content">
                                    <span className="link-icon">🏫</span>
                                    <span className="link-text">Find Nearby Colleges</span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/scholarships">
                                <span className="link-content">
                                    <span className="link-icon">💰</span>
                                    <span className="link-text">Explore Scholarships</span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/timeline">
                                <span className="link-content">
                                    <span className="link-icon">📅</span>
                                    <span className="link-text">Check Admission Timelines</span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile">
                                <span className="link-content">
                                    <span className="link-icon">👤</span>
                                    <span className="link-text">Your Profile</span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </section>
            </main>
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Student Guidance Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;