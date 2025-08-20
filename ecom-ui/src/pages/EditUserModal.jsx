import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const EditUserModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    phone: user.phone || '',
    shopName: user.shopName || '',
    creditAmount: user.creditAmount || 0,
    totalOrders: user.totalOrders || 0,
    pendingAmount: user.pendingAmount || 0,
    approved: user.approved || false,
    password: '',
    loginVerificationCode: user.loginVerificationCode || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await axios.put(`${API_URL}/users/seller/${user._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSaved();
      onClose();
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
             
              
              <div className="mb-2">
                <label>Credit Amount</label>
                <input name="creditAmount" type="number" className="form-control" value={form.creditAmount} onChange={handleChange} />
              </div>
             
              <div className="mb-2">
                <label>Pending Amount</label>
                <input name="pendingAmount" type="number" className="form-control" value={form.pendingAmount} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>Password (leave blank to keep unchanged)</label>
                <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>Login Verification Code (optional, set by admin only)</label>
                <input name="loginVerificationCode" type="text" className="form-control" value={form.loginVerificationCode} onChange={handleChange} />
                <small className="text-muted">Leave blank to disable code requirement for this user.</small>
              </div>
              {/* <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="approved"
                  id="approvedCheck"
                  checked={form.approved}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="approvedCheck">
                  Approved
                </label>
              </div> */}
              {error && <div className="text-danger">{error}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
