import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';
import { useAuth } from '../context/AuthContext';
import ProductCard from './common/ProductCard';

function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadWishlist = () => {
    setError('');
    apiRequest('/wishlist')
      .then((data) => setWishlist(data.data || null))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (user?.role === 'customer') {
      loadWishlist();
    }
  }, [user]);

  const items = wishlist?.items || [];

  const removeItem = async (itemId) => {
    try {
      const response = await apiRequest(`/wishlist/item/${itemId}`, {
        method: 'DELETE',
      });

      setMessage(response.message || 'Removed from wishlist');
      loadWishlist();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/cart/${productId}`, {
        method: 'POST',
      });

      setMessage(response.message || 'Product added to cart successfully');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    const existingItem = items.find(
      (item) => String(item.product?.id) === String(product.id)
    );

    if (!existingItem) return;

    await removeItem(existingItem.id);
  };

  if (user?.role !== 'customer') {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Login as customer to use wishlist.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Wishlist Page</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Wishlist</li>
        </ol>
      </div>

      <div className="container-fluid product py-5">
        <div className="container py-5">
          {error ? <div className="alert alert-danger mb-4">{error}</div> : null}
          {message ? <div className="alert alert-success mb-4">{message}</div> : null}

          {!items.length ? (
            <div className="text-center py-5">
              <h4>Your wishlist is empty.</h4>
            </div>
          ) : (
            <div className="row g-4">
              {items.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={item.product}
                  delay={`${0.1 + (index % 4) * 0.2}s`}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WishlistPage;