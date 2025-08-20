import React from 'react';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'picked': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getResponseBadgeClass = (response) => {
    switch (response) {
      case 'pending': return 'bg-warning';
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
    >
      <div className="modal-dialog modal-xl" style={{ maxWidth: '90%' }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Enhanced Header */}
          <div 
            className="modal-header border-0 text-white p-4"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="d-flex align-items-center w-100">
              <div className="bg-white bg-opacity-20 rounded-circle p-3 me-3">
                <i className="bi bi-receipt fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <h4 className="mb-1 fw-bold">Order Details</h4>
                <div className="d-flex align-items-center">
                  <span className="badge bg-white text-dark me-2 px-3 py-2 fw-bold">
                    #{order.orderNumber}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(order.status)} px-3 py-2 fw-bold`}>
                    {order.status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white btn-lg"
                onClick={onClose}
                style={{ filter: 'brightness(0) invert(1)' }}
              ></button>
            </div>
          </div>

          <div className="modal-body p-0">
            {/* Order Summary Cards */}
            <div className="p-4 bg-light">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center p-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-currency-dollar fs-4 text-primary"></i>
                      </div>
                      <h5 className="fw-bold text-primary mb-1">${order.totalAmount?.toFixed(2)}</h5>
                      <small className="text-muted">Total Amount</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center p-4">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-graph-up fs-4 text-success"></i>
                      </div>
                      <h5 className="fw-bold text-success mb-1">${order.totalProfit?.toFixed(2)}</h5>
                      <small className="text-muted">Total Profit</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center p-4">
                      <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-box fs-4 text-info"></i>
                      </div>
                      <h5 className="fw-bold text-info mb-1">{order.items?.length || 0}</h5>
                      <small className="text-muted">Items</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 h-100 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body text-center p-4">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-calendar fs-4 text-warning"></i>
                      </div>
                      <h6 className="fw-bold text-warning mb-1 small">{formatDate(order.createdAt).split(',')[0]}</h6>
                      <small className="text-muted">Created</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="row g-4">
                {/* Seller Information */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                    <div className="card-header border-0 bg-transparent">
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-person-badge me-2 text-primary"></i>
                        Seller Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{order.seller?.name}</h6>
                          <small className="text-muted">{order.seller?.email}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-shop text-info"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{order.seller?.shopName}</h6>
                          <small className="text-muted">Shop Name</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-wallet text-success"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold text-success">${order.seller?.creditAmount?.toFixed(2) || '0.00'}</h6>
                          <small className="text-muted">Current Balance</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="col-lg-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                    <div className="card-header border-0 bg-transparent">
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-info-circle me-2 text-primary"></i>
                        Order Information
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <i className="bi bi-hash text-primary mb-2"></i>
                            <h6 className="fw-bold mb-0">{order.orderNumber}</h6>
                            <small className="text-muted">Order ID</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center p-3 bg-light rounded-3">
                            <span className={`badge ${getResponseBadgeClass(order.sellerResponse)} mb-2`}>
                              <i className="bi bi-chat-square-text me-1"></i>
                            </span>
                            <h6 className="fw-bold mb-0">{order.sellerResponse?.toUpperCase()}</h6>
                            <small className="text-muted">Response</small>
                          </div>
                        </div>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header border-0 bg-transparent">
                    <h6 className="fw-bold text-dark mb-0">
                      <i className="bi bi-box-seam me-2 text-primary"></i>
                      Order Items ({order.items?.length || 0})
                    </h6>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0 fw-semibold py-3">Product</th>
                            <th className="border-0 fw-semibold py-3 text-center">Quantity</th>
                            <th className="border-0 fw-semibold py-3 text-center">Unit Price</th>
                            <th className="border-0 fw-semibold py-3 text-center">Total</th>
                            <th className="border-0 fw-semibold py-3 text-center">Profit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, index) => (
                            <tr key={index}>
                              <td className="py-3">
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                                    <i className="bi bi-box text-primary"></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-0 fw-semibold">{item.product?.name}</h6>
                                    <small className="text-muted">SKU: {item.product?._id?.slice(-6).toUpperCase()}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center">
                                <span className="badge bg-light text-dark px-3 py-2 fw-bold">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-3 text-center fw-semibold">
                                ${item.price?.toFixed(2)}
                              </td>
                              <td className="py-3 text-center fw-bold text-primary">
                                ${item.total?.toFixed(2)}
                              </td>
                              <td className="py-3 text-center fw-bold text-success">
                                ${item.profit?.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {order.notes && (
                <div className="mt-4">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-header border-0 bg-transparent">
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-chat-left-text me-2 text-primary"></i>
                        Notes
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0 text-muted fst-italic">"{order.notes}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="modal-footer border-0 bg-light p-4">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4"
              style={{ borderRadius: '12px' }}
              onClick={onClose}
            >
              <i className="bi bi-check-circle me-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
