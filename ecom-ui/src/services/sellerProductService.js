const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('alfauser'));
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': user?.token ? `Bearer ${user.token}` : ''
  };
};

// Get available products for seller to select from
export const getAvailableProducts = async () => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/available`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch available products: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

// Add product to seller's inventory
export const addProductToSeller = async (productData) => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/add`, {
      method: 'POST',
      headers,
      mode: 'cors',
      body: JSON.stringify(productData)
    });
    
    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      throw new Error(data.message || 'Failed to add product to inventory');
    }
    return await res.json();
  } catch (err) {
    console.error('Add product error:', err);
    throw err;
  }
};

// Get seller's products
export const getSellerProducts = async () => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/my-products`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch seller products: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

// Update seller product
export const updateSellerProduct = async (id, updateData) => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/${id}`, {
      method: 'PUT',
      headers,
      mode: 'cors',
      body: JSON.stringify(updateData)
    });
    
    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      throw new Error(data.message || 'Failed to update product');
    }
    return await res.json();
  } catch (err) {
    console.error('Update product error:', err);
    throw err;
  }
};

// Remove product from seller's inventory
export const removeSellerProduct = async (id) => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/${id}`, {
      method: 'DELETE',
      headers,
      mode: 'cors'
    });
    
    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      throw new Error(data.message || 'Failed to remove product');
    }
    return await res.json();
  } catch (err) {
    console.error('Remove product error:', err);
    throw err;
  }
};

// Get seller's products for admin (when creating orders)
export const getSellerProductsForAdmin = async (sellerId) => {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/seller-products/seller/${sellerId}`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch seller products: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};
