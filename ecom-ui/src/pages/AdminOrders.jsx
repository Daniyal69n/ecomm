import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders, updateOrderStatus, deleteOrder, getOrderById } from '../services/orderService';
import { showSuccess, showError } from '../components/toast';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderEditModal from '../components/OrderEditModal';
import OrderStatusChanger from '../components/OrderStatusChanger';

const AdminOrders = () => {
  const currentUser = JSON.parse(localStorage.getItem('alfauser'));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [currentUser?.role, fetchOrders, navigate]);

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteOrder(orderId);
        fetchOrders(); // Refresh orders
        showSuccess('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        showError(error.response?.data?.message || 'Failed to delete order');
      }
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

  const handleEditOrder = async (orderId) => {
    try {
      const orderData = await getOrderById(orderId);
      setSelectedOrder(orderData);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      showError('Failed to load order details');
    }
  };

  const handleOrderUpdated = (updatedOrder) => {
    // Update the order in the list
    setOrders(orders.map(order => 
      order._id === updatedOrder._id ? updatedOrder : order
    ));
  };

  const handleStatusChanged = (updatedOrder) => {
    // Update the order in the list when status changes
    setOrders(orders.map(order => 
      order._id === updatedOrder._id ? updatedOrder : order
    ));
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'processing': return 'bg-info text-white';
      case 'picked': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getSellerResponseBadgeClass = (response) => {
    switch (response) {
      case 'pending': return 'bg-warning text-dark';
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 admin-orders-page">
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="admin-title">Order Management</h2>
          <p className="admin-subtitle text-muted">Manage all orders and their statuses</p>
        </div>
        <Link to="/admin/create-order" className="btn btn-primary admin-create-btn">
          <i className="bi bi-plus-circle"></i> Create New Order
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Filter and Stats */}
      <div className="row mb-4 admin-stats-row">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card admin-stats-card">
            <div className="card-body">
              <h6 className="admin-stats-title">Quick Stats</h6>
              <div className="row text-center">
                <div className="col">
                  <h4 className="text-primary admin-stats-number">{orders.length}</h4>
                  <small>Total Orders</small>
                </div>
                <div className="col">
                  <h4 className="text-warning admin-stats-number">{orders.filter(o => o.sellerResponse === 'pending').length}</h4>
                  <small>Pending</small>
                </div>
                <div className="col">
                  <h4 className="text-success admin-stats-number">{orders.filter(o => o.status === 'delivered').length}</h4>
                  <small>Delivered</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label admin-filter-label">Filter by Status</label>
          <select 
            className="form-select admin-filter-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-info">
          {filterStatus === 'all' 
            ? 'No orders found. Create your first order!' 
            : `No orders found with status: ${filterStatus}`}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="order-table">
            <thead className="table-dark">
              <tr>
                <th>Order #</th>
                <th>Seller</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Total Profit</th>
                <th>Status</th>
                <th>Seller Response</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{order.seller?.name}</strong>
                      <br />
                      <small className="text-muted">{order.seller?.shopName}</small>
                      <br />
                      <small className="text-success">Balance: ${order.seller?.creditAmount || 0}</small>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      {order.items.map((item, index) => (
                        <div key={index} className="small mb-1">
                          <strong>{item.product?.name}</strong> × {item.quantity}
                          <br />
                          <span className="text-muted">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary">${order.totalAmount.toFixed(2)}</strong>
                  </td>
                  <td>
                    <strong className="text-success">${order.totalProfit.toFixed(2)}</strong>
                  </td>
                  <td>
                    <OrderStatusChanger 
                      order={order} 
                      onStatusChange={handleStatusChanged} 
                    />
                  </td>
                  <td>
                    <span className={`order-badge ${order.sellerResponse}`}>
                      {order.sellerResponse.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                    <br />
                    <small className="text-muted">{new Date(order.createdAt).toLocaleTimeString()}</small>
                  </td>
                  <td className="actions">
                    <button className="icon-action view" onClick={() => handleViewOrder(order._id)} title="View Order Details">
                      <FiEye />
                    </button>
                    <button className="icon-action edit" onClick={() => handleEditOrder(order._id)} title="Edit Order">
                      <FiEdit2 />
                    </button>
                    <button className="icon-action delete" onClick={() => handleDelete(order._id)} title="Delete Order">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={closeModals} 
        />
      )}

      {/* Order Edit Modal */}
      {showEditModal && (
        <OrderEditModal 
          order={selectedOrder} 
          onClose={closeModals} 
          onSave={handleOrderUpdated}
        />
      )}
    </div>
  );
};

export default AdminOrders;
