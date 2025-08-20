import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  console.log('OrderService: Getting auth header for user:', { 
    userId: user?._id, 
    role: user?.role, 
    hasToken: !!user?.token 
  });
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// Admin functions
export const createOrder = async (orderData) => {
  try {
    console.log('OrderService: Creating order with data:', orderData);
    console.log('OrderService: Auth header:', getAuthHeader());
    
    const response = await axios.post(`${API_URL}/orders`, orderData, {
      headers: getAuthHeader()
    });
    
    console.log('OrderService: Order created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('OrderService: Error creating order:', error);
    console.error('OrderService: Error response:', error.response?.data);
    console.error('OrderService: Error status:', error.response?.status);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}`, orderData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log('OrderService: Updating order status:', { orderId, status });
    console.log('OrderService: Auth header:', getAuthHeader());
    
    const response = await axios.post(`${API_URL}/orders/${orderId}/status`, 
      { status }, 
      { headers: getAuthHeader() }
    );
    
    console.log('OrderService: Status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('OrderService: Error updating order status:', error);
    console.error('OrderService: Error response:', error.response?.data);
    console.error('OrderService: Error status:', error.response?.status);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Seller functions
export const respondToOrder = async (orderId, response, rejectionReason = '') => {
  try {
    console.log('OrderService: Seller responding to order:', { orderId, response, rejectionReason });
    console.log('OrderService: Auth header:', getAuthHeader());
    
    const responseData = await axios.post(`${API_URL}/orders/${orderId}/response`, 
      { response, rejectionReason }, 
      { headers: getAuthHeader() }
    );
    
    console.log('OrderService: Seller response successful:', responseData.data);
    return responseData.data;
  } catch (error) {
    console.error('OrderService: Error responding to order:', error);
    console.error('OrderService: Error response:', error.response?.data);
    console.error('OrderService: Error status:', error.response?.status);
    throw error;
  }
};

// Alias for backward compatibility
export const sellerOrderResponse = respondToOrder;

// Get order statistics
export const getOrderStats = async (sellerId = null) => {
  try {
    const endpoint = sellerId ? `${API_URL}/orders/stats/${sellerId}` : `${API_URL}/orders/stats`;
    const response = await axios.get(endpoint, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
};
