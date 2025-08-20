import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderStats } from '../services/orderService';

const SellerProfile = () => {
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
      setError('Failed to load profile data');
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
          <h2>My Profile</h2>
          <p className="text-muted mb-0">Your personal information and business overview</p>
        </div>
        <div className="text-muted">
          <i className="fas fa-user me-2"></i>
          Seller Profile
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

      {/* Profile Information */}
      <div className="row g-4 mb-5">
        <div className="col-12">
          <div 
            className="card border-0"
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <div 
              className="card-header"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '2.5rem',
                color: 'white'
              }}
            >
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <div 
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <i className="fas fa-user fa-3x" style={{ color: 'white' }}></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h2 className="mb-3 fw-bold">{currentUser?.name || 'Seller Name'}</h2>
                  <div className="d-flex align-items-center mb-3 flex-wrap">
                    <span 
                      className="badge me-3 mb-2"
                      style={{
                        background: currentUser?.approved ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className={`fas ${currentUser?.approved ? 'fa-check-circle' : 'fa-clock'} me-2`}></i>
                      {currentUser?.approved ? 'Verified Account' : 'Pending Verification'}
                    </span>
                    <span 
                      className="badge mb-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <i className="fas fa-envelope me-2 opacity-75"></i>
                        <span className="fw-medium">{currentUser?.email || 'No email'}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div 
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <i className="fas fa-store me-2 opacity-75"></i>
                        <span className="fw-medium">{currentUser?.shopName || 'No shop name'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-3">
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
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title text-white-50 mb-2 fw-medium">
                    Credit Balance
                  </h6>
                  <h2 className="text-white fw-bold mb-0">
                    {formatCurrency(currentUser?.creditAmount || stats?.creditAmount || 0)}
                  </h2>
                </div>
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-wallet fa-lg"></i>
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

        <div className="col-12 col-md-6 col-lg-3">
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
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ color: 'rgba(34, 139, 34, 0.8)' }}>
                    Total Profit
                  </h6>
                  <h2 className="fw-bold mb-0" style={{ color: '#228b22' }}>
                    {formatCurrency(stats?.totalProfit || 0)}
                  </h2>
                </div>
                <div 
                  style={{
                    background: 'rgba(34, 139, 34, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-chart-line fa-lg" style={{ color: '#228b22' }}></i>
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

        <div className="col-12 col-md-6 col-lg-3">
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
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Total Orders
                  </h6>
                  <h2 className="text-white fw-bold mb-0">
                    {stats?.totalOrders || currentUser?.totalOrders || 0}
                  </h2>
                </div>
                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-shopping-cart fa-lg"></i>
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

        <div className="col-12 col-md-6 col-lg-3">
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
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="card-title mb-2 fw-medium" style={{ color: 'rgba(139, 69, 19, 0.8)' }}>
                    Pending Amount
                  </h6>
                  <h2 className="fw-bold mb-0" style={{ color: '#8b4513' }}>
                    {formatCurrency(
                      (currentUser?.pendingAmount || stats?.pendingAmount || 0) + 
                      (stats?.totalProfit || 0)
                    )}
                  </h2>
                </div>
                <div 
                  style={{
                    background: 'rgba(139, 69, 19, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <i className="fas fa-hourglass-half fa-lg" style={{ color: '#8b4513' }}></i>
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
      </div>
    </div>
  );
};

export default SellerProfile;
