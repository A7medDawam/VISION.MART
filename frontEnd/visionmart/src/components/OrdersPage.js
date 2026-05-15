import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest, buildImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOrders = () => {
    setError('');
    apiRequest('/orders')
      .then((data) => setOrders(data?.data?.data || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const toggleStatus = async (orderId) => {
    try {
      const response = await apiRequest(`/orders/${orderId}/toggle-status`, {
        method: 'PUT',
      });
      setMessage(response.message || 'Order status updated successfully');
      loadOrders();
    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const formatDate = (value) => {
    if (!value) return '';
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const getStatusBadgeClass = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (normalized === 'cancelled' || normalized === 'canceled') {
      return 'bg-danger';
    }

    if (
      normalized === 'completed' ||
      normalized === 'success' ||
      normalized === 'successful'
    ) {
      return 'bg-success';
    }

    return 'bg-primary';
  };

  const getToggleButtonText = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (normalized === 'cancelled' || normalized === 'canceled') {
      return 'Activate Order';
    }

    return 'Cancel Order';
  };

  const getToggleButtonClass = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (normalized === 'cancelled' || normalized === 'canceled') {
      return 'order-btn order-btn-activate';
    }

    return 'order-btn order-btn-cancel';
  };

  return (
    <>
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Orders Page</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Orders</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          {error ? <div className="alert alert-danger mb-4">{error}</div> : null}
          {message ? <div className="alert alert-success mb-4">{message}</div> : null}

          {!orders.length ? (
            <div className="text-center py-5">
              <h4>No orders yet.</h4>
            </div>
          ) : (
            <div className="row g-4">
              {orders.map((order) => (
                <div className="col-12" key={order.id}>
                  <div className="border rounded p-4 bg-light order-card">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                      <div>
                        <h4 className="mb-1">Order #{order.id}</h4>
                        <div className="text-dark fw-semibold mb-1">
                          Total: ${Number(order.total || 0).toFixed(2)}
                        </div>
                        {order.created_at ? (
                          <small className="text-muted">
                            Date: {formatDate(order.created_at)}
                          </small>
                        ) : null}
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`badge px-3 py-2 text-uppercase ${getStatusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>

                        <button
                          className={getToggleButtonClass(order.status)}
                          onClick={() => toggleStatus(order.id)}
                        >
                          {getToggleButtonText(order.status)}
                        </button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>Price</th>
                          </tr>
                        </thead>

                        <tbody>
                          {order.items?.map((item) => (
                            <tr key={item.id}>
                              <td>{item.product?.name || '—'}</td>

                              <td>
                                {item.product?.image ? (
                                  <img
                                    src={buildImageUrl(item.product.image)}
                                    alt={item.product?.name || 'Product'}
                                    className="order-product-image img-fluid rounded"
                                  />
                                ) : (
                                  <span className="text-muted">No image</span>
                                )}
                              </td>

                              <td>{item.quantity}</td>
                              <td>${Number(item.price || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrdersPage;