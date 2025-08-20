import React from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
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
          Terms & Conditions
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
          Welcome to <span style={{ color: '#fbbf24', fontWeight: 700 }}>wolverine house</span>. By accessing or using our website, you agree to be bound by these terms and conditions.
        </p>
        <h2 style={{ color: '#fbbf24', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginTop: 32 }}>Use of Our Service</h2>
        <ul style={{ marginBottom: 20, marginLeft: 24 }}>
          <li>You must be at least 18 years old to use our services.</li>
          <li>All information provided must be accurate and up to date.</li>
          <li>Do not misuse our services or attempt unauthorized access.</li>
        </ul>
        <h2 style={{ color: '#fbbf24', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginTop: 32 }}>Orders & Payments</h2>
        <ul style={{ marginBottom: 20, marginLeft: 24 }}>
          <li>All orders are subject to acceptance and availability.</li>
          <li>Prices and availability are subject to change without notice.</li>
          <li>We reserve the right to refuse or cancel any order.</li>
        </ul>
        <h2 style={{ color: '#fbbf24', fontWeight: 700, fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', marginTop: 32 }}>Limitation of Liability</h2>
        <ul style={{ marginBottom: 20, marginLeft: 24 }}>
          <li>wolverine house is not liable for any indirect, incidental, or consequential damages.</li>
          <li>Our liability is limited to the maximum extent permitted by law.</li>
        </ul>
        <p style={{ marginTop: 32 }}>
          For any questions regarding these terms, please contact us at <span style={{ color: '#fbbf24', fontWeight: 700 }}>support@wolverine house.com</span>.
        </p>
      </div>
    <Footer />
    </div>
  );
};

export default TermsAndConditions;
