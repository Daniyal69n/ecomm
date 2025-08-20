import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  getAllDeposits, 
  createDeposit, 
  updateDeposit, 
  deleteDeposit 
} from '../services/depositService';
import axios from 'axios';
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
  FiDollarSign,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiType
} from 'react-icons/fi';
import { 
  BsGripVertical,
  BsListOl,
  BsQuote,
  BsCode,
  BsArrowCounterclockwise,
  BsArrowClockwise
} from 'react-icons/bs';

const ManageDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedDeposit, setExpandedDeposit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order: 0,
    seller: ''
  });
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    // Fetch sellers for dropdown
    const fetchSellers = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('alfauser'))?.token;
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSellers(res.data.filter(u => u.role === 'seller'));
      } catch (err) {
        setSellers([]);
      }
    };
    fetchSellers();
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-3 border rounded-lg',
      },
    },
  });

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  useEffect(() => {
    // Filter deposits based on search query
    if (searchQuery.trim()) {
      const filtered = deposits.filter(deposit => 
        deposit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deposit.createdBy?.name && deposit.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDeposits(filtered);
    } else {
      setFilteredDeposits(deposits);
    }
  }, [searchQuery, deposits]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const data = await getAllDeposits();
      const depositsArray = Array.isArray(data) ? data : [];
      setDeposits(depositsArray);
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
      toast.error(error.message || 'Failed to fetch deposits');
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        await updateDeposit(editingId, formData);
        toast.success('Deposit updated successfully');
      } else {
        await createDeposit(formData);
        toast.success('Deposit created successfully');
        setSearchQuery('');
      }
      
      await fetchDeposits();
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (deposit) => {
    setFormData({
      title: deposit.title,
      content: deposit.content,
      order: deposit.order,
      seller: deposit.seller?._id || ''
    });
    setEditingId(deposit._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this deposit information?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteDeposit(id);
      toast.success('Deposit deleted successfully');
      await fetchDeposits();
    } catch (error) {
      toast.error(error.message || 'Failed to delete deposit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      order: 0,
      seller: ''
    });
    if (editor) {
      editor.commands.setContent('');
    }
    setEditingId(null);
    setShowAddForm(false);
    setSearchQuery('');
  };

  const toggleExpanded = (id) => {
    setExpandedDeposit(expandedDeposit === id ? null : id);
  };

  // Toolbar component for Tiptap editor
  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }

    return (
      <div className="editor-menubar p-2 border-bottom bg-light d-flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`btn btn-sm ${editor.isActive('bold') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Bold"
        >
          <FiBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`btn btn-sm ${editor.isActive('italic') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Italic"
        >
          <FiItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`btn btn-sm ${editor.isActive('strike') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Strikethrough"
        >
          <FiUnderline />
        </button>
        
        <div className="vr mx-1"></div>

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`btn btn-sm ${editor.isActive('heading', { level: 1 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`btn btn-sm ${editor.isActive('heading', { level: 2 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`btn btn-sm ${editor.isActive('heading', { level: 3 }) ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`btn btn-sm ${editor.isActive('paragraph') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Paragraph"
        >
          P
        </button>

        <div className="vr mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Bullet List"
        >
          <FiList />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Numbered List"
        >
          <BsListOl />
        </button>

        <div className="vr mx-1"></div>

        {/* Block Elements */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-sm ${editor.isActive('blockquote') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Quote"
        >
          <BsQuote />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`btn btn-sm ${editor.isActive('code') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Inline Code"
        >
          <BsCode />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`btn btn-sm ${editor.isActive('codeBlock') ? 'btn-primary' : 'btn-outline-secondary'}`}
          title="Code Block"
        >
          {'{ }'}
        </button>

        <div className="vr mx-1"></div>

        {/* Actions */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="btn btn-sm btn-outline-secondary"
          title="Horizontal Line"
        >
          ━
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="btn btn-sm btn-outline-secondary"
          title="Line Break"
        >
          ↵
        </button>

        <div className="vr mx-1"></div>

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="btn btn-sm btn-outline-secondary"
          title="Undo"
        >
          <BsArrowCounterclockwise />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="btn btn-sm btn-outline-secondary"
          title="Redo"
        >
          <BsArrowClockwise />
        </button>
      </div>
    );
  };

  return (
    <div className="manage-deposits-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Manage Deposits</h2>
            <p className="text-muted mb-0">Create and manage deposit information for sellers</p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
          >
            <FiPlus className="me-2" />
            Add New Deposit Info
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <FiDollarSign className="me-2" />
                {editingId ? 'Edit Deposit Info' : 'Add New Deposit Info'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter deposit title..."
                        required
                        maxLength={200}
                      />
                      <small className="text-muted">
                        {formData.title.length}/200 characters
                      </small>
                    </div>
                  </div>
                  <div className="col-md-3">
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
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Assign to Seller</label>
                      <select
                        className="form-select form-select-lg"
                        value={formData.seller}
                        onChange={e => setFormData({...formData, seller: e.target.value})}
                      >
                        <option value="">-- None (General) --</option>
                        {sellers.map(seller => (
                          <option key={seller._id} value={seller._id}>
                            {seller.shopName || seller.name} ({seller.email})
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Leave blank for all sellers.</small>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Content <span className="text-danger">*</span>
                  </label>
                  <div className="tiptap-editor border rounded">
                    <MenuBar editor={editor} />
                    <div className="editor-content">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Use the toolbar above to format your deposit information with headings, lists, bold text, and more.
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
                    {editingId ? 'Update Deposit Info' : 'Create Deposit Info'}
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

        {/* Deposits List */}
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h5 className="mb-0">
                  All Deposits ({deposits.length})
                </h5>
                {searchQuery && (
                  <small className="text-muted">
                    Showing {filteredDeposits.length} of {deposits.length} deposits
                  </small>
                )}
              </div>
              <div className="col-md-6">
                <div className="search-container position-relative">
                  <FiSearch className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
                  <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Search deposits..."
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
            ) : filteredDeposits?.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>
                  {searchQuery ? 'No deposits found matching your search' : 'No Deposits Found'}
                </h4>
                <p>
                  {searchQuery 
                    ? 'Try adjusting your search terms or create a new deposit info.' 
                    : 'Click "Add New Deposit Info" to create your first deposit information.'
                  }
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {filteredDeposits?.map((deposit, index) => (
                  <div key={deposit._id} className="list-group-item">
                    <div className="d-flex align-items-start">
                      <div className="flex-shrink-0 me-3">
                        <BsGripVertical className="text-muted" />
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">
                              {deposit.title}
                              <span className="badge bg-light text-dark ms-2">
                                Order: {deposit.order}
                              </span>
                              {deposit.seller && (
                                <span className="badge bg-info text-dark ms-2">
                                  Seller: {deposit.seller.shopName || deposit.seller.name}
                                </span>
                              )}
                            </h6>
                            <small className="text-muted">
                              Created {new Date(deposit.createdAt).toLocaleDateString()} 
                              {deposit.createdBy && ` by ${deposit.createdBy.name}`}
                            </small>
                          </div>
                          
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => toggleExpanded(deposit._id)}
                            >
                              {expandedDeposit === deposit._id ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => handleEdit(deposit)}
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(deposit._id)}
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        
                        {expandedDeposit === deposit._id && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <h6 className="fw-semibold mb-2">Content:</h6>
                            <div 
                              className="deposit-content"
                              dangerouslySetInnerHTML={{ __html: deposit.content }}
                            />
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
        .manage-deposits-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
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
          border-color: #28a745;
          box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }

        .btn {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-lg {
          padding: 12px 24px;
        }

        .btn-success:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
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

        .tiptap-editor {
          min-height: 350px;
          border: 2px solid #e9ecef;
        }

        .tiptap-editor:focus-within {
          border-color: #28a745;
          box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }

        .editor-menubar {
          background: #f8f9fa !important;
          border-bottom: 1px solid #e9ecef !important;
        }

        .editor-menubar .btn {
          padding: 4px 8px;
          font-size: 0.875rem;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .editor-menubar .vr {
          height: 24px;
          opacity: 0.5;
        }

        .editor-content .ProseMirror {
          outline: none;
          min-height: 250px;
          padding: 15px;
          font-size: 1rem;
          line-height: 1.6;
        }

        .editor-content .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 20px 0 15px 0;
          color: #28a745;
          border-bottom: 2px solid #28a745;
          padding-bottom: 5px;
        }

        .editor-content .ProseMirror h2 {
          font-size: 1.6rem;
          font-weight: bold;
          margin: 18px 0 12px 0;
          color: #28a745;
        }

        .editor-content .ProseMirror h3 {
          font-size: 1.3rem;
          font-weight: bold;
          margin: 15px 0 10px 0;
          color: #495057;
        }

        .editor-content .ProseMirror p {
          margin-bottom: 12px;
        }

        .editor-content .ProseMirror ul, 
        .editor-content .ProseMirror ol {
          padding-left: 25px;
          margin-bottom: 12px;
        }

        .editor-content .ProseMirror li {
          margin-bottom: 5px;
        }

        .editor-content .ProseMirror blockquote {
          border-left: 4px solid #28a745;
          margin: 15px 0;
          padding: 10px 15px;
          background-color: rgba(40, 167, 69, 0.05);
          font-style: italic;
          border-radius: 0 5px 5px 0;
        }

        .editor-content .ProseMirror code {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 3px;
          padding: 2px 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .editor-content .ProseMirror pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 15px;
          margin: 15px 0;
          overflow-x: auto;
        }

        .editor-content .ProseMirror pre code {
          background: none;
          border: none;
          padding: 0;
        }

        .editor-content .ProseMirror hr {
          border: none;
          border-top: 2px solid #e9ecef;
          margin: 20px 0;
        }

        .editor-content .ProseMirror strong {
          font-weight: bold;
          color: #28a745;
        }

        .editor-content .ProseMirror em {
          font-style: italic;
        }

        .editor-content .ProseMirror s {
          text-decoration: line-through;
        }

        .deposit-content {
          font-size: 1rem;
          line-height: 1.6;
          color: #495057;
        }

        .deposit-content h1,
        .deposit-content h2,
        .deposit-content h3 {
          margin-top: 15px;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .deposit-content p {
          margin-bottom: 10px;
        }

        .deposit-content ul,
        .deposit-content ol {
          padding-left: 20px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default ManageDeposits;
