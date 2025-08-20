import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../components/toast';
import { 
  getAvailableProducts, 
  addProductToSeller, 
  getSellerProducts, 
  updateSellerProduct, 
  removeSellerProduct 
} from '../services/sellerProductService';

function SellerProductManagement() {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productSelected: false
  });
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedSellerProducts, setSelectedSellerProducts] = useState([]);
  // Multi-select handlers
  const handleSelectAvailable = (productId) => {
    setSelectedAvailable((prev) =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectSellerProduct = (sellerProductId) => {
    setSelectedSellerProducts((prev) =>
      prev.includes(sellerProductId) ? prev.filter(id => id !== sellerProductId) : [...prev, sellerProductId]
    );
  };

  const handleAddSelected = async () => {
    if (selectedAvailable.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedAvailable.map(async (productId) => {
        const product = availableProducts.find(p => p._id === productId);
        if (product) {
          const productData = {
            productId: product._id,
            sellerQuantity: 9999,
            sellerPrice: product.price,
            sellerDiscountedPrice: product.discountedPrice
          };
          try {
            await addProductToSeller(productData);
          } catch {}
        }
      }));
      setSelectedAvailable([]);
      fetchData();
      showSuccess('Selected products added!');
    } catch (error) {
      showError('Error adding selected products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = async () => {
    if (availableProducts.length === 0) return;
    setSelectedAvailable(availableProducts.map(p => p._id));
    await handleAddSelected();
  };

  const handleRemoveSelected = async () => {
    if (selectedSellerProducts.length === 0) return;
    if (!window.confirm('Remove selected products from your inventory?')) return;
    try {
      setLoading(true);
      await Promise.all(selectedSellerProducts.map(async (sellerProductId) => {
        try {
          await removeSellerProduct(sellerProductId);
        } catch {}
      }));
      setSelectedSellerProducts([]);
      fetchData();
      showSuccess('Selected products removed!');
    } catch (error) {
      showError('Error removing selected products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [available, myProducts] = await Promise.all([
        getAvailableProducts(),
        getSellerProducts()
      ]);
      setAvailableProducts(available);
      setSellerProducts(myProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      productSelected: true
    });
    setShowAddModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        productId: selectedProduct._id,
        sellerQuantity: 9999, // Set unlimited quantity
        sellerPrice: selectedProduct.price,
        sellerDiscountedPrice: selectedProduct.discountedPrice
      };

      await addProductToSeller(productData);
      setShowAddModal(false);
      setSelectedProduct(null);
      setFormData({ productSelected: false });
      fetchData(); // Refresh data
      showSuccess('Product added to your inventory successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      showError('Error adding product: ' + error.message);
    }
  };

  const handleUpdateQuantity = async (sellerProductId, newQuantity) => {
    try {
      await updateSellerProduct(sellerProductId, { sellerQuantity: newQuantity });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Error updating quantity: ' + error.message);
    }
  };

  const handleRemoveProduct = async (sellerProductId) => {
    if (window.confirm('Are you sure you want to remove this product from your inventory?')) {
      try {
        await removeSellerProduct(sellerProductId);
        fetchData(); // Refresh data
        showSuccess('Product removed from inventory successfully!');
      } catch (error) {
        console.error('Error removing product:', error);
        showError('Error removing product: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (sellerProductId, currentStatus) => {
    try {
      await updateSellerProduct(sellerProductId, { isActive: !currentStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error toggling status:', error);
      showError('Error updating status: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="seller-product-management">
      <h2>Product Management</h2>
      
      {/* My Products Section */}
      <div className="my-products-section">
        <h3>My Products ({sellerProducts.length})</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className="remove-btn"
            style={{ width: 'auto', padding: '6px 16px' }}
            disabled={selectedSellerProducts.length === 0}
            onClick={handleRemoveSelected}
          >
            Remove Selected
          </button>
        </div>
        {sellerProducts.length === 0 ? (
          <p>No products in your inventory yet. Add some products below!</p>
        ) : (
          <div className="products-grid">
            {sellerProducts.map((sellerProduct) => (
              <div key={sellerProduct._id} className="product-card">
                <input
                  type="checkbox"
                  checked={selectedSellerProducts.includes(sellerProduct._id)}
                  onChange={() => handleSelectSellerProduct(sellerProduct._id)}
                  style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}
                />
                <div className="product-image">
                  <img src={sellerProduct.product && sellerProduct.product.image ? sellerProduct.product.image : '/default-image.jpg'} alt={sellerProduct.product && sellerProduct.product.name ? sellerProduct.product.name : 'Unknown Product'} />
                </div>
                <div className="product-info">
                  <h4>{sellerProduct.product && sellerProduct.product.name ? sellerProduct.product.name : 'Unknown Product'}</h4>
                  <p className="category">{sellerProduct.product && sellerProduct.product.category ? sellerProduct.product.category : ''}</p>
                  <div className="pricing">
                    {sellerProduct.sellerDiscountedPrice ? (
                      <>
                        <span className="original-price">${sellerProduct.sellerPrice}</span>
                        <span className="discounted-price">${sellerProduct.sellerDiscountedPrice}</span>
                        <span className="profit">Profit: ${(sellerProduct.sellerPrice - sellerProduct.sellerDiscountedPrice).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="price">${sellerProduct.sellerPrice}</span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveProduct(sellerProduct._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Products Section */}
      <div className="available-products-section">
        <h3>Available Products to Add ({availableProducts.length})</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className="add-btn"
            style={{ width: 'auto', padding: '10px 16px' }}
            disabled={availableProducts.length === 0}
            onClick={handleAddAll}
          >
            Add All
          </button>
          <button
            className="add-btn"
            style={{ width: 'auto', padding: '10px 16px', background: '#059669', backgroundImage: 'none' }}
            disabled={selectedAvailable.length === 0}
            onClick={handleAddSelected}
          >
            Add Selected
          </button>
        </div>
        {availableProducts.length === 0 ? (
          <p>No more products available to add to your inventory.</p>
        ) : (
          <div className="products-grid">
            {availableProducts.map((product) => (
              <div key={product._id} className="product-card">
                <input
                  type="checkbox"
                  checked={selectedAvailable.includes(product._id)}
                  onChange={() => handleSelectAvailable(product._id)}
                  style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}
                />
                <div className="product-image">
                  <img src={product.image || '/default-image.jpg'} alt={product.name} />
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="category">{product.category}</p>
                  <div className="pricing">
                    {product.discountedPrice ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="discounted-price">${product.discountedPrice}</span>
                        <span className="profit">Profit: ${(product.price - product.discountedPrice).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="price">${product.price}</span>
                    )}
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => handleAddProduct(product)}
                  >
                    Add to Inventory
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Product to Inventory</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitAdd}>
              <div className="modal-body">
                <div className="product-preview">
                  <img src={selectedProduct?.image || '/default-image.jpg'} alt={selectedProduct?.name} />
                  <h4>{selectedProduct?.name}</h4>
                  <p style={{color: '#6b7280', fontSize: '12px', margin: '4px 0 0 0'}}>
                    {selectedProduct?.discountedPrice ? (
                      <>
                        Original: ${selectedProduct?.price} • 
                        Discounted: ${selectedProduct?.discountedPrice} • 
                        Profit: ${(selectedProduct?.price - selectedProduct?.discountedPrice).toFixed(2)}
                      </>
                    ) : (
                      <>Price: ${selectedProduct?.price}</>
                    )}
                  </p>
                </div>
                
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .seller-product-management {
          padding: 24px;
          background: #fafbfc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .seller-product-management h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 32px;
          letter-spacing: -0.5px;
        }
        
        .my-products-section, .available-products-section {
          margin-bottom: 48px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
        }
        
        .my-products-section h3, .available-products-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .my-products-section h3:before {
          content: '📦';
          font-size: 16px;
        }
        
        .available-products-section h3:before {
          content: '🛍️';
          font-size: 16px;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        
        .product-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .product-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        
        .product-image {
          position: relative;
          margin-bottom: 12px;
        }
        
        .product-image img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
          background: #f8f9fa;
        }
        
        .product-info h4 {
          margin: 0 0 6px 0;
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .category {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
        
        .description {
          color: #6b7280;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .pricing {
          margin: 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .price {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 16px;
        }
        
        .original-price {
          font-weight: 400;
          color: #a0a0a0;
          font-size: 13px;
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .discounted-price {
          font-weight: 700;
          color: #dc2626;
          font-size: 17px;
          background: rgba(239, 68, 68, 0.05);
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(239, 68, 68, 0.1);
        }
        
        .profit {
          color: #059669;
          font-weight: 700;
          font-size: 13px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%);
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 11px;
        }
        
        .product-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .remove-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        .add-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 480px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #f0f0f0;
          background: #f8f9fa;
          border-radius: 16px 16px 0 0;
        }
        
        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        
        .close-btn {
          background: #f1f5f9;
          border: none;
          font-size: 18px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: #e2e8f0;
          color: #1a1a1a;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .product-preview {
          text-align: center;
          margin-bottom: 24px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        
        .product-preview img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .product-preview h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 13px;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 13px;
          background: #f9fafb;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #f0f0f0;
          background: #f8f9fa;
          border-radius: 0 0 16px 16px;
        }
        
        .modal-footer button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .modal-footer button[type="button"] {
          background: #e5e7eb;
          color: #374151;
        }
        
        .modal-footer button[type="button"]:hover {
          background: #d1d5db;
        }
        
        .modal-footer button[type="submit"] {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        
        .modal-footer button[type="submit"]:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .loading {
          text-align: center;
          padding: 64px;
          font-size: 16px;
          color: #6b7280;
        }
        
        .loading:before {
          content: '⏳';
          font-size: 24px;
          display: block;
          margin-bottom: 16px;
        }
        
        /* Empty state messages */
        .my-products-section p, .available-products-section p {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          padding: 32px;
          background: #f8f9fa;
          border-radius: 12px;
          margin: 20px 0;
          border: 1px dashed #e5e7eb;
        }
        
        /* Responsive design */
        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px;
          }
            .seller-product-management {
            padding: 8px;  }
          .product-card {
            padding: 4px !important;
          }
            .my-products-section p, .available-products-section p {
            padding:6px;
            line-height: 1;
            font-size: 12px;
            display: none;
            }
            .my-products-section, .available-products-section {
            padding:12px 8px;
            border-radius: 8px;}
          .product-image img {
            height: 100px;
          }
          .product-info h4 {
            font-size: 12px;
          }
          .category {
            font-size: 10px;
            margin-bottom: 6px;
          }
          .description {
            font-size: 10px;
            margin-bottom: 8px;
          }
          .pricing {
            margin: 8px 0;
            font-size: 11px;
          }
          .price, .original-price, .discounted-price, .profit {
            font-size: 11px !important;
            padding: 2px 6px !important;
          }
          .remove-btn, .add-btn {
            font-size: 10px;
            padding: 6px 8px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SellerProductManagement;
