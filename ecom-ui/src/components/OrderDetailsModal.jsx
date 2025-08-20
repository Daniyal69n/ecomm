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
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Order Details - {order.orderNumber}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Order Summary */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Order Information</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Order Number:</strong> {order.orderNumber}</p>
                    <p><strong>Created:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge ${getStatusBadgeClass(order.status)} ms-2`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </p>
                    <p><strong>Seller Response:</strong> 
                      <span className={`badge ${getResponseBadgeClass(order.sellerResponse)} ms-2`}>
                        {order.sellerResponse.charAt(0).toUpperCase() + order.sellerResponse.slice(1)}
                      </span>
                    </p>
                    {order.acceptedAt && (
                      <p><strong>Accepted At:</strong> {formatDate(order.acceptedAt)}</p>
                    )}
                    {order.deliveredAt && (
                      <p><strong>Delivered At:</strong> {formatDate(order.deliveredAt)}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Seller Information</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Name:</strong> {order.seller?.name}</p>
                    <p><strong>Shop:</strong> {order.seller?.shopName}</p>
                    <p><strong>Email:</strong> {order.seller?.email}</p>
                    <p><strong>Credit Balance:</strong> ${order.seller?.creditAmount || 0}</p>
                    <p><strong>Pending Amount:</strong> ${order.seller?.pendingAmount || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">Order Items</h6>
              </div>
              <div className="card-body">
                {/* Responsive: Table for desktop, cards for mobile */}
                <div className="d-none d-md-block table-responsive">
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th>Original Price</th>
                        <th>Discounted Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product?.name}</td>
                          <td>
                            {item.product?.image && (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            )}
                          </td>
                          <td>${item.originalPrice}</td>
                          <td>${item.discountedPrice}</td>
                          <td>{item.quantity}</td>
                          <td>${item.totalPrice.toFixed(2)}</td>
                          <td className="text-success">${item.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-block d-md-none">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item-card mb-3 p-3 card shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover' }} className="rounded me-3" />
                        )}
                        <div>
                          <div className="fw-bold">{item.product?.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.95em' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div>Original: <span className="text-secondary">${item.originalPrice}</span></div>
                          <div>Discount: <span className="text-danger">${item.discountedPrice}</span></div>
                        </div>
                        <div className="col-6">
                          <div>Total: <span className="text-primary">${item.totalPrice.toFixed(2)}</span></div>
                          <div>Profit: <span className="text-success">${item.profit.toFixed(2)}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Totals */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <h5 className="text-primary">Total Amount: ${order.totalAmount?.toFixed(2)}</h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-success">Total Profit: ${order.totalProfit?.toFixed(2)}</h5>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-info">Items: {order.items?.length}</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Notes</h6>
                </div>
                <div className="card-body">
                  <p className="mb-0">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {order.rejectionReason && (
              <div className="card mb-4">
                <div className="card-header bg-danger text-white">
                  <h6 className="mb-0">Rejection Reason</h6>
                </div>
                <div className="card-body">
                  <p className="mb-0 text-danger">{order.rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Created By */}
           
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
