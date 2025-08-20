import React, { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError } from '../components/toast';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getOrders, sellerOrderResponse, getOrderById, getOrderStats } from '../services/orderService';
import OrderDetailsModal from '../components/OrderDetailsModal';
import SellerBalanceCard from '../components/SellerBalanceCard';
import PaymentMethodsCard from '../components/PaymentMethodsCard';

const SellerOrders = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResponse, setFilterResponse] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchOrders = useCallback(async () => {
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
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [currentUser?.role, fetchOrders, navigate]);

  const handleOrderResponse = async (orderId, response, rejectionReason = '') => {
    try {
      setProcessingOrderId(orderId);
      console.log(`Attempting to ${response} order ${orderId}`, { response, rejectionReason });
      
      const result = await sellerOrderResponse(orderId, response, rejectionReason);
      console.log(`Order ${response} successfully:`, result);
      
      fetchOrders(); // Refresh orders and stats
      showSuccess(`Order ${response} successfully!`);
    } catch (error) {
      console.error(`Error ${response}ing order:`, error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = `Failed to ${response} order`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.required && error.response?.data?.available) {
        errorMessage = `Insufficient balance. Required: $${error.response.data.required}, Available: $${error.response.data.available}`;
      }
      
      showError(errorMessage);
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

  const handleAcceptOrder = (order) => {
    const confirmMessage = `Are you sure you want to accept this order?\n\nOrder Details:\n- Order Number: ${order.orderNumber}\n- Total Amount: $${order.totalAmount.toFixed(2)}\n- Items: ${order.items.length}\n\nThis amount will be deducted from your credit balance.`;
    if (window.confirm(confirmMessage)) {
      handleOrderResponse(order._id, 'accepted');
    }
  };

  const handleRejectOrder = (orderId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    if (reason !== null) { // User didn't cancel
      handleOrderResponse(orderId, 'rejected', reason);
    }
  };

 

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const statusMatch = filterStatus === 'all' || order.status === filterStatus;
    const responseMatch = filterResponse === 'all' || order.sellerResponse === filterResponse;
    return statusMatch && responseMatch;
  });

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
    <div className="container mt-4 admin-orders-page">
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="admin-title">My Orders</h2>
          <p className="admin-subtitle text-muted">View and manage your orders</p>
        </div>
        <div className="text-muted admin-stats-number">Total Orders: {orders.length}</div>
      </div>

      {/* Balance Card */}
      <div className="mb-4">
        <SellerBalanceCard stats={stats} acceptedProfit={acceptedProfit} />
      </div>

      {/* Payment Methods */}
     

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="row mb-4 admin-stats-row">
        <div className="col-md-6 mb-3 mb-md-0">
          <label className="form-label admin-filter-label">Filter by Status</label>
          <select 
            className="form-select admin-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label admin-filter-label">Filter by Response</label>
          <select 
            className="form-select admin-filter-select"
            value={filterResponse}
            onChange={(e) => setFilterResponse(e.target.value)}
          >
            <option value="all">All Responses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      
        <h5 className="card-title mb-0">Orders ({filteredOrders.length})</h5>
        <div className="card-body order-table">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">No orders found with the selected filters</p>
            </div>
          ) : (
            <div className="table-responsive ">
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
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <small className="text-muted">{order.orderNumber}</small>
                      </td>
                      <td>
                        {order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            <div className="d-flex align-items-center">
                              {item?.product?.image && (
                                <img 
                                  src={item?.product?.image} 
                                  alt={item?.product?.name}
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                              )}
                              <small>
                                {item?.product?.name} x{item?.quantity}
                                <br />
                                <span className="text-muted">
                                  {formatCurrency(item?.discountedPrice)} each
                                </span>
                              </small>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td>
                        <strong>{formatCurrency(order?.totalAmount)}</strong>
                      </td>
                      <td>
                        <span className="text-success">
                          +{formatCurrency(order?.totalProfit)}
                        </span>
                      </td>
                      <td>
                        <span className={`order-badge ${order?.status}`}>
                          {order?.status}
                        </span>
                      </td>
                      <td>
                        <span className={`order-badge ${order?.sellerResponse}`}>
                          {order?.sellerResponse}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(order?.createdAt).toLocaleDateString()}
                          <br />
                          {new Date(order?.createdAt).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        {order?.notes && (
                          <small className="text-muted">
                            {order?.notes?.length > 30 
                              ? `${order?.notes?.substring(0, 30)}...` 
                              : order?.notes}
                          </small>
                        )}
                        {order?.rejectionReason && (
                          <small className="text-danger">
                            <br />Rejection: {order?.rejectionReason}
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="actions">
                          {/* View Order Button */}
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
                                onClick={() => handleAcceptOrder(order)}
                                disabled={processingOrderId === order?._id}
                              >
                                {processingOrderId === order?._id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm"></span> Processing...
                                  </>
                                ) : (
                                  <>
                                     Accept
                                  </>
                                )}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      
 <PaymentMethodsCard stats={stats} formatCurrency={formatCurrency} />
      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SellerOrders;
