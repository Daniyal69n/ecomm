import React, { useState } from 'react';
import { createProduct } from '../services/productController';

function AdminCreateProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    discountedPrice: '',
    quantity: '',
    category: 'Newest',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageBase64('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const payload = {
      name: form.name,
      price: form.price,
      description: form.description,
      discountedPrice: form.discountedPrice,
      quantity: form.quantity,
      category: form.category,
      image: imageBase64 // base64 string or empty
    };
    try {
      await createProduct(payload);
      setSuccess('Product created successfully!');
      setForm({ name: '', price: '', description: '', image: '', discountedPrice: '', quantity: '', category: 'Newest' });
      setImageFile(null);
      setImageBase64('');
    } catch (err) {
      setError(err.message || 'Failed to create product');
    }
  };

  return (
    <div className="main-wrapper">
      <h4>Create Product</h4>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
       <div className="form-wrapper">
         <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="">Name</label>
          <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="">Price</label>
          <input name="price" type="number" className="form-control" placeholder="Price" value={form.price} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="">Discounted Price</label>
          <input name="discountedPrice" type="number" className="form-control" placeholder="Discounted Price" value={form.discountedPrice} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="">Quantity</label>
          <input name="quantity" type="number" className="form-control" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label htmlFor="">Category</label>
          <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
            <option value="Newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="most selling">Most Selling</option>
          </select>
        </div>
        <div className="col-12">
          <div className="image-preview">
          {imageFile && (
           <div className="image">
             <img src={imageBase64} alt="Product"  />
           </div>
          )}
            <label htmlFor="">Image</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="">Description</label>
          <textarea name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button type="submit" className="button" disabled={uploading}>{uploading ? 'Uploading...' : 'Create'}</button>
        </div>
      </form>
       </div>
    </div>
  );
}

export default AdminCreateProduct;
