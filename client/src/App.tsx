import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Toast from './components/Toast/Toast';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


import Home from './pages/Home';
import Menu from './pages/Menu';
import Story from './pages/Story';
import Contact from './pages/Contact';


import Login from './pages/auth/Login';


import AdminOverview   from './pages/admin/AdminOverview';
import AdminOrders     from './pages/admin/AdminOrders';
import AdminMenuMgmt   from './pages/admin/AdminMenuMgmt';
import AdminCustomers  from './pages/admin/AdminCustomers';
import AdminMessages   from './pages/admin/AdminMessages';

// User pages
import UserHome        from './pages/user/UserHome';
import UserOrders      from './pages/user/UserOrders';
import UserFavourites  from './pages/user/UserFavourites';
import UserProfile     from './pages/user/UserProfile';


const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, showToast } = useToast();
  return (
    <>
      <Navbar />
      <CartDrawer onOrder={() => showToast('🎀 Order placed! Your cookies are on their way.')} />
      {children}
      {toasts.map(t => <Toast key={t.id} message={t.message} />)}
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Routes>

          <Route path="/"        element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/menu"    element={<PublicLayout><Menu /></PublicLayout>} />
          <Route path="/story"   element={<PublicLayout><Story /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />


          <Route path="/login" element={<Login />} />


          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/orders"    element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/menu"      element={<ProtectedRoute role="admin"><AdminMenuMgmt /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute role="admin"><AdminCustomers /></ProtectedRoute>} />
          <Route path="/admin/messages"  element={<ProtectedRoute role="admin"><AdminMessages /></ProtectedRoute>} />

          <Route path="/dashboard"              element={<ProtectedRoute role="user"><UserHome /></ProtectedRoute>} />
          <Route path="/dashboard/orders"       element={<ProtectedRoute role="user"><UserOrders /></ProtectedRoute>} />
          <Route path="/dashboard/favourites"   element={<ProtectedRoute role="user"><UserFavourites /></ProtectedRoute>} />
          <Route path="/dashboard/profile"      element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;