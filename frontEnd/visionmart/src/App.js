import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import Category from './components/Category';
import Single from './components/Single';
import NotFound from './components/NotFound';
import AuthPage from './components/AuthPage';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import OrdersPage from './components/OrdersPage';
import EditProfile from './components/EditProfile';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/pages/DashboardHome';
import ProductsPage from './components/dashboard/pages/ProductsPage';
import ProductFormPage from './components/dashboard/pages/ProductFormPage';
import CategoriesPage from './components/dashboard/pages/CategoriesPage';
import CategoryFormPage from './components/dashboard/pages/CategoryFormPage';
import UsersPage from './components/dashboard/pages/UsersPage';
import ProfilePage from './components/dashboard/pages/ProfilePage';

function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className="app-shell">
      {!hideLayout && <Nav />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Category/:category" element={<Category />} />
          <Route path="/Single/:category/:id" element={<Single />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/create" element={<CategoryFormPage />} />
            <Route path="categories/:id/edit" element={<CategoryFormPage />} />
            <Route path="sellers" element={<UsersPage type="sellers" />} />
            <Route path="customers" element={<UsersPage type="customers" />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
