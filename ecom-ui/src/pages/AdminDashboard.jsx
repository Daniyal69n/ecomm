import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { MdLogout } from 'react-icons/md';
import { MdWeb } from 'react-icons/md';
import { MdMenu, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
localStorage.removeItem('alfauser');
window.location.href = '/login'; // This ensures a full reload and clears any cached state
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-main">
      {/* Mobile Header with Hamburger */}
      <div className="mobile-header d-md-none">
        <button 
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
        <h4 className="mobile-title mb-0">Admin Dashboard</h4>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay d-md-none"
          onClick={closeSidebar}
        ></div>
      )}

      <div className={`side-bar ${sidebarOpen ? 'sidebar-open' : ''}`}>
       
      <nav className="nav nav-pills mb-4">
         <NavLink className="nav-link" to="/admin" onClick={closeSidebar}>Dashboard</NavLink>
        <NavLink className="nav-link" to="/admin/products" onClick={closeSidebar}>Products</NavLink>
        <NavLink className="nav-link" to="/admin/chat" onClick={closeSidebar}>Messages</NavLink>
        <NavLink className="nav-link" to="/admin/users" onClick={closeSidebar}>Users</NavLink>
        <NavLink className="nav-link" to="/admin/orders" onClick={closeSidebar}>Orders</NavLink>
        <NavLink className="nav-link" to="/admin/faqs" onClick={closeSidebar}>FAQs</NavLink>
        <NavLink className="nav-link" to="/admin/deposits" onClick={closeSidebar}>Deposits</NavLink>
        <NavLink className="nav-link" to="/admin/create-order" onClick={closeSidebar}>Create Order</NavLink>
        <NavLink className="nav-link" to="/admin/create-product" onClick={closeSidebar}>Create Product</NavLink>
      </nav>
       <div className='admin-header'>
        
        
          <button className="button" onClick={handleLogout}> <MdLogout /> Logout</button>
          <Link className="button" to='/' > <MdWeb /> Visit Website</Link>
        
        
      </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>

      <style jsx>{`
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          padding: 0 20px;
          z-index: 1030;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .hamburger-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          margin-right: 15px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .hamburger-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .mobile-title {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          backdrop-filter: blur(2px);
        }

        @media (max-width: 767.98px) {
          .dashboard-main {
            padding-top: 60px;
          }

          .side-bar {
            position: fixed !important;
            top: 60px;
            left: -100%;
            width: 280px;
            height: calc(100vh - 60px);
            background: white;
            z-index: 1050;
            transition: left 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          }

          .side-bar.sidebar-open {
            left: 0;
          }

          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .nav-pills .nav-link {
            padding: 12px 20px;
            margin: 2px 10px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .nav-pills .nav-link:hover {
            background-color: #f8f9fa;
            transform: translateX(5px);
          }

          .nav-pills .nav-link.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .admin-header {
            position: sticky;
            bottom: 0;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            padding: 15px 10px;
          }

          .admin-header .button {
            width: 100%;
            margin: 5px 0;
            padding: 10px;
            font-size: 0.9rem;
          }
        }

        @media (min-width: 768px) {
          .mobile-header {
            display: none !important;
          }
          
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
