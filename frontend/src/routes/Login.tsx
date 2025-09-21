import React, { useState } from 'react';
import { login, me } from '../utils/api';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, district || undefined);
      const info = await me();
      setStatus(`Signed in as ${info.username}${info.district ? ' · ' + info.district : ''}`);
      // small delay then navigate
      setTimeout(() => navigate('/profile'), 300);
    } catch (err) {
      setStatus('Login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="muted">Use any username. District helps personalize colleges and scholarships.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <label htmlFor="username">Username</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="e.g. Ayesha" />

          <label htmlFor="district">District (optional)</label>
          <input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Srinagar" />

          <button type="submit" className="auth-btn">Sign in</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
};

export default Login;
