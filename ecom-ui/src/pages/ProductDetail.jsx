  // Custom reviews array (30 authentic, varied reviews)
  // Add dummy profile images and review dates
  const profileImages = [
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
    "https://randomuser.me/api/portraits/men/4.jpg",
    "https://randomuser.me/api/portraits/women/5.jpg",
    "https://randomuser.me/api/portraits/men/6.jpg",
    "https://randomuser.me/api/portraits/women/7.jpg",
    "https://randomuser.me/api/portraits/men/8.jpg",
    "https://randomuser.me/api/portraits/women/9.jpg",
    "https://randomuser.me/api/portraits/men/10.jpg",
    "https://randomuser.me/api/portraits/women/11.jpg",
    "https://randomuser.me/api/portraits/men/12.jpg",
    "https://randomuser.me/api/portraits/women/13.jpg",
    "https://randomuser.me/api/portraits/men/14.jpg",
    "https://randomuser.me/api/portraits/women/15.jpg",
    "https://randomuser.me/api/portraits/men/16.jpg",
    "https://randomuser.me/api/portraits/women/17.jpg",
    "https://randomuser.me/api/portraits/men/18.jpg",
    "https://randomuser.me/api/portraits/women/19.jpg",
    "https://randomuser.me/api/portraits/men/20.jpg",
    "https://randomuser.me/api/portraits/women/21.jpg",
    "https://randomuser.me/api/portraits/men/22.jpg",
    "https://randomuser.me/api/portraits/women/23.jpg",
    "https://randomuser.me/api/portraits/men/24.jpg",
    "https://randomuser.me/api/portraits/women/25.jpg",
    "https://randomuser.me/api/portraits/men/26.jpg",
    "https://randomuser.me/api/portraits/women/27.jpg",
    "https://randomuser.me/api/portraits/men/28.jpg",
    "https://randomuser.me/api/portraits/women/29.jpg",
    "https://randomuser.me/api/portraits/men/30.jpg"
  ];
  function randomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const customReviews = [
    { name: "Jessica Smith", rating: 5, text: "Absolutely loved this product! Will buy again." },
    { name: "John Davis", rating: 4.5, text: "Good value, fast delivery. Satisfied!" },
    { name: "Sarah Parker", rating: 5, text: "Quality is top notch. Highly recommended." },
    { name: "William Johnson", rating: 4.5, text: "Received exactly what I ordered. Great experience." },
    { name: "Emily Thompson", rating: 5, text: "Exceeded my expectations. Beautiful design!" },
    { name: "Michael Brown", rating: 4, text: "Nice product, packaging could improve." },
    { name: "Ashley Miller", rating: 5, text: "Superb! My family loves it." },
    { name: "James Wilson", rating: 4.5, text: "Quick delivery, excellent support." },
    { name: "Olivia Taylor", rating: 5, text: "Perfect for my needs. Will order more." },
    { name: "David Lee", rating: 4, text: "Works as described. Happy customer." },
    { name: "Elizabeth Harris", rating: 5, text: "Very happy with my purchase!" },
    { name: "Christopher Clark", rating: 3.5, text: "Average, but decent for the price." },
    { name: "Lauren Lewis", rating: 5, text: "Amazing quality and service!" },
    { name: "Thomas Hall", rating: 4, text: "Good product, good service." },
    { name: "Megan Young", rating: 5, text: "Impressed by the quality and speed." },
    { name: "Linda King", rating: 4.5, text: "Arrived on time, works well." },
    { name: "Matthew Wright", rating: 5, text: "Best purchase this month!" },
    { name: "Natalie Scott", rating: 4, text: "Nice design, easy to use." },
    { name: "Benjamin Green", rating: 5, text: "Fantastic! Will buy again." },
    { name: "Sophie Adams", rating: 5, text: "Loved it! Highly recommended." },
    { name: "Michael White", rating: 5, text: "Top notch product!" },
    { name: "Daniel Baker", rating: 4.5, text: "Met my expectations." },
    { name: "Charlotte Carter", rating: 5, text: "Beautiful and functional." },
    { name: "Samuel Evans", rating: 4, text: "Solid quality, fair price." },
    { name: "Hannah Turner", rating: 5, text: "Loved the packaging!" },
    { name: "George Phillips", rating: 4, text: "Good, but could be cheaper." },
    { name: "Madison Mitchell", rating: 5, text: "Super fast delivery!" },
    { name: "Jacob Campbell", rating: 4, text: "No complaints, works fine." },
    { name: "Ella Morgan", rating: 5, text: "Five stars!" },
    { name: "Henry Cooper", rating: 5, text: "Happy with the purchase. Will recommend!" }
  ].map((r, i) => ({
    ...r,
    profile: profileImages[i % profileImages.length],
    date: randomDate()
  }));

  // Pick 4-5 random reviews for each product, seeded by product ID for uniqueness
  function seededShuffle(array, seed) {
    let arr = array.slice();
    let s = seed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = ((s * 9301 + 49297) % 233280);
      const j = Math.floor(s / 233280 * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getRandomReviewsForProduct(arr, productId, min = 4, max = 5) {
    // Use productId string to generate a numeric seed
    let seed = 0;
    if (productId) {
      for (let i = 0; i < productId.length; i++) {
        seed += productId.charCodeAt(i) * (i + 1);
      }
    } else {
      seed = Math.floor(Math.random() * 10000);
    }
    const count = min + (seed % (max - min + 1));
    const shuffled = seededShuffle(arr, seed);
    return shuffled.slice(0, count);
  }

  // ...existing code...
import React, { useEffect, useState } from 'react';
import { FaShippingFast, FaShieldAlt, FaUserTie, FaUndo, FaHeadset, FaStar, FaCheckCircle, FaGift, FaTags, FaCheck, FaArrowRight } from 'react-icons/fa';

// Static Favorite Button (local state, color change only)
const FavoriteButton = () => {
  const [fav, setFav] = React.useState(false);
  return (
    <button
      onClick={() => setFav(f => !f)}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        marginLeft: 4,
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: 0
      }}
    >
      <i
        className="fas fa-heart"
        style={{
          color: fav ? '#e11d48' : '#64748b',
          fontSize: 32,
          transition: 'color 0.2s',
          filter: fav ? 'drop-shadow(0 2px 8px #e11d4833)' : 'none'
        }}
      ></i>
    </button>
  );
};
import Footer from '../components/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productController';

