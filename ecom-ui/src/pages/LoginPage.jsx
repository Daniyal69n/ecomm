import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../src/assets/images/ecommerce1.png';
import { login } from '../services/authController';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginVerificationCode, setLoginVerificationCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggingIn = useRef(false);
  const hasRedirectedOnMount = useRef(false); // Track if we've already redirected

  useEffect(() => {
    // Only run once and only if we haven't already redirected
    if (hasRedirectedOnMount.current || isLoggingIn.current) return;
    
    // Mark that we've run the redirect check
    hasRedirectedOnMount.current = true;
    
    const user = JSON.parse(localStorage.getItem('alfauser'));
    if (user) {
      const role = user?.role?.toString().trim().toLowerCase();
      // Use window.location instead of navigate to avoid React state updates
      if (role === 'admin') {
        window.location.replace('/admin');
      }
      else if (role === 'seller' && user.approved) {
        window.location.replace('/seller');
      }
    }
  }, []); // Empty dependency array - run only once

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    isLoggingIn.current = true;
    try {
      const data = await login(email, password, loginVerificationCode);
      const user = data.user || data;
      if (user.role?.toString().trim().toLowerCase() === 'admin') {
        localStorage.setItem('alfauser', JSON.stringify(user));
        window.location.href = '/admin';
      } else if (user.role?.toString().trim().toLowerCase() === 'seller') {
        if (user.approved) {
          localStorage.setItem('alfauser', JSON.stringify(user));
          window.location.href = '/seller';
        } else {
          setError('Pending approval from admin. Please wait.');
          localStorage.removeItem('alfauser');
        }
      } else {
        setError('Invalid role or user data');
        localStorage.removeItem('alfauser');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      isLoggingIn.current = false;
    }
  };

  return (
    <div className="login-page">
      <div className="inner">
        <Link to="/" className="logo">
          <img src={Logo} alt="E-commerce Logo" />
        </Link>
        <h2 className="mb-4">Login</h2>
        {error && (
          <div className="alert alert-danger">
            {error}{' '}
            <button
              style={{
                textDecoration: 'none',
                color: '#111',
                fontWeight: '700',
                fontSize: '14px',
              }}
              className="btn btn-link p-0 ms-2"
              onClick={() => navigate('/')}
            >
              Visit Website
            </button>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Login Verification Code</label>
            <input type="text" className="form-control" value={loginVerificationCode} onChange={e => setLoginVerificationCode(e.target.value)} placeholder="Enter code if required" />
            <small className="text-muted">Ask admin for your login code if required.</small>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
          <div className="dont-have-account mt-3">
            <p>Don't have an account?  <Link to="/signup">Sign Up</Link> </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
