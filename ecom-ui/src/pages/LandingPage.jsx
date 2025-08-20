import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Logo from '../assets/images/ecommerce.png'

// ...existing code...
import { Link, useNavigate } from 'react-router-dom';
import { MdLock } from 'react-icons/md';
import { MdLogout } from 'react-icons/md';
import { MdDashboard } from 'react-icons/md';
import Banner1 from '../../src/assets/images/b1.jpeg'
import BF1 from '../../src/assets/images/f1.jpg'
import BF2 from '../../src/assets/images/f2.jpg'
import BF3 from '../../src/assets/images/f3.jpg'
import BF4 from '../../src/assets/images/f4.jpg'
import BF5 from '../../src/assets/images/f5.jpg'
import BF6 from '../../src/assets/images/f6.jpg'
import BF7 from '../../src/assets/images/f7.jpg'
import Banner2 from '../../src/assets/images/b2.jpg'
import Bannern from '../../src/assets/images/new-b.jpeg'
import Banner3 from '../../src/assets/images/b3.jpg'
import Banner4 from '../../src/assets/images/b4.jpg'
import Banner5 from '../../src/assets/images/b5.jpg'
import Banner6 from '../../src/assets/images/b6.jpg'
import Banner7 from '../../src/assets/images/b7.jpg'
import Banner8 from '../../src/assets/images/b8.jpg'
import Banner9 from '../../src/assets/images/b9.jpg'
import Banner10 from '../../src/assets/images/b10.jpg'
import Banner11 from '../../src/assets/images/b11.jpg'
import Banner12 from '../../src/assets/images/bn1.jpeg'
import Banner13 from '../../src/assets/images/f1.jpg'
import Banner14 from '../../src/assets/images/bn3.jpeg'
import Banner15 from '../../src/assets/images/bn4.jpeg'
import Sale1 from '../../src/assets/images/s1.jpg'
import Sale2 from '../../src/assets/images/s2.jpg'
import Sale3 from '../../src/assets/images/s3.jpg'
import Sale4 from '../../src/assets/images/s4.jpg'
import Partners from '../../src/assets/images/partners.jpeg'
import verified from '../../src/assets/images/verified.png'
import Slider from "react-slick";


