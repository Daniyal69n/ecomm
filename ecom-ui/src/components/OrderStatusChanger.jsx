import React, { useState } from 'react';
import { showSuccess, showError } from './toast';
import toast from 'react-hot-toast';
import { updateOrderStatus } from '../services/orderService';

const OrderStatusChanger = ({ order, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'processing', label: 'Processing', color: 'info' },
    { value: 'picked', label: 'Picked', color: 'primary' },
    { value: 'delivered', label: 'Delivered', color: 'success' }
  ];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;

    const confirmMessage = `Are you sure you want to change order status from "${order.status}" to "${newStatus}"?`;
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <span>
          {confirmMessage}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => { toast.dismiss(t.id); resolve(true); }} style={{ marginRight: 8 }}>Yes</button>
            <button onClick={() => { toast.dismiss(t.id); resolve(false); }}>No</button>
          </div>
        </span>
      ), { duration: 10000 });
    });
    if (!confirmed) {
      setSelectedStatus(order.status); // Reset selection
      return;
    }

    try {
      setIsUpdating(true);
      console.log('Admin updating order status:', { 
        orderId: order._id, 
        from: order.status, 
        to: newStatus,
        currentUser: JSON.parse(localStorage.getItem('alfauser'))?.role
      });
      
      // Check if user is admin before making request
      const currentUser = JSON.parse(localStorage.getItem('alfauser'));
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('You must be logged in as an admin to update order status');
      }
      
      const result = await updateOrderStatus(order._id, newStatus);
      console.log('Order status updated successfully:', result);
      
      // Call parent callback to update the order list
      if (onStatusChange) {
        onStatusChange(result.order);
      }
      
      showSuccess(`Order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status code:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = 'Failed to update order status';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 403) {
          errorMessage = 'Access denied: Only admins can update order status';
        } else if (error.response.status === 404) {
          errorMessage = 'Order not found';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid request';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error: Please try again later';
        } else {
          errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error: Unable to connect to server. Please check if the server is running.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      showError(errorMessage);
      setSelectedStatus(order.status); // Reset to original status
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'secondary';
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <select
        className={`form-select form-select-sm bg-${getStatusColor(selectedStatus)} text-white border-0`}
        value={selectedStatus}
        onChange={(e) => {
          setSelectedStatus(e.target.value);
          handleStatusChange(e.target.value);
        }}
        disabled={isUpdating}
        style={{ minWidth: '120px' }}
      >
        {statusOptions.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            className="text-dark"
          >
            {option.label}
          </option>
        ))}
      </select>
      {isUpdating && (
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Updating...</span>
        </div>
      )}
    </div>
  );
};

export default OrderStatusChanger;
