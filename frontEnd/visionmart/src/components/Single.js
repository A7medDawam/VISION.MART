import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiRequest, buildImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

function Single() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    setMessage('');
    setQuantity(1);

    apiRequest(`/products/${id}`)
      .then((data) => {
        setProduct(data?.data || null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load product');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/cart/${product.id}`, {
        method: 'POST',
        body: {
          quantity: Number(quantity), 
        },
      });

      setMessage(response.message || 'Added to cart successfully');

      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/wishlist/${product.id}`, {
        method: 'POST',
      });

      setMessage(response.message || 'Added to wishlist');

      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-5">Product not found</div>;
  }

  return (
    <>
      <div className="container py-5">
        {message && <div className="alert alert-success">{message}</div>}

        <div className="row">
          <div className="col-md-6">
            <img
              src={buildImageUrl(product.image)}
              className="img-fluid single-product-image"
              alt={product.name}
            />
          </div>

          <div className="col-md-6">
            <h3>{product.name}</h3>
            <p>Category: {product.category?.name}</p>
            <h4>${product.price}</h4>
            <p>{product.description}</p>
            <p>Available: {product.quantity}</p>

            <p className="product-seller">
              <span className="label">Sold by:</span>{' '}
              {product?.user?.role === 'seller' ? (
                <span className="seller-name">{product.user.name}</span>
              ) : (
                <span className="sold-by-us">Sold by us</span>
              )}
            </p>

            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-light"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <span className="mx-3">{quantity}</span>

              <button
                className="btn btn-light"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(product.quantity, prev + 1)
                  )
                }
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary me-2"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={handleWishlist}
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Single;