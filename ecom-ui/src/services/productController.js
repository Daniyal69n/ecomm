const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// Get a single product by ID
export const getProductById = async (id) => {
  try {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const user = JSON.parse(localStorage.getItem('alfauser'));
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch product: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};
// Product service functions for API
// Use proxy path for development or environment variable


export const getProducts = async () => {
  try {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const user = JSON.parse(localStorage.getItem('alfauser'));
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    const res = await fetch(`${API_URL}/products`, { 
      method: 'GET',
      headers,
      mode: 'cors' // Explicitly request CORS mode
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

export const createProduct = async (formData) => {
  try {
    let headers = {};
    // Get token from localStorage
    const user = JSON.parse(localStorage.getItem('alfauser'));
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
    if (!(formData instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers,
      mode: 'cors', // Explicitly request CORS mode
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    });
    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      throw new Error(data.message || 'Failed to create product');
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    console.error('Create product error:', err);
    throw err;
  }
};