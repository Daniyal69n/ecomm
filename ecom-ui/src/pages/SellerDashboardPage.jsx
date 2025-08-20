import React, { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError } from '../components/toast';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders, getOrderStats, sellerOrderResponse, getOrderById } from '../services/orderService';
import OrderDetailsModal from '../components/OrderDetailsModal';
import SellerBalanceCard from '../components/SellerBalanceCard';

const SellerDashboardPage = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    accountDetails: '',
    email: '',
    walletAddress: '',
    accountNumber: '',
    routingNumber: '',
    notes: ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getOrders(),
        getOrderStats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
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

  const handleOrderResponse = async (orderId, response, rejectionReason = '') => {
    try {
      setProcessingOrderId(orderId);
      await sellerOrderResponse(orderId, response, rejectionReason);
      fetchData(); // Refresh data
      showSuccess(`Order ${response} successfully!`);
    } catch (error) {
      console.error('Error responding to order:', error);
      showError(error.response?.data?.message || `Failed to ${response} order`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const orderData = await getOrderById(orderId);
      setSelectedOrder(orderData);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      showError('Failed to load order details');
    }
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handlePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setShowWithdrawForm(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const closeWithdrawForm = () => {
    setShowWithdrawForm(false);
    setSelectedPaymentMethod(null);
    setWithdrawalData({
      amount: '',
      accountDetails: '',
      email: '',
      walletAddress: '',
      accountNumber: '',
      routingNumber: '',
      notes: ''
    });
  };

  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    
    const availableCredit = stats?.creditAmount || 0;
    const withdrawAmount = parseFloat(withdrawalData.amount);
    
    if (withdrawAmount > availableCredit) {
      showError('Withdrawal amount cannot exceed available credit balance.');
      return;
    }
    
    if (withdrawAmount < 10) {
      showError('Minimum withdrawal amount is $10.');
      return;
    }
    
    // Show payment method not available message
    showError('Sorry, this payment method is not available in your region at the moment. Please contact our support team for assistance or try another payment method.');
    closeWithdrawForm();
  };

  const handleInputChange = (field, value) => {
    setWithdrawalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPaymentMethodConfig = (method) => {
    const configs = {
      paypal: {
        title: 'PayPal Withdrawal',
        icon: 'fab fa-paypal',
        fields: ['email'],
        minAmount: 10,
        processingTime: '1-2 business days'
      },
      stripe: {
        title: 'Bank Transfer (Stripe)',
        icon: 'fab fa-stripe',
        fields: ['accountNumber', 'routingNumber'],
        minAmount: 25,
        processingTime: '3-5 business days'
      },
      wise: {
        title: 'Wise International Transfer',
        icon: 'fas fa-university',
        fields: ['accountDetails'],
        minAmount: 20,
        processingTime: '1-3 business days'
      },
      
      skrill: {
        title: 'Skrill E-wallet',
        icon: 'fas fa-credit-card',
        fields: ['email'],
        minAmount: 15,
        processingTime: '1-2 business days'
      },
      neteller: {
        title: 'Neteller Digital Wallet',
        icon: 'fas fa-wallet',
        fields: ['email'],
        minAmount: 15,
        processingTime: '1-2 business days'
      },
      perfectmoney: {
        title: 'Perfect Money',
        icon: 'fas fa-money-check-alt',
        fields: ['accountDetails'],
        minAmount: 10,
        processingTime: 'Within 24 hours'
      },
      webmoney: {
        title: 'WebMoney',
        icon: 'fas fa-globe',
        fields: ['accountDetails'],
        minAmount: 20,
        processingTime: 'Within 24 hours'
      }
    };
    return configs[method] || {};
  };

  const handleAcceptOrder = (orderId) => {
    const confirmMessage = 'Are you sure you want to accept this order? The order amount will be deducted from your credit balance.';
    if (window.confirm(confirmMessage)) {
      handleOrderResponse(orderId, 'accepted');
    }
  };

  const handleRejectOrder = (orderId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) { // User didn't cancel
      handleOrderResponse(orderId, 'rejected', reason);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'processing': return 'badge bg-info';
      case 'picked': return 'badge bg-primary';
      case 'delivered': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getResponseBadgeClass = (response) => {
    switch (response) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'accepted': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

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

  // Calculate accepted profit from orders
  const acceptedProfit = orders
    .filter(order => order.sellerResponse === 'accepted' && order.status !== 'delivered')
    .reduce((sum, order) => sum + (order.totalProfit || 0), 0);

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <Link to="/seller/manage-products" className="btn btn-outline-primary">
          Manage your products
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seller Dashboard</h2>
        <div className="text-muted">
          Welcome back, {currentUser?.name}!
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
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
            {/* Decorative elements */}
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
                    Accepted Profit
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ 
                    color: '#228b22',
                    fontSize: 'clamp(1rem, 5vw, 1.8rem)' 
                  }}>
                    {formatCurrency(acceptedProfit)}
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
      {/* Balance Card */}
      <div className="mb-4">
        <SellerBalanceCard stats={stats} acceptedProfit={acceptedProfit} />
      </div>

      {/* Payment Withdrawal Options */}
      <div className="card mb-5" style={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)', 
        border: 'none', 
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)'
      }}>
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="bg-white bg-opacity-20 rounded-3 p-3 me-3 me-md-4" style={{ backdropFilter: 'blur(10px)' }}>
                <i className="fas fa-money-bill-wave text-white fs-4 fs-md-3"></i>
              </div>
              <div>
                <h4 className="text-white mb-1 mb-md-2 fw-bold" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
                  Withdraw Your Earnings
                </h4>
                <p className="text-white-50 mb-0 small">Select your preferred payment method to get started</p>
              </div>
            </div>
            <div className="text-start text-md-end">
              <p className="text-white-50 mb-1 small fw-medium">Available Balance</p>
              <h3 className="text-white fw-bold mb-0" style={{ 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: 'clamp(1.3rem, 5vw, 1.8rem)'
              }}>
                {formatCurrency(stats?.creditAmount || 0)}
              </h3>
            </div>
          </div>
          <div className="row g-3 g-md-4">
            {/* PayPal */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('paypal')}
                style={{
                  background: 'linear-gradient(135deg, #003087 0%, #009cde 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 48, 135, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 48, 135, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 48, 135, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fab fa-paypal" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">PayPal</h6>
                <small className="text-white-75 fw-medium">Instant & Secure</small>
              </div>
            </div>

            {/* Stripe */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('stripe')}
                style={{
                  background: 'linear-gradient(135deg, #635bff 0%, #7c3aed 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(99, 91, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 91, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 91, 255, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fab fa-stripe-s" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">Stripe</h6>
                <small className="text-white-75 fw-medium">Bank Transfer</small>
              </div>
            </div>

            {/* Wise */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('wise')}
                style={{
                  background: 'linear-gradient(135deg, #00b9ff 0%, #0066cc 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 185, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 185, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 185, 255, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fas fa-globe-americas" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">Wise</h6>
                <small className="text-white-75 fw-medium">International</small>
              </div>
            </div>

            {/* Crypto */}
            

            {/* Skrill */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('skrill')}
                style={{
                  background: 'linear-gradient(135deg, #862165 0%, #b83280 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(134, 33, 101, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(134, 33, 101, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(134, 33, 101, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fas fa-wallet" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">Skrill</h6>
                <small className="text-white-75 fw-medium">E-wallet</small>
              </div>
            </div>

            {/* Neteller */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('neteller')}
                style={{
                  background: 'linear-gradient(135deg, #00ac41 0%, #00d4aa 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 172, 65, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 172, 65, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 172, 65, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fas fa-credit-card" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">Neteller</h6>
                <small className="text-white-75 fw-medium">Digital Wallet</small>
              </div>
            </div>

            {/* Perfect Money */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('perfectmoney')}
                style={{
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(30, 64, 175, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(30, 64, 175, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fas fa-money-check-alt" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">Perfect Money</h6>
                <small className="text-white-75 fw-medium">Online Payment</small>
              </div>
            </div>

            {/* WebMoney */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div 
                className="payment-method-card"
                onClick={() => handlePaymentMethod('webmoney')}
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(220, 38, 38, 0.3)';
                }}
              >
                <div className="text-white mb-3">
                  <i className="fas fa-globe" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)' }}></i>
                </div>
                <h6 className="text-white mb-2 fw-bold">WebMoney</h6>
                <small className="text-white-75 fw-medium">Global Payment</small>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      {/* Orders Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Recent Orders</h5>
        </div>
        <div className="card-body order-table">
          {orders.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">No orders found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="order-table">
                <thead className="table-dark">
                  <tr>
                    <th>Order #</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Profit</th>
                    <th>Status</th>
                    <th>Response</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small className="text-muted">{order.orderNumber}</small>
                      </td>
                      <td>
                        {order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            <small>
                              {item?.product ? item?.product?.name : 'N/A'} x{item?.quantity}
                            </small>
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>{formatCurrency(order.totalAmount)}</strong>
                      </td>
                      <td>
                        <span className="text-success">
                          +{formatCurrency(order.totalProfit)}
                        </span>
                      </td>
                      <td>
                        <span className={`order-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`order-badge ${order.sellerResponse}`}>
                          {order.sellerResponse}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="icon-action view mb-1"
                            onClick={() => handleViewOrder(order._id)}
                            title="View Order Details"
                          >
                            View
                          </button>
                          {order.sellerResponse === 'pending' && (
                            <>
                              <button
                                className="icon-action edit mb-1"
                                onClick={() => handleAcceptOrder(order._id)}
                                disabled={processingOrderId === order._id}
                              >
                                {processingOrderId === order._id ? 'Processing...' : 'Accept'}
                              </button>
                              <button
                                className="icon-action delete"
                                onClick={() => handleRejectOrder(order._id)}
                                disabled={processingOrderId === order._id}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {order.sellerResponse === 'rejected' && order.rejectionReason && (
                            <small className="text-muted">
                              Reason: {order.rejectionReason}
                            </small>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeModal}
        />
      )}

      {/* Payment Method Not Available Modal */}
      {showPaymentModal && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={closePaymentModal}
        >
          <div 
            className="modal-dialog modal-dialog-centered" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <div 
              className="modal-content" 
              style={{ 
                border: 'none', 
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div 
                className="modal-header text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  border: 'none',
                  padding: '30px 20px 20px'
                }}
              >
                <div className="w-100">
                  <div 
                    className="mx-auto mb-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fas fa-exclamation-triangle text-white fs-3"></i>
                  </div>
                  <h5 className="modal-title text-white fw-bold mb-0">
                    Payment Method Unavailable
                  </h5>
                </div>
              </div>
              <div className="modal-body text-center p-4">
                <p className="mb-4" style={{ color: '#6c757d', lineHeight: '1.6' }}>
                  Sorry, this payment method is not available in your country at the moment.
                </p>
                <p className="small text-muted mb-4">
                  We're working to expand our payment options. Please try another method or contact support for assistance.
                </p>
                <button 
                  type="button" 
                  className="btn btn-primary px-4 py-2"
                  onClick={closePaymentModal}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '500'
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Form Modal */}
      {showWithdrawForm && selectedPaymentMethod && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={closeWithdrawForm}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="modal-content" 
              style={{ 
                border: 'none', 
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div 
                className="modal-header"
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
                  border: 'none',
                  padding: '25px 30px'
                }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="me-3"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: 'rgba(12, 12, 12, 0.2)',
                      borderRadius: '145px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className={`${getPaymentMethodConfig(selectedPaymentMethod).icon} text-black fs-4`}></i>
                  </div>
                  <div>
                    <h5 className="modal-title text-black fw-bold mb-1">
                      {getPaymentMethodConfig(selectedPaymentMethod).title}
                    </h5>
                    <small className="text-white-75">
                      Processing time: {getPaymentMethodConfig(selectedPaymentMethod).processingTime}
                    </small>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeWithdrawForm}
                ></button>
              </div>
              
              <div className="modal-body p-4">
                {/* Available Balance Info */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div 
                      className="p-3 rounded-3"
                      style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
                    >
                      <div className="text-white text-center">
                        <small className="opacity-75">Available Balance</small>
                        <h4 className="fw-bold mb-0">{formatCurrency(stats?.creditAmount || 0)}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div 
                      className="p-3 rounded-3"
                      style={{ background: 'linear-gradient(135deg, #fd7e14 0%, #ffc107 100%)' }}
                    >
                      <div className="text-white text-center">
                        <small className="opacity-75">Minimum Withdrawal</small>
                        <h4 className="fw-bold mb-0">{formatCurrency(getPaymentMethodConfig(selectedPaymentMethod).minAmount || 10)}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleWithdrawalSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-dollar-sign me-2"></i>
                        Withdrawal Amount
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0.00"
                          value={withdrawalData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          min={getPaymentMethodConfig(selectedPaymentMethod).minAmount || 10}
                          max={stats?.creditAmount || 0}
                          step="0.01"
                          required
                          style={{ borderRadius: '0 10px 10px 0' }}
                        />
                      </div>
                      <small className="text-muted">
                        Min: ${getPaymentMethodConfig(selectedPaymentMethod).minAmount || 10} | 
                        Max: {formatCurrency(stats?.creditAmount || 0)}
                      </small>
                    </div>

                    {getPaymentMethodConfig(selectedPaymentMethod).fields?.includes('email') && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="your@email.com"
                          value={withdrawalData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                    )}

                    {getPaymentMethodConfig(selectedPaymentMethod).fields?.includes('walletAddress') && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fab fa-bitcoin me-2"></i>
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your crypto wallet address"
                          value={withdrawalData.walletAddress}
                          onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                        <small className="text-muted">Bitcoin, USDT, or Ethereum address</small>
                      </div>
                    )}

                    {getPaymentMethodConfig(selectedPaymentMethod).fields?.includes('accountNumber') && (
                      <>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="fas fa-university me-2"></i>
                            Account Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter account number"
                            value={withdrawalData.accountNumber}
                            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">
                            <i className="fas fa-code-branch me-2"></i>
                            Routing Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter routing number"
                            value={withdrawalData.routingNumber}
                            onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>
                      </>
                    )}

                    {getPaymentMethodConfig(selectedPaymentMethod).fields?.includes('accountDetails') && (
                      <div className="col-12 mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-info-circle me-2"></i>
                          Account Details
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter your account details (IBAN, SWIFT, account name, etc.)"
                          value={withdrawalData.accountDetails}
                          onChange={(e) => handleInputChange('accountDetails', e.target.value)}
                          required
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                    )}

                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-sticky-note me-2"></i>
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Any additional information or special instructions"
                        value={withdrawalData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                  </div>

                  {/* Processing Info */}
                  <div 
                    className="alert alert-info d-flex align-items-center"
                    style={{ 
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                      border: 'none',
                      borderRadius: '10px'
                    }}
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    <div>
                      <strong>Processing Information:</strong>
                      <ul className="mb-0 mt-1">
                        <li>Withdrawal requests are processed within {getPaymentMethodConfig(selectedPaymentMethod).processingTime}</li>
                        <li>A 2% processing fee will be deducted from your withdrawal amount</li>
                        <li>You will receive email confirmation once processed</li>
                      </ul>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary flex-fill py-2"
                      onClick={closeWithdrawForm}
                      style={{ borderRadius: '10px' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary flex-fill py-2"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Submit Withdrawal Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;