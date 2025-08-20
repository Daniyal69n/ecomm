
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileBottomBar from './components/MobileBottomBar';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { getSocket } from './services/socketService';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthCodeModal from './components/AuthCodeModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';
import RiskDisclosure from './pages/RiskDisclosure';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import SellerOrders from './pages/SellerOrders';
import SellerProductManagement from './pages/SellerProductManagement';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import SellerShop from './pages/SellerShop';
import SellerProfile from './pages/SellerProfile';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminCreateOrder from './pages/AdminCreateOrder';
import AdminCreateProduct from './pages/AdminCreateProduct';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ChatPage from './pages/ChatPage';
import ProductDetail from './pages/ProductDetail';
import ManageFAQs from './pages/ManageFAQs';
import SellerFAQs from './pages/SellerFAQs';
import ManageDeposits from './pages/ManageDeposits';
import SellerDeposits from './pages/SellerDeposits';


function App() {
  const user = JSON.parse(localStorage.getItem('alfauser'));

  useEffect(() => {
    if (!user || user.role !== 'seller') return;
    const socket = getSocket();
    if (!socket) return;
    const handleUserDeleted = (data) => {
      if (data?.userId === user._id) {
        localStorage.removeItem('alfauser');
        window.location.href = '/login';
      }
    };
    socket.on('user_deleted', handleUserDeleted);
    return () => {
      socket.off('user_deleted', handleUserDeleted);
    };
  }, [user]);

  const hideBottomBar = ["/login", "/signup"].includes(window.location.pathname);
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route path="/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/admin/*" element={user?.role == 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}> 
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="create-order" element={<AdminCreateOrder />} />
                <Route path="create-product" element={<AdminCreateProduct />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="faqs" element={<ManageFAQs />} />
                <Route path="deposits" element={<ManageDeposits />} />
              </Route>
              <Route path="/seller/*" element={user?.role == 'seller' ? <SellerDashboard /> : <Navigate to="/login" />}> 
                <Route index element={<SellerDashboardPage />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="manage-products" element={<SellerProductManagement />} />
                <Route path="payment-methods" element={<PaymentMethodsPage />} />
                <Route path="my-profile" element={<SellerProfile />} />
                <Route path="shop-settings" element={<SellerShop />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="faqs" element={<SellerFAQs />} />
                <Route path="deposits" element={<SellerDeposits />} />
                <Route path="faqs" element={<SellerFAQs />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          {/* Only show Footer on public (non-admin/seller) pages */}
          
          {/* Show MobileBottomBar everywhere except login/signup */}
          {!hideBottomBar && <MobileBottomBar />}
        </div>
      </Router>
    </>
  );
}

export default App;
