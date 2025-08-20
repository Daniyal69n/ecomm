import React from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const RiskDisclosure = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #fbbf24 0%, #f8fafc 100%)', padding: 0, margin: 0 }}>
      <div style={{
        width: '100%',
        background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
        color: '#fff',
        padding: '24px 0 20px 0',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 2px 12px rgba(30,41,59,0.06)',
        flexDirection: 'row',
        gap: 16,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: '#fbbf24',
            color: '#1e293b',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(30,41,59,0.10)',
            transition: 'background 0.2s',
            zIndex: 2,
            marginRight: 12,
            marginLeft: 12,
            position: 'static',
            transform: 'none',
            marginBottom: 0,
          }}
        >
          &larr; Back
        </button>
        <span style={{
          fontWeight: 900,
          fontSize: 'clamp(1.2rem, 4vw, 2.1rem)',
          letterSpacing: 1,
          textAlign: 'center',
          flex: 1,
          marginLeft: 0,
        }}>
          Risk Disclosure
        </span>
        <style>{`
          @media (max-width: 600px) {
            .policy-header-flex {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 8px !important;
              padding: 16px 0 12px 0 !important;
            }
            .policy-header-flex span {
              font-size: 1.1rem !important;
              margin-left: 0 !important;
            }
            .policy-header-flex button {
              margin-bottom: 4px !important;
            }
          }
        `}</style>
      </div>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 32px rgba(30,41,59,0.10)',
        padding: 'clamp(20px, 5vw, 48px)',
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        lineHeight: 1.7,
        color: '#334155',
        marginBottom: 40
      }}>
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', marginBottom: 20 }}>
          At <span style={{ color: '#fbbf24', fontWeight: 700 }}>wolverine house</span>, we strive to provide a safe and reliable shopping experience. However, all online activities carry certain risks.
        </p>
        <h2 style={{ color: '#fbbf24', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginTop: 32 }}>General Risks</h2>
        <ul style={{ marginBottom: 20, marginLeft: 24 }}>
          <li>Product availability and pricing may change without notice.</li>
          <li>There is a risk of delayed deliveries due to unforeseen circumstances.</li>
          <li>Online transactions may be subject to technical issues or security risks.</li>
        </ul>
        <h2 style={{ color: '#fbbf24', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginTop: 32 }}>Your Responsibilities</h2>
        <ul style={{ marginBottom: 20, marginLeft: 24 }}>
          <li>Keep your account information secure.</li>
          <li>Review product details and policies before making a purchase.</li>
          <li>Contact us immediately if you suspect any unauthorized activity.</li>
        </ul>
        <p style={{ marginTop: 32 }}>
          For questions or concerns, please reach out to <span style={{ color: '#fbbf24', fontWeight: 700 }}>support@wolverine house.com</span>.
        </p>
      </div>
    <Footer />
    </div>
  );
};

export default RiskDisclosure;
