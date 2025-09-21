import React, { useEffect, useState } from 'react';
import { me } from '../utils/api';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await me();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="profile-wrap">
            <div className="profile-card">
                <h1>Profile</h1>
                {profile ? (
                    <div className="profile-details">
                        <div className="row"><span className="k">Username</span><span className="v">{profile.username}</span></div>
                        <div className="row"><span className="k">District</span><span className="v">{profile.district || '—'}</span></div>
                    </div>
                ) : (
                    <p>No profile data available.</p>
                )}
                <div className="profile-actions">
                    <button className="btn" onClick={logout}>Sign out</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;