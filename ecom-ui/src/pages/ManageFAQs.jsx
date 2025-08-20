import React, { useState, useEffect } from 'react';
import { 
  getAllFAQs, 
  createFAQ, 
  updateFAQ, 
  deleteFAQ,
  updateFAQOrder 
} from '../services/faqService';
import toast from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp,
  FiSave,
  FiX,
  FiSearch,
  FiHelpCircle
} from 'react-icons/fi';
import { BsGripVertical } from 'react-icons/bs';

const ManageFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    // Filter FAQs based on search query
    if (searchQuery.trim()) {
      const filtered = faqs.filter(faq => 
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (faq.createdBy?.name && faq.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchQuery, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await getAllFAQs();
      const faqsArray = Array.isArray(data) ? data : [];
      setFaqs(faqsArray);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      toast.error(error.message || 'Failed to fetch FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        await updateFAQ(editingId, formData);
        toast.success('FAQ updated successfully');
      } else {
        await createFAQ(formData);
        toast.success('FAQ created successfully');
        // Clear search query to show all FAQs including the new one
        setSearchQuery('');
      }
      
      await fetchFAQs();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setFormData({
      title: faq.title,
      description: faq.description,
      order: faq.order
    });
    setEditingId(faq._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteFAQ(id);
      toast.success('FAQ deleted successfully');
      await fetchFAQs();
    } catch (error) {
      toast.error(error.message || 'Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order: 0
    });
    setEditingId(null);
    setShowAddForm(false);
    // Clear search query when form is reset to show all FAQs including new ones
    setSearchQuery('');
  };

  const toggleExpanded = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="manage-faqs-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Manage FAQs</h2>
            <p className="text-muted mb-0">Create and manage frequently asked questions</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
          >
            <FiPlus className="me-2" />
            Add New FAQ
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FiHelpCircle className="me-2" />
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter FAQ title..."
                        required
                        maxLength={200}
                      />
                      <small className="text-muted">
                        {formData.title.length}/200 characters
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Order</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                        placeholder="Display order"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter detailed FAQ description..."
                    required
                    maxLength={2000}
                  />
                  <small className="text-muted">
                    {formData.description.length}/2000 characters
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status" />
                    ) : (
                      <FiSave className="me-2" />
                    )}
                    {editingId ? 'Update FAQ' : 'Create FAQ'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    <FiX className="me-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQs List */}
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h5 className="mb-0">
                  All FAQs ({faqs.length})
                </h5>
                {searchQuery && (
                  <small className="text-muted">
                    Showing {filteredFaqs.length} of {faqs.length} FAQs
                  </small>
                )}
              </div>
              <div className="col-md-6">
                <div className="search-container position-relative">
                  <FiSearch className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredFaqs?.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>
                  {searchQuery ? 'No FAQs found matching your search' : 'No FAQs Found'}
                </h4>
                <p>
                  {searchQuery 
                    ? 'Try adjusting your search terms or create a new FAQ.' 
                    : 'Click "Add New FAQ" to create your first FAQ.'
                  }
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {filteredFaqs?.map((faq, index) => (
                  <div key={faq._id} className="list-group-item">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <BsGripVertical className="text-muted" />
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">
                              {faq.title}
                              <span className="badge bg-light text-dark ms-2">
                                Order: {faq.order}
                              </span>
                            </h6>
                            <small className="text-muted">
                              Created {new Date(faq.createdAt).toLocaleDateString()} 
                              {faq.createdBy && ` by ${faq.createdBy.name}`}
                            </small>
                          </div>
                          
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => toggleExpanded(faq._id)}
                            >
                              {expandedFaq === faq._id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEdit(faq)}
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(faq._id)}
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        
                        {expandedFaq === faq._id && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <h6 className="fw-semibold mb-2">Description:</h6>
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {faq.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .manage-faqs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-header {
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .list-group-item {
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: background-color 0.2s ease;
        }

        .list-group-item:hover {
          background-color: rgba(0,0,0,0.02);
        }

        .form-control, .form-select {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          transition: border-color 0.2s ease;
        }

        .form-control:focus, .form-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .btn {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-lg {
          padding: 12px 24px;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }

        .badge {
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .spinner-border {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ManageFAQs;
