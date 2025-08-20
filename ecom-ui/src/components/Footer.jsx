import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFileContract, FaUserShield, FaCookieBite, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/privacy-policy', icon: <FaUserShield />, label: 'Privacy Policy' },
  { to: '/terms-and-conditions', icon: <FaFileContract />, label: 'Terms & Conditions' },
  { to: '/cookies-policy', icon: <FaCookieBite />, label: 'Cookies Policy' },
  { to: '/risk-disclosure', icon: <FaExclamationTriangle />, label: 'Risk Disclosure' },
];

const Footer = () => (
  <footer style={{
    background: 'linear-gradient(135deg, #f472b6 0%, #6366f1 60%, #fbbf24 100%)',
    color: '#fff',
    padding: '48px 0 0 0',
    marginTop: '40px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Subtle pattern overlay for beauty */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.08,
      background: 'url("https://www.transparenttextures.com/patterns/diamond-upholstery.png") repeat',
      pointerEvents: 'none',
      zIndex: 0
    }} />
    <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32 }}>
        <div className="col" style={{ flex: '1 1 220px', minWidth: 220 }}>
          <h3 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: '#fbbf24', letterSpacing: 1 }}>wolverine house</h3>
          <p style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 0 }}>- Your gateway to smarter shopping and a better life.
<br /> - Where great deals meet everyday living.
<br /> - Buy better. Live brighter.
<br /> - Smart choices, seamless shopping, simple life.
<br /> - Redefining how you shop—and how you live.</p>
        </div>
        <div className="col" style={{ flex: '1 1 220px', minWidth: 220 }}>
          <h5 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#fbbf24' }}>Legal</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {footerLinks.map(link => (
              <li key={link.to} style={{ marginBottom: 10 }}>
                <Link to={link.to} style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                  {link.icon} {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col" style={{ flex: '1 1 220px', minWidth: 220 }}>
          <h5 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#fbbf24' }}>Contact Us</h5>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1', fontSize: 16 }}>
            <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FaMapMarkerAlt /> 123 Main St, New York, NY, USA</li>
            <li style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><FaPhoneAlt /> +1(323)652-8958</li>
           
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #475569', marginTop: 32, padding: '16px 0', textAlign: 'center', color: '#cbd5e1', fontSize: 15 }}>
        &copy; 2015 wolverinehouse. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
