import React, { useState } from 'react';

const AuthCodeModal = ({ children }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem('signup_authcode') === 'auth321'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === 'auth321') {
      localStorage.setItem('signup_authcode', 'auth321');
      setUnlocked(true);
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  if (unlocked) return children;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <h3 style={{ marginBottom: 16, color: '#4f46e5', fontWeight: 700 }}>Enter Signup Invitation Code</h3>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter code..."
            value={code}
            onChange={e => { setCode(e.target.value); setError(''); }}
            style={{ fontSize: 18, textAlign: 'center', borderRadius: 8, border: '1px solid #ddd' }}
            autoFocus
          />
          {error && <div className="text-danger mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: 8, fontWeight: 600 }}>
            Unlock
          </button>
        </form>
        <div className="mt-3 text-muted" style={{ fontSize: 13 }}>
          Please enter the authentication code to access signup.
        </div>
      </div>
    </div>
  );
};

export default AuthCodeModal;
