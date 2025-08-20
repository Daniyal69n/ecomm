import React, { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError } from './toast';
import { FiX } from 'react-icons/fi';
import { updateOrder } from '../services/orderService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const OrderEditModal = ({ order, onClose, onSave }) => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeader = useCallback(() => {
    return currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {};
  }, [currentUser?.token]);

  const fetchSellersAndProducts = useCallback(async () => {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers: getAuthHeader() }),
        axios.get(`${API_URL}/products`, { headers: getAuthHeader() })
      ]);
      
      const approvedSellers = usersResponse.data.filter(user => 
        user.role === 'seller' && user.approved
      );
      
      setSellers(approvedSellers);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load sellers and products');
    }
  }, [getAuthHeader]);

  useEffect(() => {
    if (order) {
      // Initialize form with order data
      setSelectedSeller(order.seller._id || '');
      setSelectedItems(order.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })));
      setNotes(order.notes || '');
      fetchSellersAndProducts();
    }
  }, [order, fetchSellersAndProducts]);

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
      const product = products.find(p => p._id === item.productId);
      if (product) {
        const discountedPrice = product.discountedPrice || product.price;
        return total + (discountedPrice * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateProfit = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find(p => p._id === item.productId);
      if (product) {
        const originalPrice = product.price;
        const discountedPrice = product.discountedPrice || product.price;
        const profit = (originalPrice - discountedPrice) * item.quantity;
        return total + profit;
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loading) {
      return;
    }

    if (!selectedSeller) {
      showError('Please select a seller');
      setError('Please select a seller');
      return;
    }

    if (selectedItems.length === 0) {
      showError('Please add at least one product');
      setError('Please add at least one product');
      return;
    }

    const invalidItems = selectedItems.filter(item => !item.productId || item.quantity < 1);
    if (invalidItems.length > 0) {
      showError('Please ensure all items have valid products and quantities');
      setError('Please ensure all items have valid products and quantities');
      return;
    }

    try {
      setLoading(true);
      const result = await updateOrder(order._id, {
        sellerId: selectedSeller,
        items: selectedItems,
        notes
      });
      
      console.log('Order updated successfully:', result);
      showSuccess('Order updated successfully!');
      onSave(result.order);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      const errMsg = error.response?.data?.message || 'Failed to update order';
      showError(errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  // Check if order can be edited
  const canEdit = order.sellerResponse === 'pending';

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">Edit Order - {order.orderNumber}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {!canEdit && (
              <div className="alert alert-warning">
                <strong>Notice:</strong> This order has already been responded to by the seller and cannot be edited.
              </div>
            )}

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="seller" className="form-label">Select Seller *</label>
                <select
                  id="seller"
                  className="form-select modern-input"
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  disabled={!canEdit}
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

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-label">Products *</label>
                  {canEdit && (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={addProduct}
                    >
                      <i className="bi bi-plus-circle"></i> Add Product
                    </button>
                  )}
                </div>

                {selectedItems.length === 0 && (
                  <div className="alert alert-info">
                    No products added yet. Click "Add Product" to start.
                  </div>
                )}

                {selectedItems.map((item, index) => (
                  <div key={index} className="card mb-2">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-5">
                          <label className="form-label small">Product</label>
                          <select
                            className="form-select modern-input"
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                            disabled={!canEdit}
                            required
                          >
                            <option value="">Select product...</option>
                            {products.map(product => (
                              <option key={product._id} value={product._id}>
                                {product.name} - ${product.discountedPrice || product.price} (Profit: ${(product.price - (product.discountedPrice || product.price)).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label small">Quantity</label>
                          <input
                            type="number"
                            className="form-control modern-input"
                            placeholder="Qty"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            disabled={!canEdit}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label small">Total</label>
                          <div className="form-control-plaintext">
                            {(() => {
                              const product = products.find(p => p._id === item.productId);
                              if (product) {
                                const discountedPrice = product.discountedPrice || product.price;
                                return `$${(discountedPrice * item.quantity).toFixed(2)}`;
                              }
                              return '$0.00';
                            })()}
                          </div>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label small">Profit</label>
                          <div className="form-control-plaintext text-success">
                            {(() => {
                              const product = products.find(p => p._id === item.productId);
                              if (product) {
                                const originalPrice = product.price;
                                const discountedPrice = product.discountedPrice || product.price;
                                const profit = (originalPrice - discountedPrice) * item.quantity;
                                return `$${profit.toFixed(2)}`;
                              }
                              return '$0.00';
                            })()}
                          </div>
                        </div>
                        <div className="col-md-1">
                          <label className="form-label small">&nbsp;</label>
                          {canEdit && (
                            <button
                              type="button"
                              className="icon-action delete d-block"
                              onClick={() => removeProduct(index)}
                              title="Remove product"
                              style={{ padding: '6px', fontSize: '1.2em', background: 'none', border: 'none' }}
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes (Optional)</label>
                <textarea
                  id="notes"
                  className="form-control modern-input"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any special instructions or notes..."
                  disabled={!canEdit}
                />
              </div>

              {selectedItems.length > 0 && (
                <div className="mb-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <h5 className="text-primary">Total Amount: ${calculateTotal().toFixed(2)}</h5>
                        </div>
                        <div className="col-md-4">
                          <h5 className="text-success">Total Profit: ${calculateProfit().toFixed(2)}</h5>
                        </div>
                        <div className="col-md-4">
                          <h5 className="text-info">Items: {selectedItems.length}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {canEdit && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || selectedItems.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  'Update Order'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;
