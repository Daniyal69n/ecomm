import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Admin FAQ Services
export const getAllFAQs = async () => {
  try {
    const response = await axios.get(`${API_URL}/faqs`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch FAQs' };
  }
};

export const getFAQ = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/faqs/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch FAQ' };
  }
};

export const createFAQ = async (faqData) => {
  try {
    const response = await axios.post(`${API_URL}/faqs`, faqData, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create FAQ' };
  }
};

export const updateFAQ = async (id, faqData) => {
  try {
    const response = await axios.put(`${API_URL}/faqs/${id}`, faqData, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update FAQ' };
  }
};

export const deleteFAQ = async (id) => {
  try {
    await axios.delete(`${API_URL}/faqs/${id}`, {
      headers: getAuthHeader()
    });
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete FAQ' };
  }
};

export const updateFAQOrder = async (faqs) => {
  try {
    await axios.put(`${API_URL}/faqs/order/update`, { faqs }, {
      headers: getAuthHeader()
    });
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update FAQ order' };
  }
};

// Public FAQ Services
export const getActiveFAQs = async () => {
  try {
    const response = await axios.get(`${API_URL}/faqs/active`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch FAQs' };
  }
};
