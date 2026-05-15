import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, buildImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCart = () => {
    setError('');
    apiRequest('/cart')
      .then((data) => setCart(data.data || null))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (user?.role === 'customer') loadCart();
  }, [user]);

  const items = cart?.items || [];

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.product?.price || 0) * Number(item.quantity || 1),
        0
      ),
    [items]
  );

  const total = subtotal + 3;

  const updateQty = async (itemId, quantity) => {
    try {
      const response = await apiRequest(`/cart/item/${itemId}`, {
        method: 'PUT',
        body: { quantity },
      });
      setMessage(response.message || 'Cart updated');
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message);
    }
  };
  
  const removeItem = async (itemId) => {
    try {
      const response = await apiRequest(`/cart/item/${itemId}`, {
        method: 'DELETE',
      });
      setMessage(response.message || 'Item removed');
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message);
    }
  };
  
  const placeOrder = async () => {
    try {
      const response = await apiRequest('/orders', {
        method: 'POST',
      });
  
      setMessage(response.message || 'Order placed successfully');
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (user?.role !== 'customer') {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Login as customer to use cart.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart Page</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {!items.length ? (
            <div className="text-center py-5">
              <h4>Your cart is empty.</h4>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Handle</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={buildImageUrl(item.product?.image)}
                          className="img-fluid rounded"
                          alt={item.product?.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                          }}
                        />
                      </td>

                      <td>{item.product?.name}</td>

                      <td>${item.product?.price}</td>

                      <td>
                        <div
                          className="input-group quantity"
                          style={{ width: '120px' }}
                        >
                          <button
                            className="btn btn-sm btn-minus rounded-circle bg-light border"
                            onClick={() =>
                              updateQty(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                          >
                            -
                          </button>

                          <input
                            type="text"
                            className="form-control text-center border-0"
                            value={item.quantity}
                            readOnly
                          />

                          <button
                            className="btn btn-sm btn-plus rounded-circle bg-light border"
                            onClick={() =>
                              updateQty(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      
                      <td>
                        $
                        {(
                          item.product?.price * item.quantity
                        ).toFixed(2)}
                      </td>

                      <td>
                        <button
                          className="btn btn-md rounded-circle bg-light border"
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="fa fa-times text-danger"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          
          <div className="row g-4 justify-content-end mt-4">
            <div className="col-md-6 col-lg-4">
              <div className="bg-light rounded p-4">
                <h4 className="mb-4">Cart Summary</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span>$3.00</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <button
                  className="btn btn-primary w-100 rounded-pill"
                  onClick={placeOrder}
                  disabled={!items.length}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;