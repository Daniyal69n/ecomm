import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCross } from 'react-icons/fa6';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SellerBalanceCard = ({ stats, acceptedProfit }) => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const [balance, setBalance] = useState({ creditAmount: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);
  // Defensive: always use a fallback object for stats
  const safeStats = stats || {};
 
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${currentUser?.token}` }
        });
        setBalance({
          creditAmount: response.data.creditAmount || 0,
          pendingAmount: response.data.pendingAmount || 0
        });
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchBalance();
    }
  }, [currentUser?.token]);

  if (loading) {
    return (
      <div 
        className="card border-0"
        style={{ 
          background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
          borderRadius: '24px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="card-body text-center py-5">
          <div 
            className="spinner-border"
            style={{ color: '#667eea' }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
              <p className="text-muted mt-3 mb-0" style={{ display: 'none' }}>Loading balance...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div 
      className="card border-0 mb-4"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Header Section */}
      <div className="card-header border-0" style={{ background: 'transparent', padding: '2rem 2rem 1rem' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <div 
              className="me-3"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <i className="fas fa-wallet text-white" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}></i>
            </div>
            <div>
              <h4 className="text-white fw-bold mb-1" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
                Account Balance
              </h4>
              <p className="text-white-50 mb-0 small">Your earnings overview</p>
            </div>
          </div>
          {/* <div className="text-end">
            <p className="text-white-50 mb-1 small fw-medium">Total Balance</p>
            <h3 className="text-white fw-bold mb-0" style={{ 
              fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
                {formatCurrency(balance.creditAmount + balance.pendingAmount + (safeStats.totalProfit || 0))}
            </h3>
          </div> */}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="card-body" style={{ padding: '1rem 2rem 2rem' }}>
        <div className="row g-3 g-md-4">
          {/* Available Balance */}
          <div className="col-12 col-md-6">
            <div 
              className="h-100 p-4 text-center"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div 
                className="mx-auto mb-3"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(34, 197, 94, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-coins text-white fs-4"></i>
              </div>
              <h6 className="text-white-75 mb-2 fw-medium" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
                Available Balance
              </h6>
              <h3 className="text-white fw-bold mb-2" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>
                {formatCurrency(balance.creditAmount)}
              </h3>
              <small className="text-white-50 fw-medium">Ready for new orders</small>
              
              {/* Decorative element */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-30%',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }}
              ></div>
            </div>
          </div>

          {/* Pending Balance */}
          <div className="col-12 col-md-6">
            <div 
              className="h-100 p-4 text-center"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div 
                className="mx-auto mb-3"
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(251, 191, 36, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-clock text-white fs-4"></i>
              </div>
              <h6 className="text-white-75 mb-2 fw-medium" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
                Pending Balance 
              </h6>
              <h3 className="text-white fw-bold mb-2" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)' }}>
                {formatCurrency(balance.pendingAmount + (acceptedProfit || 0))}
              </h3>
             
              
              {/* Decorative element */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-30%',
                  width: '60px',
                  height: '60px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Low Balance Warning */}
        {balance.creditAmount < 50 && (
          <div 
            className="mt-4 p-3 d-flex align-items-center"
            style={{ 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 101, 101, 0.15) 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div 
              className="me-3"
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(239, 68, 68, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-exclamation-triangle text-white"></i>
            </div>
            <div className="flex-grow-1">
            {/* User-facing warning message removed */}
            <h6 className="text-white fw-bold mb-1" style={{ display: 'none' }}>Low Balance Warning</h6>
            <small className="text-white-75" style={{ display: 'none' }}>Your balance is low. Please recharge to accept new orders.</small>
            </div>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-20%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      ></div>
    </div>
  );
};

export default SellerBalanceCard;
