import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUserModal from './EditUserModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      showError('Failed to delete user');
    }
  };

  const handleApprove = async (userId, approved) => {
    try {
      const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
      await axios.put(`${API_URL}/users/seller/${userId}`, { approved: !approved }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((u) => u._id === userId ? { ...u, approved: !approved } : u));
    } catch (err) {
      showError('Failed to update approval');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h3 className='title'>Users Management</h3>
      {/* Mobile List View */}
      <div className="d-block d-md-none">
        {users.map(user => (
          <div key={user._id} style={{
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
              {user.identity ? (
                <img src={user.identity} alt="Verification" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #dee2e6', cursor: 'pointer' }} onClick={() => window.open(user.identity, '_blank')} title="Click to view full image" />
              ) : (
                <span style={{ color: '#6c757d', fontSize: 12 }}>No photo</span>
              )}
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
              <div style={{ color: '#6c757d', fontSize: 13 }}>{user.email}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
              <div><strong>Phone:</strong> {user.phone}</div>
              <div><strong>Credit:</strong> <span style={{ color: user.creditAmount > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>${user.creditAmount || 0}</span></div>
              <div><strong>Pending:</strong> <span style={{ color: user.pendingAmount > 0 ? '#ffc107' : '#6c757d', fontWeight: 'bold' }}>${user.pendingAmount || 0}</span></div>
              <div><strong>Login Code:</strong> {user.loginVerificationCode ? <span style={{ color: '#0d6efd', fontWeight: 'bold', fontSize: 13 }}>{user.loginVerificationCode}</span> : <span style={{ color: '#6c757d', fontSize: 12 }}>None</span>}</div>
            </div>
            {user.role !== 'admin' && (
              <div className="actions" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="action-btn" onClick={() => setEditUser(user)}>Edit</button>
                <button className="action-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                <button className={`action-btn ${user.approved ? 'approved' : 'not-approved'}`} onClick={() => handleApprove(user._id, user.approved)}>
                  {user.approved ? 'Already Approved' : 'Approve user now'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Desktop Table View */}
      <div className="table-responsive d-none d-md-block">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Credit Balance</th>
              <th>Pending Balance</th>
              <th>Verification Image</th>
              <th>Login Code</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span style={{ 
                    color: user.creditAmount > 0 ? '#28a745' : '#dc3545',
                    fontWeight: 'bold'
                  }}>
                    ${user.creditAmount || 0}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    color: user.pendingAmount > 0 ? '#ffc107' : '#6c757d',
                    fontWeight: 'bold'
                  }}>
                    ${user.pendingAmount || 0}
                  </span>
                </td>
                <td>
                  {user.identity ? (
                    <div style={{ textAlign: 'center' }}>
                      <img 
                        src={user.identity} 
                        alt="Verification" 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          border: '1px solid #dee2e6',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(user.identity, '_blank')}
                        title="Click to view full image"
                      />
                    </div>
                  ) : (
                    <span style={{ color: '#6c757d', fontSize: '12px' }}>No photo</span>
                  )}
                </td>
                <td>
                  {user.loginVerificationCode ? (
                    <span style={{ color: '#0d6efd', fontWeight: 'bold', fontSize: '13px' }}>{user.loginVerificationCode}</span>
                  ) : (
                    <span style={{ color: '#6c757d', fontSize: '12px' }}>None</span>
                  )}
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <div className="actions">
                      <button className="action-btn" onClick={() => setEditUser(user)}>Edit</button>
                      <button className="action-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                      <button className={`action-btn ${user.approved ? 'approved' : 'not-approved'}`} onClick={() => handleApprove(user._id, user.approved)}>
                        {user.approved ? 'Already Approved' : 'Approve user now'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={fetchUsers} />
      )}
    </div>
  );
}

import { showError } from '../components/toast';
export default AdminUsers;
