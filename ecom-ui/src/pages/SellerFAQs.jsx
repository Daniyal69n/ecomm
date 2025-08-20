import React, { useState, useEffect } from 'react';
import { getActiveFAQs } from '../services/faqService';
import { 
  FiHelpCircle, 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp,
  FiMaximize2,
  FiMinimize2,
  FiMessageCircle
} from 'react-icons/fi';

const SellerFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    // Filter FAQs based on search query
    if (searchQuery.trim()) {
      const filtered = faqs.filter(faq => 
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchQuery, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await getActiveFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFaqs.map(faq => faq._id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="seller-faqs-container">
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="mb-3">
            <FiHelpCircle className="text-primary" style={{ fontSize: '3rem' }} />
          </div>
          <h1 className="display-5 fw-bold text-primary mb-3">
            Frequently Asked Questions
          </h1>
          <p className="lead text-muted">
            Find answers to common questions about selling on our platform
          </p>
        </div>

        {/* Search and Controls */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="search-container position-relative">
              <FiSearch className="search-icon position-absolute" />
              <input
                type="text"
                className="form-control form-control-lg ps-5"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary flex-fill"
                onClick={expandAll}
                disabled={loading}
              >
                <FiMaximize2 className="me-1" />
                Expand All
              </button>
              <button 
                className="btn btn-outline-secondary flex-fill"
                onClick={collapseAll}
                disabled={loading}
              >
                <FiMinimize2 className="me-1" />
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mb-3">
            <small className="text-muted">
              Found {filteredFaqs.length} result(s) for "{searchQuery}"
            </small>
          </div>
        )}

        {/* FAQ Accordion */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-5">
            <FiHelpCircle className="text-muted mb-3" style={{ fontSize: '4rem' }} />
            <h4 className="text-muted">
              {searchQuery ? 'No FAQs found matching your search' : 'No FAQs available'}
            </h4>
            {searchQuery && (
              <p className="text-muted">
                Try adjusting your search terms or 
                <button 
                  className="btn btn-link p-0 ms-1"
                  onClick={() => setSearchQuery('')}
                >
                  view all FAQs
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="accordion accordion-flush" id="faqAccordion">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedItems.has(faq._id);
              return (
                <div key={faq._id} className="accordion-item faq-item mb-3">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${!isExpanded ? 'collapsed' : ''}`}
                      type="button"
                      onClick={() => toggleExpanded(faq._id)}
                    >
                      <div className="d-flex align-items-center w-100">
                        <div className="faq-number me-3">
                          {index + 1}
                        </div>
                        <div className="flex-grow-1 text-start">
                          <h6 className="mb-0">{faq.title}</h6>
                        </div>
                        <div className="ms-2">
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${isExpanded ? 'show' : ''}`}>
                    <div className="accordion-body">
                      <div className="faq-description">
                        {faq.description.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-2">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

       
      </div>

      <style jsx>{`
        .seller-faqs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
        }

        .search-container .search-icon {
          top: 50%;
          left: 15px;
          transform: translateY(-50%);
          color: #6c757d;
          z-index: 10;
        }

        .faq-item {
          border: none;
          border-radius: 12px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }

        .accordion-button {
          background: white;
          border: none;
          border-radius: 12px !important;
          padding: 20px 24px;
          font-weight: 500;
          color: #2c3e50;
          transition: all 0.3s ease;
        }

        .accordion-button:not(.collapsed) {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          box-shadow: none;
        }

        .accordion-button:focus {
          border: none;
          box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
        }

        .accordion-button::after {
          display: none;
        }

        .faq-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          color: #495057;
        }

        .accordion-button:not(.collapsed) .faq-number {
          background: rgba(255,255,255,0.2);
          color: white;
          flex-shrink: 0;
        }

        .accordion-body {
          padding: 24px;
          background: white;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .faq-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #495057;
        }

        .form-control {
          border-radius: 12px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.15);
        }

        .btn {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }

        .btn-outline-primary {
          border: 2px solid #007bff;
          color: #007bff;
        }

        .btn-outline-primary:hover {
          background: #007bff;
          border-color: #007bff;
          transform: translateY(-1px);
        }

        .help-section {
          border: 2px solid rgba(0, 123, 255, 0.1);
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(0, 86, 179, 0.05) 100%) !important;
        }

        @media (max-width: 768px) {
          .accordion-button {
            padding: 16px 20px;
          }
          
          .faq-number {
            width: 28px;
            height: 28px;
            font-size: 0.8rem;
          }
          
          .accordion-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerFAQs;
