import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Admin Deposit Services
export const getAllDeposits = async () => {
  try {
    const response = await axios.get(`${API_URL}/deposits`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deposits:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch deposits');
  }
};

export const getDeposit = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/deposits/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deposit:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch deposit');
  }
};

export const createDeposit = async (depositData) => {
  try {
    const response = await axios.post(`${API_URL}/deposits`, depositData, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating deposit:', error);
    throw new Error(error.response?.data?.message || 'Failed to create deposit');
  }
};

export const updateDeposit = async (id, depositData) => {
  try {
    const response = await axios.put(`${API_URL}/deposits/${id}`, depositData, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating deposit:', error);
    throw new Error(error.response?.data?.message || 'Failed to update deposit');
  }
};

export const deleteDeposit = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/deposits/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting deposit:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete deposit');
  }
};

export const updateDepositOrder = async (id, order) => {
  try {
    const response = await axios.put(`${API_URL}/deposits/${id}/order`, { order }, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating deposit order:', error);
    throw new Error(error.response?.data?.message || 'Failed to update deposit order');
  }
};

// Public/Seller Deposit Services
export const getActiveDeposits = async () => {
  try {
    const headers = getAuthHeader();
    // Debug: log token and config
    console.log('getActiveDeposits: token', headers.Authorization);
    const config = Object.keys(headers).length > 0 ? { headers } : {};
    console.log('getActiveDeposits: config', config);
    const response = await axios.get(`${API_URL}/deposits/active`, config);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching active deposits:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch deposits');
  }
};

const depositService = {
  getAllDeposits,
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
  updateDepositOrder,
  getActiveDeposits
};

export default depositService;