function LandingPage() {

  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };
  var productSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 }
      }
    ]
  };
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTouched, setSearchTouched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchModalMsg, setSearchModalMsg] = useState('');
  const handleBuyNow = (e) => {
    e.preventDefault();
    setShowModal(true);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchModalMsg('Type product first');
      setShowSearchModal(true);
      return;
    }
    const found = products.some(p => p.name?.toLowerCase() === searchTerm.trim().toLowerCase());
    if (!found) {
      setSearchModalMsg('This product is not found in your region.');
      setShowSearchModal(true);
    }
    setSearchTouched(true);
  };

  const closeModal = () => setShowModal(false);
  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchModalMsg('');
  };
  const navigate = useNavigate();

  useEffect(() => {
    // Use proxy path for development
      <Footer />
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors' // Explicitly request CORS mode
    })
      .then(res => {
        if (!res.ok) {
          console.error('API Error:', res.status);
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Fetch error:', error);
        setProducts([]);
      });
  }, []);
  const user = JSON.parse(localStorage.getItem('alfauser'));
  const token = user?.token;
 const handleLogout = () => {
    localStorage.removeItem('alfauser');
    navigate('/login');
  };


  return (
    <div className="main-landing-page" style={{
      background: 'linear-gradient(135deg, #fbbf24 0%, #f8fafc 60%, #a7f3d0 100%)',
      minHeight: '100vh',
      padding: 0,
      margin: 0,
    }}>
      {/* Navbar */}
      <div className="navbar-container">
        <div className="logo">
          <img src={Logo} alt="E-Commerce Logo" />
        </div>
        {token ? (
          <div className="links">
            <Link className="button" to={user?.role === 'admin' ? '/admin' : '/seller'} title="Dashboard">
              <span role="img" aria-label="dashboard"><MdDashboard /></span> Dashboard
            </Link>
            <button className="button" onClick={handleLogout} title="Logout">
              <MdLogout /> Logout
            </button>
          </div>
        ) : <div className="links">
          <Link className="button" to="/login"> <MdLock /> Login</Link>
          <Link className="button" to="/signup"> <MdLock /> Register</Link>
        </div>}
      </div>

      {/* Beautiful Search Bar below navbar */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #f8fafc 60%, #f0f4fa 100%)',
        padding: '8px 0 8px 0',
        boxShadow: '0 2px 12px rgba(30,41,59,0.04)',
      }}>
        <form style={{
          display: 'flex',
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(90deg, #fff 60%, #f8fafc 100%)',
          borderRadius: 18,
          boxShadow: '0 2px 12px rgba(30,41,59,0.10)',
          padding: '6px 10px',
          border: '1.5px solid #e0e7ee',
        }} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="🔍 Search products by name..."
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: 14,
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #f8fafc 60%, #f0f4fa 100%)',
              color: '#1e293b',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            marginLeft: 10,
            padding: '0 28px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(90deg, #e11d48 60%, #fbbf24 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(13,110,253,0.07)',
            letterSpacing: 1,
            transition: 'background 0.18s',
          }}>Search</button>
        </form>
      </div>
      {/* Modal for Buy Now */}
      {showModal && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notice</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
               Oops! Looks like this product isn’t accessible in your location. Get in touch with customer support for options. We’re here to help!
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Search Not Found or Empty Input */}
      {showSearchModal && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Search</h5>
                <button type="button" className="btn-close" onClick={closeSearchModal}></button>
              </div>
              <div className="modal-body">
                {searchModalMsg}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeSearchModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
     
     
      <div className="main-content">
       <div className="slider-wrapper">
         <Slider {...settings}>
        <div className='image-wrapper'>
          <img src={BF1} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={BF2} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={BF4} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={BF3} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={BF5} alt="" />
        </div>
         <div className='image-wrapper'>
          <img src={BF6} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={BF7} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner3} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner12} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner13} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner14} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner15} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner4} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner5} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner6} alt="" />
        </div>
        <div className='image-wrapper'>
          <img src={Banner7} alt="" />
        </div>
         <div className='image-wrapper'>
          <img src={Banner8} alt="" />
        </div>
         <div className='image-wrapper'>
          <img src={Banner9} alt="" />
        </div>
         <div className='image-wrapper'>
          <img src={Banner10} alt="" />
        </div>
         <div className='image-wrapper'>
          <img src={Banner11} alt="" />
        </div>
      </Slider>
       </div>
      <div className="add-section" style={{
        background: 'linear-gradient(90deg, #fbbf24 0%, #f472b6 100%)',
        borderRadius: 18,
        boxShadow: '0 2px 12px rgba(251,191,36,0.10)',
        padding: '32px 0',
        margin: '32px 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24
      }}>
        <img src={Banner15} alt="Selected Headphones" style={{ width: '100%', maxWidth: 320, borderRadius: 16, boxShadow: '0 2px 12px rgba(30,41,59,0.08)' }} />
        <div className="text" style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 3vw, 2.2rem)', color: '#1e293b', letterSpacing: 1 }}>
          Grab up to <span style={{ color: '#e11d48' }}>50% off</span> on <br />
          <span style={{ color: '#fbbf24', background: '#1e293b', borderRadius: 8, padding: '2px 12px', marginLeft: 4 }}>Selected Footwars</span>.
        </div>
      </div>
      {/* Newest Section - Slider */}
      <div className="banner-main">
        <img src={Banner12} alt="" />
      </div>
      <h2 className="main-title">Newest</h2>
      <div className="product-slider-section">
        <Slider {...productSliderSettings}>
          {products
            .filter(p => p.category?.toLowerCase() === 'newest')
            .map(product => (
              <div key={product._id || product.id} className="product-slider-card">
                <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                  <div className="card product-fixed-card">
                    <div className="image">
                      <img src={product.image || product.imageUrl} className="card-img-top" alt={product.name} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title product-title-2lines" title={product.name}>{product.name}</h5>
                      <p className="card-text product-desc-small">{product.description?.split(' ').slice(0, 10).join(' ')}{product.description?.split(' ').length > 10 ? '...' : ''}</p>
                      <p className="card-text category">{product.category}</p>
                      <p className="card-text fw-bold">
                        {product.discountedPrice && product.discountedPrice < product.price ? (
                          <span style={{ color: '#e11d48', fontWeight: 700 }}>Price: ${product.discountedPrice}</span>
                        ) : (
                          <>${product.price}</>
                        )}
                      </p>
                      <button className="btn btn-primary product-btn-smaller" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </Slider>
      </div>
      <div className="banner-main">
        <img src={BF1} alt="" />
      </div>

      {/* Popular Section - Slider */}
      <h2 className="main-title">Popular</h2>
      <div className="product-slider-section">
        <Slider {...productSliderSettings}>
          {products
            .filter(p => p.category?.toLowerCase() === 'popular')
            .map(product => (
              <div key={product._id || product.id} className="product-slider-card">
                <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                  <div className="card product-fixed-card">
                    <div className="image">
                      <img src={product.image || product.imageUrl} className="card-img-top" alt={product.name} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title product-title-2lines" title={product.name}>{product.name}</h5>
                      <p className="card-text product-desc-small">{product.description?.split(' ').slice(0, 10).join(' ')}{product.description?.split(' ').length > 10 ? '...' : ''}</p>
                      <p className="card-text category">{product.category}</p>
                      <p className="card-text fw-bold">
                        {product.discountedPrice && product.discountedPrice < product.price ? (
                          <span style={{ color: '#e11d48', fontWeight: 700 }}>Price: ${product.discountedPrice}</span>
                        ) : (
                          <>${product.price}</>
                        )}
                      </p>
                      <button className="btn btn-primary product-btn-smaller" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </Slider>
      </div>
<div className="banner-main">
        <img src={BF2} alt="" />
      </div>
      {/* Most Selling Section - Slider */}
      <h2 className="main-title">Most Selling</h2>
      <div className="product-slider-section">
        <Slider {...productSliderSettings}>
          {products
            .filter(p => p.category?.toLowerCase() === 'most selling')
            .map(product => (
              <div key={product._id || product.id} className="product-slider-card">
                <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                  <div className="card product-fixed-card">
                    <div className="image">
                      <img src={product.image || product.imageUrl} className="card-img-top" alt={product.name} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title product-title-2lines" title={product.name}>{product.name}</h5>
                      <p className="card-text product-desc-small">{product.description?.split(' ').slice(0, 10).join(' ')}{product.description?.split(' ').length > 10 ? '...' : ''}</p>
                      <p className="card-text category">{product.category}</p>
                      <p className="card-text fw-bold">
                        {product.discountedPrice && product.discountedPrice < product.price ? (
                          <span style={{ color: '#e11d48', fontWeight: 700 }}>Price: ${product.discountedPrice}</span>
                        ) : (
                          <>${product.price}</>
                        )}
                      </p>
                      <button className="btn btn-primary product-btn-smaller" onClick={handleBuyNow}>Buy Now</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </Slider>
      </div>
<div className="banner-main">
        <img src={BF3} alt="" />
      </div>
      {/* All Products Section - Slider */}
      <h2 className="main-title">All Products</h2>
      <div className="product-slider-section">
        <Slider {...productSliderSettings}>
          {products?.map(product => (
            <div key={product._id || product.id} className="product-slider-card">
              <Link to={`/product/${product._id || product.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <div className="card product-fixed-card">
                  <div className="image">
                    <img src={product.image || product.imageUrl} className="card-img-top" alt={product.name} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title product-title-2lines" title={product.name}>{product.name}</h5>
                    <p className="card-text product-desc-small">{product.description?.split(' ').slice(0, 10).join(' ')}{product.description?.split(' ').length > 10 ? '...' : ''}</p>
                    <p className="card-text category">{product.category}</p>
                    <p className="card-text fw-bold">
                      {product.discountedPrice && product.discountedPrice < product.price ? (
                        <span style={{ color: '#e11d48', fontWeight: 700 }}>Price: ${product.discountedPrice}</span>
                      ) : (
                        <>${product.price}</>
                      )}
                    </p>
                    <button className="btn btn-primary product-btn-smaller" onClick={handleBuyNow}>Buy Now</button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      <div className="banner-main">
        <img src={BF4} alt="" />
      </div>
      <div className="bottom-add">
         <h2 className="main-title">Avail Our Discounts</h2>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="image">
              <img src={BF6} alt="Sale Banner 1" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="image">
              <img src={BF7} alt="Sale Banner 2" />
            </div>
          </div>
        </div>
      </div>
      <div className="banner-main">
        <img src={BF5} alt="" />
      </div>
      <h2 className="main-title">Our Partners</h2>
      <div className="partners">
        <img src={Partners} alt="Our Partners" />
      </div>
      {/* Product Slider Styles - Separate Tag */}
      <style>{`
        .product-slider-section {
          margin-bottom: 32px;
        }
        .product-slider-card {
          padding: 8px;
        }
        .product-fixed-card {
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(30,41,59,0.08);
          overflow: hidden;
          min-height: 360px;
          max-height: 360px;
          display: flex;
          flex-direction: column;
        }
        .product-fixed-card .card-img-top {
          border-radius: 10px;
          height: 120px;
          object-fit: contain;
          background: #f6f7fb;
        }
        .product-fixed-card .card-body {
          padding: 10px 10px 0 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .product-title-2lines {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          min-height: 2.6em;
          max-height: 2.6em;
        }
        .product-fixed-card .card-text.product-desc-small {
          font-size: 0.85rem;
          margin-bottom: 1px;
        }
        .product-fixed-card .category {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 1px;
        }
        .product-fixed-card .fw-bold {
          margin-bottom: 2px;
        }
        .product-btn-smaller {
          font-size: 0.85rem;
          padding: 5px 0;
          border-radius: 7px;
          margin-top: auto;
          margin-bottom: 10px;
          width: 100%;
          display: block;
        }
        @media (max-width: 900px) {
          .product-title-2lines {
            font-size: 0.95rem;
          }
          .product-fixed-card .card-text.product-desc-small {
            font-size: 0.75rem;
          }
          .product-fixed-card {
            min-height: 260px;
            max-height: 260px;
          }
          .product-fixed-card .card-img-top {
            height: 80px;
          }
          .product-btn-smaller {
            font-size: 0.75rem;
            padding: 4px 0;
            margin-bottom: 10px;
          }
        }
        @media (max-width: 760px) {
          .product-slider-card {
            padding: 2px;
          }
          .product-fixed-card {
            min-height: 200px;
            max-height: 200px;
            border-radius: 8px;
          }
          .product-fixed-card .card-img-top {
            height: 90px;
            border-radius: 6px;
            object-fit: cover;
          }
            .slick-next{
            right:-18px;
            }
            .slick-prev{
            left:-18px;}
            .main-landing-page .main-content .main-title {
            font-size: 18px;}
          .product-title-2lines {
            font-size: 0.7rem;
            min-height: 1.2em;
            max-height: 2.5em;
            -webkit-line-clamp: 2;
            margin-bottom: 1px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
          }
          .product-fixed-card .card-text.product-desc-small {
            font-size: 0.6rem;
            margin-bottom: 0.5px;
            display:none;
          }
          .product-fixed-card .category {
            font-size: 0.6rem;
            margin-bottom: 0.5px;
          }
          .product-fixed-card .fw-bold {
            margin-bottom: 1px;
          }
          .product-btn-smaller {
            font-size: 0.6rem;
            padding: 3px 0;
            margin-bottom: 5px;
            display: block;
          }
        }
      `}</style>
     
      </div>
      

    {/* Footer removed, now rendered globally in App.jsx */}
    <Footer />
  </div>
  );
}

export default LandingPage;
