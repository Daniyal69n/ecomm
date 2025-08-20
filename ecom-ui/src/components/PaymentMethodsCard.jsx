import React, { useState } from 'react';
import { showError, showInfo } from './toast';

const PaymentMethodsCard = ({ stats, formatCurrency }) => {
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

  const handlePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setShowWithdrawForm(true);
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
    showInfo('Sorry, this payment method is not available in your region at the moment. Please contact our support team for assistance or try another payment method.');
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
        processingTime: '1-2 business days',
        notValidIn: ['IN', 'PK'] // Not valid in India, Pakistan
      },
      stripe: {
        title: 'Bank Transfer (Stripe)',
        icon: 'fab fa-stripe',
        fields: ['accountNumber', 'routingNumber'],
        minAmount: 25,
        processingTime: '3-5 business days',
        notValidIn: ['IN', 'PK']
      },
      wise: {
        title: 'Wise International Transfer',
        icon: 'fas fa-university',
        fields: ['accountDetails'],
        minAmount: 20,
        processingTime: '1-3 business days',
        notValidIn: ['IN', 'PK']
      },
      payoneer: {
        title: 'Payoneer Transfer',
        icon: 'fas fa-university',
        fields: ['accountDetails'],
        minAmount: 30,
        processingTime: '2-4 business days',
        notValidIn: ['IN', 'PK']
      },
      skrill: {
        title: 'Skrill E-wallet',
        icon: 'fas fa-credit-card',
        fields: ['email'],
        minAmount: 15,
        processingTime: '1-2 business days',
        notValidIn: ['IN', 'PK']
      },
      neteller: {
        title: 'Neteller Digital Wallet',
        icon: 'fas fa-wallet',
        fields: ['email'],
        minAmount: 15,
        processingTime: '1-2 business days',
        notValidIn: ['IN', 'PK']
      },
      perfectmoney: {
        title: 'Perfect Money',
        icon: 'fas fa-money-check-alt',
        fields: ['accountDetails'],
        minAmount: 10,
        processingTime: 'Within 24 hours',
        notValidIn: ['IN', 'PK']
      },
      webmoney: {
        title: 'WebMoney',
        icon: 'fas fa-globe',
        fields: ['accountDetails'],
        minAmount: 20,
        processingTime: 'Within 24 hours',
        notValidIn: ['IN', 'PK']
      }
    };
    return configs[method] || {};
  };

  return (
    <>
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
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className={`${getPaymentMethodConfig(selectedPaymentMethod).icon} text-white fs-4`}></i>
                  </div>
                  <div>
                    <h5 className="modal-title text-black fw-bold mb-1">
                      {getPaymentMethodConfig(selectedPaymentMethod).title}
                    </h5>
                    <small className="text-black-75">
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
    </>
  );
};

export default PaymentMethodsCard;
