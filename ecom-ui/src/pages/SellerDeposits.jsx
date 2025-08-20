import React, { useState, useEffect } from 'react';
import { getActiveDeposits } from '../services/depositService';
import toast from 'react-hot-toast';
import { 
  FiInfo, 
  FiRefreshCw, 
  FiSearch, 
  FiDollarSign,
  FiChevronRight,
  FiCalendar
} from 'react-icons/fi';

const SellerDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    // Filter deposits based on search query
    if (searchQuery.trim()) {
      const filtered = deposits.filter(deposit => 
        deposit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deposit.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDeposits(filtered);
    } else {
      setFilteredDeposits(deposits);
    }
  }, [searchQuery, deposits]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const data = await getActiveDeposits();
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

  const handleDepositClick = (deposit) => {
    setSelectedDeposit(deposit);
  };

  const handleBackToList = () => {
    setSelectedDeposit(null);
    setSearchQuery('');
  };

  const handleRefresh = () => {
    fetchDeposits();
    toast.success('Deposit information refreshed');
  };

  // If a deposit is selected, show the detail view
  if (selectedDeposit) {
    return (
      <div className="seller-deposits-container">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-success text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-light btn-sm me-3"
                        onClick={handleBackToList}
                      >
                        ← Back to List
                      </button>
                      <h4 className="mb-0">
                        <FiDollarSign className="me-2" />
                        {selectedDeposit.title}
                      </h4>
                    </div>
                    <div className="text-white-50">
                      <FiCalendar className="me-2" />
                      {new Date(selectedDeposit.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div 
                    className="deposit-detail-content"
                    dangerouslySetInnerHTML={{ __html: selectedDeposit.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <div className="seller-deposits-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">Deposit Information</h2>
                <p className="text-muted mb-0">Important information about deposits and banking</p>
              </div>
              <button
                className="btn btn-outline-success"
                onClick={handleRefresh}
                disabled={loading}
              >
                <FiRefreshCw className={`me-2 ${loading ? 'spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="row mb-4">
          <div className="col-md-6 col-lg-4">
            <div className="search-container position-relative">
              <FiSearch className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search deposit information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Deposits List */}
        <div className="row">
          <div className="col-12">
            {loading ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading deposit information...</p>
                </div>
              </div>
            ) : filteredDeposits?.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <FiInfo size={48} className="text-muted mb-3" />
                  <h4 className="text-muted">
                    {searchQuery ? 'No deposits found matching your search' : 'No Deposit Information Available'}
                  </h4>
                  <p className="text-muted">
                    {searchQuery 
                      ? 'Try adjusting your search terms to find relevant deposit information.' 
                      : 'Deposit information will appear here once added by administrators.'
                    }
                  </p>
                  {searchQuery && (
                    <button
                      className="btn btn-outline-success mt-2"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    Available Deposit Information ({filteredDeposits.length})
                  </h5>
                  {searchQuery && (
                    <small className="text-muted">
                      Showing {filteredDeposits.length} of {deposits.length} items
                    </small>
                  )}
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {filteredDeposits?.map((deposit, index) => (
                      <div 
                        key={deposit._id} 
                        className="list-group-item list-group-item-action cursor-pointer"
                        onClick={() => handleDepositClick(deposit)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="deposit-icon">
                              <FiDollarSign size={20} className="text-success" />
                            </div>
                          </div>
                          
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">
                              {deposit.title}
                            </h6>
                            <div className="deposit-preview text-muted">
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: deposit.content.substring(0, 150) + (deposit.content.length > 150 ? '...' : '') 
                                }}
                              />
                            </div>
                            <small className="text-muted">
                              <FiCalendar className="me-1" />
                              Updated {new Date(deposit.updatedAt).toLocaleDateString()}
                            </small>
                          </div>
                          
                          <div className="flex-shrink-0 ms-3">
                            <FiChevronRight className="text-muted" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Card */}
        {!loading && deposits?.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card bg-light shadow-sm">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="stat-item">
                        <h4 className="text-success">{deposits.length}</h4>
                        <small className="text-muted">Total Information Items</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-item">
                        <h4 className="text-primary">
                          {deposits.filter(d => new Date(d.updatedAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                        </h4>
                        <small className="text-muted">Updated This Week</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="stat-item">
                        <h4 className="text-info">
                          {new Date(Math.max(...deposits.map(d => new Date(d.updatedAt)))).toLocaleDateString()}
                        </h4>
                        <small className="text-muted">Last Updated</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .seller-deposits-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .list-group-item:hover {
          background-color: rgba(40, 167, 69, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .deposit-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(40, 167, 69, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .deposit-preview {
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 5px;
        }

        .deposit-preview p {
          margin: 0;
          display: inline;
        }

        .deposit-preview h1,
        .deposit-preview h2,
        .deposit-preview h3,
        .deposit-preview h4,
        .deposit-preview h5,
        .deposit-preview h6 {
          margin: 0;
          display: inline;
          font-size: inherit;
          font-weight: 500;
        }

        .deposit-detail-content {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #495057;
        }

        .deposit-detail-content h1,
        .deposit-detail-content h2,
        .deposit-detail-content h3 {
          margin-top: 25px;
          margin-bottom: 15px;
          font-weight: bold;
          color: #28a745;
        }

        .deposit-detail-content h1 {
          font-size: 2rem;
          border-bottom: 2px solid #28a745;
          padding-bottom: 10px;
        }

        .deposit-detail-content h2 {
          font-size: 1.6rem;
        }

        .deposit-detail-content h3 {
          font-size: 1.3rem;
        }

        .deposit-detail-content p {
          margin-bottom: 15px;
          text-align: justify;
        }

        .deposit-detail-content ul,
        .deposit-detail-content ol {
          padding-left: 25px;
          margin-bottom: 15px;
        }

        .deposit-detail-content li {
          margin-bottom: 8px;
        }

        .deposit-detail-content strong {
          color: #28a745;
        }

        .deposit-detail-content blockquote {
          border-left: 4px solid #28a745;
          margin: 20px 0;
          padding: 15px 20px;
          background-color: rgba(40, 167, 69, 0.05);
          border-radius: 0 8px 8px 0;
        }

        .form-control {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          transition: border-color 0.2s ease;
        }

        .form-control:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }

        .btn {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .stat-item {
          padding: 10px;
        }

        .stat-item h4 {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SellerDeposits;
