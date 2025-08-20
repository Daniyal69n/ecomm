import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Signup function for new users (seller)
// Expects: name, email, password, phone, shopName, identity (base64 image)
export const signup = async ({ name, email, password, phone, shopName, identity }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
      phone,
      shopName,
      identity
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const login = async (email, password, loginVerificationCode) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password, loginVerificationCode });
    // Save user to localStorage if needed
    if (response.data && response.data.user) {
      localStorage.setItem('alfauser', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
