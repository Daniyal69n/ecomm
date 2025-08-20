import React from 'react';
import { showError } from '../components/toast';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('alfauser'));

// Navigation handlers
const goLanding = () => window.location.href = '/';
const goDashboard = () => {
  if (!user) {
    window.location.href = '/login';
    return;
  }
  if (user.role === 'admin') window.location.href = '/admin';
  else if (user.role === 'seller') window.location.href = '/seller';
};
const goHome = () => window.location.href = '/';

const MobileBottomBar = () => (
  <div className="mobile-bottom-bar" style={{ display: 'block' }}>
    <button className="bar-btn" onClick={goLanding}>
      <span className="icon">
        {/* Home SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 4L21 10.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10.5Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <span className="bar-label">Home</span>
    </button>
    <button className="bar-btn" onClick={() => showError('This service is not available in your region. Please contact Support.') }>
      <span className="icon">
        {/* Categories SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="6.5" cy="6.5" r="3.5" stroke="#374151" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="3.5" stroke="#374151" strokeWidth="2"/><circle cx="12" cy="17.5" r="3.5" stroke="#374151" strokeWidth="2"/></svg>
      </span>
      <span className="bar-label">Categories</span>
    </button>
    <button className="bar-btn" onClick={() => showError('This service is not available in your region. Please contact Support.') }>
      <span className="icon">
        {/* Cart SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6H21L20 14H7L6 6Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1" fill="#374151"/><circle cx="18" cy="20" r="1" fill="#374151"/></svg>
      </span>
      <span className="bar-label">Cart</span>
    </button>
    <button className="bar-btn" onClick={goDashboard}>
      <span className="icon">
        {/* User SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#374151" strokeWidth="2"/><path d="M4 20C4 16.6863 7.13401 14 11 14H13C16.866 14 20 16.6863 20 20" stroke="#374151" strokeWidth="2"/></svg>
      </span>
      <span className="bar-label">User</span>
    </button>
    <button className="bar-btn" onClick={() => showError('This service is not available in your region. Please contact Support.') }>
      <span className="icon">
        {/* Bell SVG */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 16V11C18 7.68629 15.3137 5 12 5C8.68629 5 6 7.68629 6 11V16L4 18V19H20V18L18 16Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="21" r="1" fill="#374151"/></svg>
      </span>
      <span className="bar-label">Info</span>
    </button>
  </div>
);

export default MobileBottomBar;
