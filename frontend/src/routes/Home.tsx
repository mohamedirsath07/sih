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
                        <li><Link to="/quiz">Take the Aptitude Test</Link></li>
                        <li><Link to="/colleges">Find Nearby Colleges</Link></li>
                        <li><Link to="/scholarships">Explore Scholarships</Link></li>
                        <li><Link to="/timeline">Check Admission Timelines</Link></li>
                        <li><Link to="/profile">Your Profile</Link></li>
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