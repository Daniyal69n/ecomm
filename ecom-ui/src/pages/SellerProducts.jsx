import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h4>Product List</h4>
      <div className="table-responsive">
        <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Discounted Price</th>
            <th>Image</th>
          
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id || product.id}>
              <td>{product.name?.substring(0, 30) || product.title?.substring(0, 30) }</td>
              <td>${product.price}</td>
              <td>${product.discountedPrice || product.discountPrice || '-'}</td>
              <td>
                {product.image || product.imageUrl ? (
                  <img src={product.image || product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                ) : (
                  'No Image'
                )}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default SellerProducts;
