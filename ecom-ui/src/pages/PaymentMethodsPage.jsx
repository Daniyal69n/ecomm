import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderStats } from '../services/orderService';
import SellerBalanceCard from '../components/SellerBalanceCard';
import PaymentMethodsCard from '../components/PaymentMethodsCard';

const PaymentMethodsPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const statsData = await getOrderStats();
      setStats(statsData);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchData();
  }, [currentUser?.role, fetchData, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Payment Methods</h2>
          <p className="text-muted mb-0">Manage your withdrawals and payment options</p>
        </div>
        <div className="text-muted">
          Welcome back, {currentUser?.name}!
        </div>
      </div>

      {error && (
        <div 
          className="error-message mb-4"
          style={{
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '1px solid #f87171',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            boxShadow: '0 8px 25px rgba(248, 113, 113, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="d-flex align-items-center">
            <div 
              className="me-3"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <i 
                className="fas fa-exclamation-triangle" 
                style={{ 
                  fontSize: '1.5rem',
                  color: '#dc2626'
                }}
              ></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold" style={{ color: '#b91c1c' }}>
                Error Loading Data
              </h6>
              <p className="mb-0" style={{ 
                color: '#7f1d1d',
                fontSize: '0.95rem',
                lineHeight: '1.4'
              }}>
                {error}
              </p>
            </div>
            <button
              onClick={() => setError('')}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <i className="fas fa-times" style={{ 
                fontSize: '0.9rem',
                color: '#dc2626'
              }}></i>
            </button>
          </div>
          <div 
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '100px',
              height: '100px',
              background: 'rgba(239, 68, 68, 0.05)',
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}
          ></div>
        </div>
      )}

      {/* Balance Card */}
      <div className="mb-4">
        {/* Calculate acceptedProfit from stats.orders if available, else fallback to stats.acceptedProfit */}
        <SellerBalanceCard 
          stats={stats} 
          acceptedProfit={
            Array.isArray(stats.orders)
              ? stats.orders.filter(order => order.sellerResponse === 'accepted' && order.status !== 'delivered').reduce((sum, order) => sum + (order.totalProfit || 0), 0)
              : (stats.acceptedProfit || 0)
          }
        />
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 g-md-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <div 
            className="card text-white h-100 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title text-white-50 mb-2 fw-medium" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)' }}>
                    Credit Balance
                  </h6>
                  <h3 className="text-white fw-bold mb-0" style={{ fontSize: 'clamp(1rem, 5vw, 1.8rem)' }}>
                    {formatCurrency(stats?.creditAmount || 0)}
                  </h3>
                </div>
                <div 
                  className="ms-2 ms-md-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-wallet" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}></i>
                </div>
              </div>
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }}
            ></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div 
            className="card text-white h-100 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(252, 182, 159, 0.3)',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(252, 182, 159, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(252, 182, 159, 0.3)';
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ 
                    color: 'rgba(139, 69, 19, 0.8)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)'
                  }}>
                    Pending Amount
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ 
                    color: '#8b4513',
                    fontSize: 'clamp(1rem, 5vw, 1.8rem)' 
                  }}>
                    {formatCurrency(stats?.pendingAmount || 0)}
                  </h3>
                </div>
                <div 
                  className="ms-2 ms-md-3"
                  style={{
                    background: 'rgba(139, 69, 19, 0.2)',
                    borderRadius: '12px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-hourglass-half" style={{ 
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    color: '#8b4513'
                  }}></i>
                </div>
              </div>
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '80px',
                height: '80px',
                background: 'rgba(139, 69, 19, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }}
            ></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div 
            className="card text-white h-100 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(168, 237, 234, 0.3)',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 237, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 237, 234, 0.3)';
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ 
                    color: 'rgba(34, 139, 34, 0.8)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)'
                  }}>
                    Total Profit
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ 
                    color: '#228b22',
                    fontSize: 'clamp(1rem, 5vw, 1.8rem)' 
                  }}>
                    {formatCurrency(stats.totalProfit || 0)}
                  </h3>
                </div>
                <div 
                  className="ms-2 ms-md-3"
                  style={{
                    background: 'rgba(34, 139, 34, 0.2)',
                    borderRadius: '12px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-chart-line" style={{ 
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    color: '#228b22'
                  }}></i>
                </div>
              </div>
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '80px',
                height: '80px',
                background: 'rgba(34, 139, 34, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }}
            ></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div 
            className="card text-white h-100 border-0"
            style={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(250, 112, 154, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.3)';
            }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)'
                  }}>
                    Total Orders
                  </h6>
                  <h3 className="text-white fw-bold mb-0" style={{ fontSize: 'clamp(1rem, 5vw, 1.8rem)' }}>
                    {stats.totalOrders || 0}
                  </h3>
                </div>
                <div 
                  className="ms-2 ms-md-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: 'clamp(8px, 2vw, 12px)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-shopping-cart" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}></i>
                </div>
              </div>
            </div>
            <div 
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Payment Methods Component */}
      <PaymentMethodsCard stats={stats} formatCurrency={formatCurrency} />

      {/* Payment History Section */}
      <div className="card" style={{ 
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="card-header" style={{ 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '20px 20px 0 0',
          border: 'none',
          padding: '1.5rem 2rem'
        }}>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i className="fas fa-history" style={{ 
                fontSize: '1.5rem',
                color: '#6366f1'
              }}></i>
            </div>
            <div>
              <h5 className="card-title mb-1 fw-bold">Payment History</h5>
              <p className="text-muted mb-0 small">Track your withdrawal requests and transactions</p>
            </div>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="text-center py-5">
            <i className="fas fa-clock fa-3x text-muted mb-3"></i>
            <h6 className="text-muted">No payment history yet</h6>
            <p className="text-muted small mb-0">Your withdrawal requests and payment history will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
