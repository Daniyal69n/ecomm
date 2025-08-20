import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { getSellerProductsForAdmin } from '../services/sellerProductService';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminCreateOrder = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  
  const [sellers, setSellers] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeader = useCallback(() => {
    return currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {};
  }, [currentUser?.token]);

  const fetchSellers = useCallback(async () => {
    try {
      const usersResponse = await axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
      const approvedSellers = usersResponse.data.filter(user => 
        user.role === 'seller' && user.approved
      );
      setSellers(approvedSellers);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setError('Failed to load sellers');
    }
  }, [getAuthHeader]);

  const fetchSellerProducts = useCallback(async (sellerId) => {
    if (!sellerId) {
      setSellerProducts([]);
      return;
    }
    
    try {
      const products = await getSellerProductsForAdmin(sellerId);
      setSellerProducts(products);
      setSelectedItems([]); // Clear selected items when seller changes
    } catch (error) {
      console.error('Error fetching seller products:', error);
      setError('Failed to load seller products');
      setSellerProducts([]);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchSellers();
  }, [currentUser?.role, fetchSellers, navigate]);

  useEffect(() => {
    if (selectedSeller) {
      fetchSellerProducts(selectedSeller);
    }
  }, [selectedSeller, fetchSellerProducts]);

  const addProduct = () => {
    setSelectedItems([...selectedItems, { productId: '', quantity: 1 }]);
  };

  const removeProduct = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index][field] = value;
    setSelectedItems(updatedItems);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
      if (sellerProduct) {
        const price = sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice;
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateProfit = () => {
    return selectedItems.reduce((total, item) => {
      const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
      if (sellerProduct) {
        const originalPrice = sellerProduct.sellerPrice;
        const discountedPrice = sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice;
        const profit = (originalPrice - discountedPrice) * item.quantity;
        return total + profit;
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    if (!selectedSeller) {
      setError('Please select a seller');
      return;
    }

    if (selectedItems.length === 0) {
      setError('Please add at least one product');
      return;
    }

    const invalidItems = selectedItems.filter(item => !item.productId || item.quantity < 1);
    if (invalidItems.length > 0) {
      setError('Please ensure all items have valid products and quantities');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating order with data:', {
        sellerId: selectedSeller,
        items: selectedItems,
        notes
      });
      
      const result = await createOrder({
        sellerId: selectedSeller,
        items: selectedItems,
        notes
      });
      
      console.log('Order created successfully:', result);
      setSuccess('Order created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/admin/orders');
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          {/* Header Section */}
          <div className="d-flex align-items-center mb-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="btn btn-outline-secondary me-3 d-flex align-items-center"
              style={{ borderRadius: '12px' }}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </button>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Create New Order</h2>
              <p className="text-muted mb-0">Add a new order for your sellers</p>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            {/* Card Header */}
            <div 
              className="card-header border-0 text-white p-4"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
                  <i className="bi bi-cart-plus fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-1 fw-bold">Order Creation</h4>
                  <p className="mb-0 opacity-90">Fill in the details below to create an order</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Alert Messages */}
              {error && (
                <div className="alert alert-danger border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="alert alert-success border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Seller Selection */}
                <div className="mb-4">
                  <label htmlFor="seller" className="form-label fw-semibold text-dark mb-3">
                    <i className="bi bi-person-badge me-2 text-primary"></i>
                    Select Seller
                  </label>
                  <select
                    id="seller"
                    className="form-select py-3 border-2"
                    style={{ borderRadius: '12px', fontSize: '0.95rem' }}
                    value={selectedSeller}
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    required
                  >
                    <option value="">Choose a seller...</option>
                    {sellers.map(seller => (
                      <option key={seller._id} value={seller._id}>
                        {seller.name} - {seller.shopName} (Balance: ${seller.creditAmount || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Products Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-semibold text-dark mb-0">
                      <i className="bi bi-box-seam me-2 text-primary"></i>
                      Products
                    </label>
                    <button
                      type="button"
                      className="btn btn-success d-flex align-items-center"
                      style={{ borderRadius: '12px' }}
                      onClick={addProduct}
                      disabled={!selectedSeller || sellerProducts.length === 0}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Product
                    </button>
                  </div>

                  {selectedItems.length === 0 && (
                    <div 
                      className="alert alert-info border-0 text-center py-4"
                      style={{ borderRadius: '16px', backgroundColor: '#e3f2fd' }}
                    >
                      <i className="bi bi-info-circle fs-4 text-info mb-2"></i>
                      <p className="mb-2 fw-semibold">No products added yet</p>
                      <p className="mb-0 text-muted">
                        {selectedSeller ? 'Click "Add Product" to start building your order' : 'Select a seller first to view available products'}
                      </p>
                    </div>
                  )}

                  {!selectedSeller && (
                    <div 
                      className="alert alert-warning border-0 text-center py-4"
                      style={{ borderRadius: '16px', backgroundColor: '#fff3cd' }}
                    >
                      <i className="bi bi-exclamation-triangle fs-4 text-warning mb-2"></i>
                      <p className="mb-0 fw-semibold">Please select a seller first to view their available products</p>
                    </div>
                  )}

                  {selectedSeller && sellerProducts.length === 0 && (
                    <div 
                      className="alert alert-warning border-0 text-center py-4"
                      style={{ borderRadius: '16px', backgroundColor: '#fff3cd' }}
                    >
                      <i className="bi bi-exclamation-triangle fs-4 text-warning mb-2"></i>
                      <p className="mb-0 fw-semibold">This seller has no products available in their inventory</p>
                    </div>
                  )}

                  <div className="row g-3">
                    {selectedItems.map((item, index) => (
                      <div key={index} className="col-12">
                        <div 
                          className="card border-0 shadow-sm"
                          style={{ borderRadius: '16px', border: '1px solid #e9ecef' }}
                        >
                          <div className="card-body p-4">
                            <div className="row align-items-end g-3">
                              <div className="col-md-5">
                                <label className="form-label small fw-semibold text-secondary">Product</label>
                                <select
                                  className="form-select border-2"
                                  style={{ borderRadius: '10px' }}
                                  value={item.productId}
                                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                  required
                                >
                                  <option value="">Select product...</option>
                                  {sellerProducts.map(sellerProduct => (
                                    <option key={sellerProduct._id} value={sellerProduct._id}>
                                      {sellerProduct.product && sellerProduct.product.name
                                        ? `${sellerProduct.product.name} - $${sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice} (Stock: ${sellerProduct.sellerQuantity})`
                                        : `Unknown Product - $${sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice} (Stock: ${sellerProduct.sellerQuantity})`}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {/* Product Value */}
                              <div className="col-md-2">
                                <label className="form-label small fw-semibold text-secondary">Product Value</label>
                                <div 
                                  className="p-2 bg-info bg-opacity-10 text-center fw-bold text-info"
                                  style={{ borderRadius: '10px' }}
                                >
                                  {(() => {
                                    const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
                                    if (sellerProduct) {
                                      const price = sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice;
                                      return `$${price.toFixed(2)}`;
                                    }
                                    return '$0.00';
                                  })()}
                                </div>
                              </div>
                              {/* Quantity */}
                              <div className="col-md-2">
                                <label className="form-label small fw-semibold text-secondary">Quantity</label>
                                <input
                                  type="number"
                                  className="form-control border-2 text-center fw-semibold"
                                  style={{ borderRadius: '10px' }}
                                  min="1"
                                  max={(() => {
                                    const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
                                    return sellerProduct ? sellerProduct.sellerQuantity : 999;
                                  })()}
                                  value={item.quantity}
                                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                  required
                                />
                                {(() => {
                                  const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
                                  if (sellerProduct) {
                                    return (
                                      <small className="text-muted">
                                        
                                      </small>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              {/* Profit */}
                              <div className="col-md-2">
                                <label className="form-label small fw-semibold text-secondary">Profit</label>
                                <div 
                                  className="p-2 bg-success bg-opacity-10 text-center fw-bold text-success"
                                  style={{ borderRadius: '10px' }}
                                >
                                  {(() => {
                                    const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
                                    if (sellerProduct) {
                                      const originalPrice = sellerProduct.sellerPrice;
                                      const discountedPrice = sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice;
                                      const profit = (originalPrice - discountedPrice) * item.quantity;
                                      return `$${profit.toFixed(2)}`;
                                    }
                                    return '$0.00';
                                  })()}
                                </div>
                              </div>
                              {/* Total */}
                              <div className="col-md-2">
                                <label className="form-label small fw-semibold text-secondary">Total</label>
                                <div 
                                  className="p-2 bg-light text-center fw-bold text-primary"
                                  style={{ borderRadius: '10px' }}
                                >
                                  {(() => {
                                    const sellerProduct = sellerProducts.find(sp => sp._id === item.productId);
                                    if (sellerProduct) {
                                      const price = sellerProduct.sellerDiscountedPrice || sellerProduct.sellerPrice;
                                      return `$${(price * item.quantity).toFixed(2)}`;
                                    }
                                    return '$0.00';
                                  })()}
                                </div>
                              </div>
                              <div className="col-md-1">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger w-100"
                                  style={{ borderRadius: '10px' }}
                                  onClick={() => removeProduct(index)}
                                  title="Remove product"
                                >
                                 <IoMdClose />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-4">
                  <label htmlFor="notes" className="form-label fw-semibold text-dark mb-3">
                    <i className="bi bi-chat-left-text me-2 text-primary"></i>
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    className="form-control border-2"
                    style={{ borderRadius: '12px', minHeight: '100px' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any special instructions or notes for this order..."
                  />
                </div>

                {/* Order Summary */}
                {selectedItems.length > 0 && (
                  <div className="mb-4">
                    <div 
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                    >
                      <div className="card-body p-4">
                        <h5 className="text-white fw-bold mb-3">
                          <i className="bi bi-calculator me-2"></i>
                          Order Summary
                        </h5>
                        <div className="row text-white">
                          <div className="col-md-3 text-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                              <i className="bi bi-box fs-3"></i>
                            </div>
                            <h6 className="fw-bold">{selectedItems.length}</h6>
                            <small className="opacity-90">Items</small>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                              <i className="bi bi-currency-dollar fs-3"></i>
                            </div>
                            <h6 className="fw-bold">${calculateTotal().toFixed(2)}</h6>
                            <small className="opacity-90">Total Amount</small>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                              <i className="bi bi-graph-up fs-3"></i>
                            </div>
                            <h6 className="fw-bold">${calculateProfit().toFixed(2)}</h6>
                            <small className="opacity-90">Total Profit</small>
                          </div>
                          <div className="col-md-3 text-center">
                            <div className="bg-white bg-opacity-20 rounded-3 p-3 mb-2">
                              <i className="bi bi-percent fs-3"></i>
                            </div>
                            <h6 className="fw-bold">
                              {calculateTotal() > 0 ? ((calculateProfit() / calculateTotal()) * 100).toFixed(1) : 0}%
                            </h6>
                            <small className="opacity-90">Profit Margin</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-4 py-3 flex-grow-1"
                    style={{ borderRadius: '12px' }}
                    disabled={loading || selectedItems.length === 0}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Create Order
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4 py-3"
                    style={{ borderRadius: '12px' }}
                    onClick={() => navigate('/admin/orders')}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrder;
