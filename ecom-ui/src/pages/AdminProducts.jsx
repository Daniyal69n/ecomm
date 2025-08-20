import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', discountedPrice: '', quantity: '', description: '', image: '', category: '' });
  const [saving, setSaving] = useState(false);

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

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      await axios.delete(`${API_URL}/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price || '',
      discountedPrice: product.discountedPrice || product.discountPrice || '',
      quantity: product.quantity || '',
      description: product.description || '',
      image: product.image || product.imageUrl || '',
      category: product.category || ''
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      const res = await axios.put(`${API_URL}/products/${editProduct._id || editProduct.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map((p) => (p._id === (editProduct._id || editProduct.id) ? res.data.product : p)));
      closeEditModal();
    } catch (err) {
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h4>Product List</h4>
      {/* Edit Modal */}
      {editModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 320, maxWidth: 400, width: '100%', boxShadow: '0 2px 12px rgba(30,41,59,0.15)' }}>
            <h5>Edit Product</h5>
            {/*
            {editForm.image && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <img src={editForm.image} alt="Product" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #dee2e6' }} />
              </div>
            )}
            */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="form-control" />
              <input name="price" value={editForm.price} onChange={handleEditChange} placeholder="Price" className="form-control" type="number" min="0" />
              <input name="discountedPrice" value={editForm.discountedPrice} onChange={handleEditChange} placeholder="Discounted Price" className="form-control" type="number" min="0" />
              <input name="quantity" value={editForm.quantity} onChange={handleEditChange} placeholder="Quantity" className="form-control" type="number" min="0" />
              <input name="category" value={editForm.category} onChange={handleEditChange} placeholder="Category" className="form-control" />
              <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" rows={4} className="form-control" />
              {/* <input name="image" value={editForm.image} onChange={handleEditChange} placeholder="Image URL (or base64)" className="form-control" /> */}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeEditModal} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile List View */}
      <div className="d-block d-md-none">
        {products.map(product => (
          <div key={product._id || product.id} style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(30,41,59,0.08)',
            marginBottom: 16,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {product.image || product.imageUrl ? (
                <img src={product.image || product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #dee2e6' }} />
              ) : (
                <span style={{ color: '#6c757d', fontSize: 12 }}>No Image</span>
              )}
              <div style={{ fontWeight: 700, fontSize: 16 }}>{product.name?.substring(0, 30) || product.title?.substring(0, 30)}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
              <div><strong>Price:</strong> ${product.price}</div>
              <div><strong>Discounted:</strong> {product.discountedPrice || product.discountPrice || '-'}</div>
            </div>
            <div className="actions" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="action" onClick={() => openEditModal(product)}>
                <MdEdit size={22} color="#007bff" />
              </button>
              <button className="action" onClick={() => handleDelete(product._id || product.id)}>
                <MdDeleteForever size={24} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Discounted Price</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id || product.id}>
              <td>{product.name?.substring(0, 30) || product.title?.substring(0, 30) }</td>
              <td>{product.price}</td>
              <td>{product.discountedPrice || product.discountPrice || '-'}</td>
              <td>
                {product.image || product.imageUrl ? (
                  <img src={product.image || product.imageUrl} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                ) : (
                  'No Image'
                )}
              </td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button className="action" onClick={() => openEditModal(product)}>
                  <MdEdit size={22} color="#007bff" />
                </button>
                <button className="action" onClick={() => handleDelete(product._id || product.id)}>
                  <MdDeleteForever size={24} color="red" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AdminProducts;