// Use same API logic as LandingPage for products
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError('');
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // Fetch all products for related/more selling
    fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setProducts(data || []))
      .catch(() => setProducts([]));
  }, [id]);

  // Calculate reviews only after product is loaded
  const reviewsToShow = product ? getRandomReviewsForProduct(customReviews, product._id) : [];
  // Generate random sold count per product (seeded)
  function getRandomSold(productId) {
    let seed = 0;
    if (productId) {
      for (let i = 0; i < productId.length; i++) {
        seed += productId.charCodeAt(i) * (i + 3);
      }
    } else {
      seed = Math.floor(Math.random() * 10000);
    }
    return 50 + (seed % 950); // 50-999 sold
  }
  const soldCount = product ? getRandomSold(product._id) : 0;
  // Overall reviews summary
  const overallRating = customReviews.reduce((acc, r) => acc + r.rating, 0) / customReviews.length;
  const totalReviews = customReviews.length;

  if (loading) {
    return (
      <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #fbbf24 0%, #f8fafc 100%)' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-warning mt-4">Product not found.</div>;
  }

  // Modal handler
  const handleShowModal = (msg) => {
    setModalMsg(msg);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Related and More Selling
  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);
  const moreSelling = products.filter(p => p.category?.toLowerCase() === 'most selling' && p._id !== product._id).slice(0, 4);

  return (
    <>
      {/* Scoped styles for ProductDetail page */}
      <style>{`
        .pd-products-section {
          max-width: 1100px;
          margin: 0 auto 24px auto;
        }
        .pd-products-title {
          font-weight: 800;
          font-size: clamp(1.3rem, 2vw, 2rem);
          margin: 32px 0 18px 0;
          color: #1e293b;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .pd-products-empty {
          color: #64748b;
        }
        .pd-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .pd-products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .pd-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 4px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .pd-product-card {
            width: 100% !important;
            min-width: 0;
            padding: 7px;
            border-radius: 10px;
            box-sizing: border-box;
          }
          .pd-product-card-img {
            height: 90px;
            border-radius: 7px;
          }
          .pd-product-card-name {
            font-size: 13px;
          }
          .pd-product-card-category {
            font-size: 11px;
          }
          .pd-product-card-price {
            font-size: 13px;
          }
          .pd-product-card-btn {
            font-size: 12px;
            padding: 6px 12px;
          }
        }
        .marketplace-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          width: 100%;
          margin: 0 auto;
        }
        .marketplace-box {
          background: #fff;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 14px;
          border: 2px solid #ececec;
          box-shadow: 0 2px 10px rgba(30,41,59,0.05);
          padding: 14px 10px 12px 10px;
          transition: box-shadow 0.2s, border-color 0.2s;
          overflow: hidden;
        }
        .marketplace-box.daraz { border-color: #fbbf24; }
        .marketplace-box.amazon { border-color: #232f3e; }
        .marketplace-box.flipkart { border-color: #2874f0; }
        .marketplace-box.ebay { border-color: #e53238; }
        .marketplace-logo {
          width: 70px;
          height: 38px;
          object-fit: contain;
          margin-bottom: 7px;
          border-radius: 6px;
          background: #f6f7fb;
        }
        .marketplace-title {
          font-weight: 800;
          font-size: 15px;
          margin-bottom: 7px;
          text-align: center;
        }
        .marketplace-title.daraz { color: #fbbf24; }
        .marketplace-title.amazon { color: #232f3e; }
        .marketplace-title.flipkart { color: #2874f0; }
        .marketplace-title.ebay { color: #e53238; }
        .marketplace-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
          color: #444;
          width: 100%;
          word-break: break-word;
        }
        .pd-related-products {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .pd-product-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(30,41,59,0.10);
          padding: 18px;
          width: 220px;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .pd-product-card-img {
          width: 100%;
          height: 140px;
          object-fit: contain;
          border-radius: 10px;
          margin-bottom: 12px;
          background: #f6f7fb;
          box-shadow: 0 1px 8px rgba(30,41,59,0.04);
        }
        .pd-product-card-name {
          font-weight: 700;
          font-size: 17px;
          margin-bottom: 6px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }
        .pd-product-card-category {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .pd-product-card-price {
          font-weight: 700;
          color: #e11d48;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .pd-product-card-btn {
          margin-top: auto;
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 8px 22px;
          font-weight: 600;
          cursor: pointer;
          font-size: 15px;
          box-shadow: 0 1px 6px rgba(30,41,59,0.07);
          transition: background 0.2s;
        }
        @media (max-width: 900px) {
          .marketplace-grid {
            grid-template-columns: repeat(2, 1fr);
          }
            .pd-product-card {
            min-height: 240px;
            }
            .pd-main {
              padding-bottom : 0px;
            }
        }
        @media (max-width: 600px) {
          .marketplace-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .marketplace-box {
            padding: 6px !important;
            border-radius: 7px !important;
          }
          .marketplace-box h4 {
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }
          .marketplace-box ul {
            font-size: 11px !important;
          }
          .pd-product-card {
            width: 98vw;
            min-width: 0;
            padding: 7px;
            border-radius: 10px;
          }
          .pd-product-card-img {
            height: 90px;
            border-radius: 7px;
          }
          .pd-product-card-name {
            font-size: 13px;
          }
          .pd-product-card-category {
            font-size: 11px;
          }
          .pd-product-card-price {
            font-size: 13px;
          }
          .pd-product-card-btn {
            font-size: 12px;
            padding: 6px 12px;
          }
        }
        .pd-main {
          min-height: 100vh;
          background: #f6f7fb;
          padding-bottom: 0px;
          margin: 0;
        }
        .pd-header {
          width: 100%;
          background: #fff;
          color: #222;
          padding: 16px 0 12px 0;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 2px 10px rgba(30,41,59,0.05);
        }
        .pd-back-btn {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 6px 16px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(30,41,59,0.10);
          transition: background 0.2s;
          z-index: 2;
        }
        .pd-title {
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: 0.5px;
          color: #222;
        }
        .pd-section {
          max-width: 980px;
          margin: 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 18px rgba(30,41,59,0.08);
          padding: 14px;
          font-size: 1rem;
          line-height: 1.7;
          color: #222;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .pd-product-img {
          max-width: 100%;
          max-height: 220px;
          object-fit: contain;
          border-radius: 14px;
          background: #f6f7fb;
          box-shadow: 0 1px 8px rgba(30,41,59,0.04);
        }
        .pd-product-name {
          font-weight: 900;
          font-size: 1.2rem;
          margin-bottom: 4px;
          color: #222;
          letter-spacing: 0.5px;
        }
        .pd-product-category {
          color: #888;
          margin-bottom: 2px;
          font-size: 13px;
        }
        .pd-product-desc {
          margin-bottom: 8px;
          color: #444;
          font-size: 13px;
        }
        .pd-product-price {
          margin-bottom: 6px;
          font-size: 1.1rem;
        }
        .pd-product-stock {
          margin-bottom: 2px;
          color: #666;
          font-size: 13px;
        }
        .pd-dummy-info-modern {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 10px 0 0 0;
        }
        .pd-dummy-badge-modern {
          display: flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%);
          color: #222;
          border-radius: 8px;
          padding: 5px 14px;
          font-weight: 600;
          font-size: 13px;
          box-shadow: 0 1px 6px rgba(30,41,59,0.07);
          border: 1px solid #e0e7ef;
          transition: box-shadow 0.2s;
        }
        .pd-dummy-icon {
          font-size: 18px;
          margin-right: 2px;
        }
        @media (max-width: 600px) {
          .pd-dummy-info-modern {
            gap: 7px;
            margin-top: 7px;
          }
          .pd-dummy-badge-modern {
            font-size: 11px;
            padding: 4px 7px;
            border-radius: 6px;
          }
          .pd-dummy-icon {
            font-size: 15px;
          }
        }
        .pd-payment-methods {
          margin: 8px 0 6px 0;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .pd-payment-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 40px;
        }
        .pd-payment-label {
          font-size: 10px;
          margin-top: 2px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .pd-cart-box {
          width: 100%;
          max-width: 340px;
          margin: 0 auto 12px auto;
          background: linear-gradient(120deg, #f8fafc 0%, #fbbf24 100%);
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(30,41,59,0.10);
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #fbbf24;
          position: relative;
        }
        .pd-cart-summary {
          position: absolute;
          top: -14px;
          right: 12px;
          background: #fff;
          color: #e11d48;
          font-weight: 700;
          font-size: 12px;
          border-radius: 8px;
          padding: 3px 10px;
          box-shadow: 0 1px 6px rgba(30,41,59,0.07);
        }
        .pd-cart-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 13px;
          color: #222;
        }
        .pd-cart-row-discount {
          color: #e11d48;
          font-size: 12px;
        }
        .pd-cart-row-tax {
          font-weight: 600;
          font-size: 12px;
          color: #444;
        }
        .pd-cart-total {
          font-weight: 900;
          font-size: 15px;
          color: #059669;
        }
        .pd-cart-btns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          width: 100%;
          justify-content: center;
          margin-top: 6px;
        }
        .pd-cart-btn {
          background: #e11d48;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(30,41,59,0.10);
          transition: background 0.2s;
          letter-spacing: 0.5px;
        }
        .pd-cart-btn-alt {
          background: #f0f1f3;
          color: #222;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(30,41,59,0.10);
          transition: background 0.2s;
          letter-spacing: 0.5px;
        }
        @media (max-width: 600px) {
          .pd-main {
            padding-left: 7px;
            padding-right: 7px;
          }
          .pd-section {
            padding: 7px;
            border-radius: 10px;
            font-size: 0.95rem;
            gap: 10px;
          }
          .pd-header {
            padding: 10px 0 8px 0;
            margin-bottom: 10px;
          }
          .pd-title {
            font-size: 1.1rem;
          }
          .pd-product-img {
            max-height: 120px;
          }
          .pd-cart-box {
            max-width: 98vw;
            padding: 7px;
            border-radius: 10px;
          }
          .pd-cart-summary {
            font-size: 10px;
            top: -10px;
            right: 7px;
            padding: 2px 7px;
          }
          .pd-cart-row, .pd-cart-row-discount, .pd-cart-row-tax, .pd-cart-total {
            font-size: 11px;
          }
          .pd-cart-btn, .pd-cart-btn-alt {
            font-size: 12px;
            padding: 6px 12px;
          }
          .marketplace-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .marketplace-box {
            padding: 6px !important;
            border-radius: 7px !important;
          }
          .marketplace-box h4 {
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }
          .marketplace-box ul {
            font-size: 11px !important;
          }
        }
      `}</style>
      <div className="pd-main">
        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '36px 28px',
              minWidth: '320px',
              boxShadow: '0 2px 24px rgba(0,0,0,0.13)',
              textAlign: 'center',
              position: 'relative'
            }}>
              <h3 style={{marginBottom: '18px', fontWeight: 800, fontSize: 22, color: '#222'}}>Notice</h3>
              <p style={{marginBottom: '28px', color: '#444', fontSize: 16}}>{modalMsg || 'Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!'}</p>
              <button onClick={closeModal} style={{
                background: '#e11d48',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 28px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '17px',
                boxShadow: '0 1px 8px rgba(30,41,59,0.10)'
              }}>Close</button>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="pd-header">
          <button className="pd-back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
          <span className="pd-title">Product Details</span>
        </div>

        {/* Product + Market Info Section (Sleek, Modern, Responsive) */}
        <div className="pd-section">
          {/* Product Main Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            <img className="pd-product-img" src={product.image || product.imageUrl} alt={product.name} />
            <div style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
              <h2 className="pd-product-name">{product.name}</h2>
              <p className="pd-product-category">Category: <span style={{ background: '#f0f1f3', color: '#222', borderRadius: 5, padding: '2px 8px', fontWeight: 600 }}>{product.category}</span></p>
              <p className="pd-product-desc">{product.description}</p>
              <div className="pd-product-price">
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#bbb', fontSize: '1em' }}>${product.price}</span>
                    <span style={{ marginLeft: 8, color: '#e11d48', fontWeight: 700, fontSize: '1em' }}>${product.discountedPrice}</span>
                    <span style={{ marginLeft: 8, color: '#059669', fontWeight: 600, fontSize: 12 }}>
                      ({Math.round(100 - (product.discountedPrice / product.price) * 100)}% off)
                    </span>
                  </>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '1em', color: '#222' }}>${product.price}</span>
                )}
              </div>
              <div className="pd-product-stock">
                <strong>Stock:</strong> {product.stock ?? 'Available'}
                <span style={{ marginLeft: 12, color: '#059669', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <FaTags style={{ marginRight: 2 }} /> Sold: {soldCount}
                </span>
              </div>
              {/* Dummy Info: Shipping, Warranty, Seller, Guarantee, Return, Support */}
              <div className="pd-dummy-info-modern">
                <span className="pd-dummy-badge-modern">
                  <FaShippingFast className="pd-dummy-icon" style={{ color: '#059669' }} />
                  <span>Shipping: <strong>Free & Express</strong></span>
                </span>
                <span className="pd-dummy-badge-modern">
                  <FaShieldAlt className="pd-dummy-icon" style={{ color: '#6366f1' }} />
                  <span>Warranty: <strong>1 Year</strong></span>
                </span>
                <span className="pd-dummy-badge-modern">
                  <FaCheck className="pd-dummy-icon" style={{ color: '#059669' }} />
                  <span>Guarantee: <strong>100% Genuine</strong></span>
                </span>
                <span className="pd-dummy-badge-modern">
                  <FaUserTie className="pd-dummy-icon" style={{ color: '#eab308' }} />
                  <span>Seller: <strong>Wolverine House</strong></span>
                </span>
                <span className="pd-dummy-badge-modern">
                  <FaUndo className="pd-dummy-icon" style={{ color: '#e11d48' }} />
                  <span>Return Policy: <strong>30 days</strong></span>
                </span>
                <span className="pd-dummy-badge-modern">
                  <FaHeadset className="pd-dummy-icon" style={{ color: '#0ea5e9' }} />
                  <span>Support: <strong>24/7 Chat</strong></span>
                </span>
              </div>
            </div>
          </div>
          {/* Voucher Section */}
          <div style={{ width: '100%', margin: '12px 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'linear-gradient(90deg, #fbbf24 0%, #f8fafc 100%)', borderRadius: 14, boxShadow: '0 2px 12px rgba(30,41,59,0.08)', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 18, minWidth: 260, maxWidth: 400 }}>
              <FaGift style={{ fontSize: 28, color: '#e11d48', marginRight: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#e11d48', marginBottom: 2 }}>Voucher Available!</div>
                <div style={{ fontSize: 13, color: '#222' }}>Get <strong>$10 OFF</strong> on orders above <strong>$100</strong></div>
                <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>Min. Buy Amount: $100</div>
              </div>
              <button style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 1px 6px rgba(30,41,59,0.07)', display: 'flex', alignItems: 'center', gap: 6 }}>
                Apply <FaArrowRight style={{ marginLeft: 4 }} />
              </button>
            </div>
          </div>
          {/* Payment Methods (fake) */}
          <div className="pd-payment-methods">
            <div className="pd-payment-item">
              <i className="fab fa-paypal" style={{ fontSize: 24, color: '#003087', filter: 'drop-shadow(0 2px 4px #00308733)' }}></i>
              <span className="pd-payment-label" style={{ color: '#003087' }}>PayPal</span>
            </div>
            <div className="pd-payment-item">
              <i className="fab fa-stripe" style={{ fontSize: 24, color: '#635bff', filter: 'drop-shadow(0 2px 4px #635bff33)' }}></i>
              <span className="pd-payment-label" style={{ color: '#635bff' }}>Stripe</span>
            </div>
            <div className="pd-payment-item">
              <i className="fas fa-university" style={{ fontSize: 24, color: '#00b9ff', filter: 'drop-shadow(0 2px 4px #00b9ff33)' }}></i>
              <span className="pd-payment-label" style={{ color: '#00b9ff' }}>Wise</span>
            </div>
            <div className="pd-payment-item">
              <i className="fas fa-university" style={{ fontSize: 24, color: '#ff6600', filter: 'drop-shadow(0 2px 4px #ff660033)' }}></i>
              <span className="pd-payment-label" style={{ color: '#ff6600' }}>Payoneer</span>
            </div>
          </div>
          {/* Professional Cart Box */}
          <div className="pd-cart-box">
            <div style={{ width: '100%', marginBottom: 6 }}>
              <div className="pd-cart-row">
                <span>Price:</span>
                <span>${product.price?.toFixed(2)}</span>
              </div>
              {product.discountedPrice && product.discountedPrice < product.price && (
                <div className="pd-cart-row pd-cart-row-discount">
                  <span>Discount:</span>
                  <span>- ${((product.price - product.discountedPrice).toFixed(2))}</span>
                </div>
              )}
              <div className="pd-cart-row pd-cart-row-tax">
                <span>Sales Tax (8%):</span>
                <span>${((product.discountedPrice && product.discountedPrice < product.price ? product.discountedPrice : product.price) * 0.08).toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: '#e0e7ef', margin: '7px 0' }}></div>
              <div className="pd-cart-row pd-cart-total">
                <span>Total:</span>
                <span>
                  ${(
                    (product.discountedPrice && product.discountedPrice < product.price ? product.discountedPrice : product.price) * 1.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="pd-cart-btns">
              <button className="pd-cart-btn" onClick={() => handleShowModal('Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!')}>Buy Now</button>
              <button className="pd-cart-btn-alt" onClick={() => handleShowModal('Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!')}>Add to Cart</button>
              <FavoriteButton />
            </div>
            <div className="pd-cart-summary">
              <i className="fas fa-shopping-cart" style={{ marginRight: 5 }}></i>Cart Summary
            </div>
          </div>
          {/* Inline Reviews Section - Beautiful UI */}
          <div style={{ width: '100%', marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 10, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'linear-gradient(90deg, #fbbf24 0%, #f8fafc 100%)', borderRadius: 10, padding: '7px 18px', fontWeight: 800, fontSize: 16, color: '#eab308', boxShadow: '0 1px 6px rgba(30,41,59,0.07)' }}>
                <FaStar style={{ color: '#eab308', fontSize: 20, marginRight: 4 }} />
                {overallRating.toFixed(1)} / 5
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#059669', background: '#f8fafc', borderRadius: 8, padding: '7px 14px', boxShadow: '0 1px 6px rgba(30,41,59,0.07)' }}>
                {totalReviews} Reviews
              </div>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', margin: '0 0 10px 0', color: '#222', letterSpacing: 0.5 }}>Customer Reviews</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {reviewsToShow.map((review, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 15, background: '#f8f9fb', borderRadius: 12, boxShadow: '0 1px 6px rgba(30,41,59,0.05)', padding: '10px 12px', border: '1px solid #ececec' }}>
                  <img src={review.profile} alt={review.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececec', background: '#fff', marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontWeight: 700, color: '#222', fontSize: 15 }}>{review.name}</span>
                      <span style={{ color: '#888', fontSize: 12 }}>{review.date}</span>
                      <span style={{ fontWeight: 700, color: '#eab308', fontSize: 15, marginLeft: 7 }}>{review.rating.toFixed(1)}<FaStar style={{ color: '#eab308', marginLeft: 4, fontSize: 13 }} /> / 5</span>
                    </div>
                    <div style={{ color: '#444', fontSize: 14, fontStyle: 'italic', margin: '4px 0 2px 0' }}>{review.text}</div>
                    <div style={{ color: '#059669', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', marginTop: 2 }}>
                      <FaCheckCircle style={{ color: '#059669', marginRight: 5 }} />Verified Buyer
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 28 }}>
        
        <h3 style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 2vw, 1.7rem)', margin: '0 0 10px 0', color: '#222', letterSpacing: 1 }}>Marketplace Info</h3>
        <div className="marketplace-grid">
          {/* Amazon */}
          <div className="marketplace-box" style={{ border: '2px solid #232f3e', background: '#fff', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="marketplace-logo" />
            <h4 className="marketplace-title" style={{ color: '#232f3e' }}>Amazon</h4>
            <ul className="marketplace-list">
              <li><strong>Seller:</strong> Wolverine House</li>
              <li><strong>Rating:</strong> 4.7/5</li>
              <li><strong>Shipping:</strong> Standard</li>
              <li><strong>Return Policy:</strong> 10 days</li>
              <li><strong>Marketplace Fee:</strong> 3%</li>
              <li><strong>Support:</strong> Email & Phone</li>
              <li><strong>Special:</strong> Prime delivery available</li>
              <li><strong>Payment:</strong> PayPal, Stripe, Wise</li>
              <li><strong>Trust Level:</strong> Very High</li>
              <li><strong>Delivery Speed:</strong> 1-3 days</li>
            </ul>
          </div>
          {/* eBay */}
          <div className="marketplace-box" style={{ border: '2px solid #e53238', background: '#fff', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="marketplace-logo" />
            <h4 className="marketplace-title" style={{ color: '#e53238' }}>eBay</h4>
            <ul className="marketplace-list">
              <li><strong>Seller:</strong> Wolverine House</li>
              <li><strong>Rating:</strong> 4.5/5</li>
              <li><strong>Shipping:</strong> Paid</li>
              <li><strong>Return Policy:</strong> 14 days</li>
              <li><strong>Marketplace Fee:</strong> 2.8%</li>
              <li><strong>Support:</strong> Email & Chat</li>
              <li><strong>Special:</strong> Auction deals</li>
              <li><strong>Payment:</strong> PayPal, Wise</li>
              <li><strong>Trust Level:</strong> Medium</li>
              <li><strong>Delivery Speed:</strong> 3-7 days</li>
            </ul>
          </div>
          {/* Etsy */}
          <div className="marketplace-box" style={{ border: '2px solid #f56400', background: '#fff', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <div style={{ background: '#F1641E', width: 70, height: 36, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',fontWeight: 'bolder',borderRadius: 8,marginBottom: 8 }}>Etsy</div>
            </div>
            <h4 className="marketplace-title" style={{ color: '#f56400' }}>Etsy</h4>
            <ul className="marketplace-list">
              <li><strong>Seller:</strong> Wolverine House</li>
              <li><strong>Rating:</strong> 4.6/5</li>
              <li><strong>Shipping:</strong> International</li>
              <li><strong>Return Policy:</strong> 14 days</li>
              <li><strong>Marketplace Fee:</strong> 5%</li>
              <li><strong>Support:</strong> Email & Chat</li>
              <li><strong>Special:</strong> Handmade & vintage items</li>
              <li><strong>Payment:</strong> PayPal, Stripe</li>
              <li><strong>Trust Level:</strong> High</li>
              <li><strong>Delivery Speed:</strong> 5-10 days</li>
            </ul>
          </div>
          {/* Walmart */}
          <div className="marketplace-box" style={{ border: '2px solid #0071ce', background: '#fff', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src="https://i5.walmartimages.com/dfw/63fd9f59-14e2/9d304ce6-96de-4331-b8ec-c5191226d378/v1/spark-icon.svg" alt="Walmart" className="marketplace-logo" />
            <h4 className="marketplace-title" style={{ color: '#0071ce' }}>Walmart</h4>
            <ul className="marketplace-list">
              <li><strong>Seller:</strong> Wolverine House</li>
              <li><strong>Rating:</strong> 4.4/5</li>
              <li><strong>Shipping:</strong> Standard</li>
              <li><strong>Return Policy:</strong> 30 days</li>
              <li><strong>Marketplace Fee:</strong> 2.5%</li>
              <li><strong>Support:</strong> Email & Phone</li>
              <li><strong>Special:</strong> Rollback deals</li>
              <li><strong>Payment:</strong> PayPal, Stripe</li>
              <li><strong>Trust Level:</strong> High</li>
              <li><strong>Delivery Speed:</strong> 2-6 days</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Related Products */}
      <div className="pd-products-section">
        <h3 className="pd-products-title">Related Products</h3>
        <div className="pd-products-grid">
          {related.length === 0 && <span className="pd-products-empty">No related products found.</span>}
          {related.map(p => (
            <div key={p._id} className="pd-product-card">
              <img src={p.image || p.imageUrl} alt={p.name} className="pd-product-card-img" />
              <div className="pd-product-card-name">{p.name}</div>
              <div className="pd-product-card-category">{p.category}</div>
              <div className="pd-product-card-price">${p.price}</div>
              <button className="pd-product-card-btn" onClick={() => handleShowModal('Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!')}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>

    {/* More Selling Products */}
      <div className="pd-products-section">
        <h3 className="pd-products-title">More Selling Products</h3>
        <div className="pd-products-grid">
          {moreSelling.length === 0 && <span className="pd-products-empty">No more selling products found.</span>}
          {moreSelling.map(p => (
            <div key={p._id} className="pd-product-card">
              <img src={p.image || p.imageUrl} alt={p.name} className="pd-product-card-img" />
              <div className="pd-product-card-name">{p.name}</div>
              <div className="pd-product-card-category">{p.category}</div>
              <div className="pd-product-card-price">${p.price}</div>
              <button className="pd-product-card-btn" onClick={() => handleShowModal('Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!')}>Buy Now</button>
            </div>
          ))}
        </div>
      </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
