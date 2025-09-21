import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    // Basic validation
    if (!email || !password) {
      setStatus('Please enter email and password');
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setStatus('Passwords do not match');
      setLoading(false);
      return;
    }

    if (isSignUp && !name) {
      setStatus('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Simulate account creation
        setStatus('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setLoading(false);
        return;
      } else {
        // Create a simple session for demo
        const userData = {
          email,
          name: name || 'Demo User',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userSession', JSON.stringify(userData));
        setStatus('Login successful!');
        
        // Navigate to profile after a short delay
        setTimeout(() => {
          navigate('/profile');
        }, 500);
      }
    } catch (err) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setStatus('Google authentication will be available soon!');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
        <p className="muted">
          {isSignUp 
            ? 'Create a new account to get personalized college and scholarship recommendations.' 
            : 'Enter any email and password to access the demo. (Demo mode active)'
          }
        </p>
        
        <form onSubmit={onSubmit} className="auth-form">
          {isSignUp && (
            <>
              <label htmlFor="name">Full Name</label>
              <input 
                id="name" 
                type="text"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. John Doe" 
              />
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input 
            id="email" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="e.g. john@example.com" 
          />

          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
          />

          {isSignUp && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password" 
              />
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" className="google-btn" onClick={handleGoogleAuth}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-toggle">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="link-btn" 
                onClick={() => {
                  setIsSignUp(false);
                  setStatus('');
                }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button 
                type="button" 
                className="link-btn" 
                onClick={() => {
                  setIsSignUp(true);
                  setStatus('');
                }}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        {status && (
          <p className={`status ${status.includes('successful') || status.includes('created') ? 'success' : 'error'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
