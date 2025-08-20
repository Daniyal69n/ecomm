import React, { useState, useEffect, useCallback } from 'react';
import { showSuccess } from '../components/toast';
import { useNavigate } from 'react-router-dom';
import { getOrderStats } from '../services/orderService';
import { getSellerProducts } from '../services/sellerProductService';
import { 
  FiUser, FiMail, FiPhone, FiHome, FiEdit, FiSave, FiX, 
  FiBox, FiDollarSign, FiClock, FiShoppingCart, FiTrendingUp,
  FiCalendar, FiCheckCircle, FiLock, FiUpload, FiAlertTriangle,
  FiEye, FiImage
} from 'react-icons/fi';

const SellerShop = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({});
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    shopName: currentUser?.shopName || ''
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, productsData] = await Promise.all([
        getOrderStats(),
        getSellerProducts()
      ]);
      setStats(statsData);
      setSellerProducts(productsData);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load shop data');
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

  const handleEdit = () => {
    setEditData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      shopName: currentUser?.shopName || ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      shopName: currentUser?.shopName || ''
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/seller/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUser = { ...currentUser, ...editData };
        localStorage.setItem('alfauser', JSON.stringify(updatedUser));
        setIsEditing(false);
        setError('');
        // Show success message
        showSuccess('Profile updated successfully!');
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
    <div className="seller-shop-container">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Shop Settings</h2>
            <p className="text-muted mb-0">Manage your shop profile and view business analytics</p>
          </div>
          <div className="text-muted">
            <FiHome className="me-2" />
            Shop Dashboard
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
                <FiAlertTriangle 
                  style={{ 
                    fontSize: '1.5rem',
                    color: '#dc2626'
                  }}
                />
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
                className="error-close-btn"
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
              >
                <FiX style={{ 
                  fontSize: '0.9rem',
                  color: '#dc2626'
                }} />
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

      {/* Shop Profile Section */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-8">
          <div 
            className="card h-100 border-0"
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
                padding: '2rem',
                color: 'white'
              }}
            >
              <div className="d-flex align-items-center">
                <div className="me-4">
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <FiUser style={{ color: 'white', fontSize: '2rem' }} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h4 className="mb-2 fw-bold">{isEditing ? editData.name || 'Seller Name' : currentUser?.name || 'Seller Name'}</h4>
                  <div className="d-flex align-items-center mb-2 flex-wrap">
                    <span 
                      className="badge me-3 mb-1"
                      style={{
                        background: currentUser?.approved ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <FiCheckCircle className="me-2" />
                      {currentUser?.approved ? 'Verified Seller' : 'Pending Verification'}
                    </span>
                    <span 
                      className="badge mb-1"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <FiHome className="me-2" />
                      {isEditing ? editData.shopName || 'Shop Name' : currentUser?.shopName || 'Shop Name'}
                    </span>
                  </div>
                  <p className="mb-0 opacity-75">
                    <FiCalendar className="me-2" />
                    Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Profile Information</h5>
                {!isEditing ? (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleEdit}
                    disabled={loading}
                  >
                    <FiEdit className="me-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="me-2" />
                          Save
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <FiX className="me-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">
                      <FiUser className="me-2" />
                      Full Name {isEditing && <span className="text-danger">*</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef'
                        }}
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <div 
                        className="form-control"
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px'
                        }}
                      >
                        {currentUser?.name || 'No name provided'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">
                      <FiMail className="me-2" />
                      Email Address
                      
                    </label>
                    <div 
                      className="form-control"
                      style={{
                        background: '#e9ecef',
                        border: '1px solid #dee2e6',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#6c757d'
                      }}
                    >
                      <FiLock className="me-2" />
                      {currentUser?.email || 'No email provided'}
                    </div>
                    <small className="text-muted">Email cannot be changed for security reasons</small>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">
                      <FiPhone className="me-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-control"
                        style={{
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef'
                        }}
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div 
                        className="form-control"
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px'
                        }}
                      >
                        {currentUser?.phone || 'No phone provided'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium">
                      <FiHome className="me-2" />
                      Shop Name {isEditing && <span className="text-danger">*</span>}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '2px solid #e9ecef'
                        }}
                        value={editData.shopName}
                        onChange={(e) => setEditData({...editData, shopName: e.target.value})}
                        placeholder="Enter your shop name"
                        required
                      />
                    ) : (
                      <div 
                        className="form-control"
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '12px 16px'
                        }}
                      >
                        {currentUser?.shopName || 'No shop name provided'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="alert alert-info mt-3" style={{ borderRadius: '12px' }}>
                  <FiEye className="me-2" />
                  <strong>Note:</strong> Your profile changes will be saved and reflected across the platform. Email address cannot be modified for security purposes.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div 
            className="card h-100 border-0"
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="text-center">
                {currentUser?.identity ? (
                  <>
                    <div 
                      className="mb-3"
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '12px',
                        margin: '0 auto',
                        overflow: 'hidden',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <img 
                        src={currentUser.identity} 
                        alt="Identity Verification" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <h6 className="fw-bold mb-2">
                      <FiCheckCircle className="me-2 text-success" />
                      Identity Verified
                    </h6>
                    <p className="mb-0 opacity-75">
                      Your ID proof has been uploaded and verified
                    </p>
                  </>
                ) : (
                  <>
                    <div 
                      className="mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <FiImage style={{ fontSize: '2rem' }} />
                    </div>
                    <h6 className="fw-bold mb-2">No Identity Provided</h6>
                    <p className="mb-3 opacity-75">
                      Upload your ID proof for verification
                    </p>
                    <button 
                      className="btn btn-light btn-sm"
                      style={{
                        borderRadius: '20px',
                        padding: '8px 20px',
                        fontWeight: '500'
                      }}
                    >
                      <FiUpload className="me-2" />
                      Upload Image
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Analytics */}
      <div className="row g-4 mb-5">
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
                    Total Products
                  </h6>
                  <h3 className="text-white fw-bold mb-0" style={{ fontSize: 'clamp(1rem, 5vw, 1.8rem)' }}>
                    {sellerProducts.length}
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
                  <FiBox style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }} />
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
                    Total Balance
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ 
                    color: '#8b4513',
                    fontSize: 'clamp(1rem, 5vw, 1.8rem)' 
                  }}>
                    {formatCurrency(currentUser?.creditAmount || stats?.creditAmount || 0)}
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
                  <FiDollarSign style={{ 
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    color: '#8b4513'
                  }} />
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
                    Pending Orders
                  </h6>
                  <h3 className="fw-bold mb-0" style={{ 
                    color: '#228b22',
                    fontSize: 'clamp(1rem, 5vw, 1.8rem)' 
                  }}>
                    {stats?.pendingOrders || 0}
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
                  <FiClock style={{ 
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    color: '#228b22'
                  }} />
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
                    {stats?.totalOrders || 0}
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
                  <FiShoppingCart style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }} />
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

      {/* Profit Overview */}
      <div className="row g-4">
        <div className="col-12">
          <div 
            className="card border-0"
            style={{ 
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="card-body p-4 text-white">
              <div className="row align-items-center">
                <div className="col-12 col-md-8">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <FiTrendingUp style={{ fontSize: '2rem' }} />
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Total Profit</h4>
                      <p className="mb-0 opacity-75">Your overall business performance</p>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-0" style={{ fontSize: '3rem' }}>
                    {formatCurrency(stats?.totalProfit || 0)}
                  </h2>
                </div>
                <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                  <div className="text-white-50 mb-2">
                    <FiTrendingUp className="me-2" />
                    Performance Overview
                  </div>
                  <div className="d-flex flex-column align-items-md-end">
                    <div className="mb-2">
                      <span className="badge bg-light text-dark px-3 py-2">
                        Active Products: {sellerProducts.filter(p => p.isActive !== false).length}
                      </span>
                    </div>
                    <div>
                      {/* <span className="badge bg-warning text-dark px-3 py-2">
Pending Amount: {formatCurrency((stats?.pendingAmount || 0) + (stats?.totalProfit || 0))}
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .seller-shop-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .error-close-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          transform: scale(1.1);
        }

        .card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
        }

        .btn-success {
          background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
          border: none;
          border-radius: 10px;
        }

        .btn-secondary {
          background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
          border: none;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem !important;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default SellerShop;
