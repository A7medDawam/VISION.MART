import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, buildImageUrl } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import StatusAlert from '../shared/StatusAlert';

function StatCards({ stats, role }) {
  const adminCards = [
    [stats.totalProducts, 'Products', 'All products in system', 'icon-box-success', 'mdi-package-variant'],
    [stats.totalSellers, 'Sellers', 'Registered sellers', 'icon-box-warning', 'mdi-account-tie'],
    [stats.totalCustomers, 'Customers', 'Registered customers', 'icon-box-info', 'mdi-account-group'],
    [stats.totalUsers, 'Users', 'Sellers + customers', 'icon-box-danger', 'mdi-account-multiple'],
  ];

  const sellerCards = [
    [stats.myProducts, 'My Products', 'Products you created', 'icon-box-success', 'mdi-package-variant'],
    [stats.orderedProducts, 'Ordered Products', 'Products sold at least once', 'icon-box-info', 'mdi-cart'],
    [stats.totalSales, 'Total Sales', 'Total earnings', 'icon-box-warning', 'mdi-cash'],
    [stats.productsInStock, 'Stock Quantity', 'Total available stock', 'icon-box-danger', 'mdi-archive'],
  ];

  const cards = role === 'admin' ? adminCards : sellerCards;

  return (
    <div className="row">
      {cards.map(([value, title, subtitle, iconBox, icon]) => (
        <div className="col-xl-3 col-sm-6 grid-margin stretch-card" key={title}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-9">
                  <h3 className="mb-0">{value ?? 0}</h3>
                </div>
                <div className="col-3">
                  <div className={`icon ${iconBox}`}>
                    <span className={`mdi ${icon} icon-item`}></span>
                  </div>
                </div>
              </div>
              <h6 className="text-muted">{title}</h6>
              <p className="text-muted small">{subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniProductsTable({ products, onDeleteProduct }) {
  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <Link to="/dashboard/products/create" className="btn btn-primary btn-rounded btn-fw vm-create-btn mb-4">
            Create Product
          </Link>

          <h4 className="card-title">My Products</h4>

          <div className="table-responsive">
            <table className="table vm-products-table">
              <colgroup>
                <col className="col-id" />
                <col className="col-img" />
                <col className="col-name" />
                <col className="col-desc" />
                <col className="col-qty" />
                <col className="col-price" />
                <col className="col-cat" />
                <col className="col-date" />
                <col className="col-action" />
                <col className="col-action" />
              </colgroup>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>
                      <img className="vm-product-img" src={buildImageUrl(p.image)} alt="" />
                    </td>
                    <td className="cell-name">{p.name}</td>
                    <td className="cell-desc">{p.description}</td>
                    <td>{p.quantity}</td>
                    <td>{p.price}</td>
                    <td className="cell-cat">{p.category?.name}</td>
                    <td>{String(p.created_at || '').slice(0, 10)}</td>
                    <td>
                      <Link to={`/dashboard/products/${p.id}/edit`} className="btn btn-inverse-success btn-fw">
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-inverse-danger btn-fw"
                        onClick={() => onDeleteProduct(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {!products.length && (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniUsersTable({ title, users, type, onToggleStatus, onDeleteUser }) {
  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{title}</h4>

          <Link to={`/dashboard/${type}`} className="btn btn-sm btn-inverse-primary mb-3">
            View All {type === 'sellers' ? 'Sellers' : 'Customers'}
          </Link>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>{type === 'sellers' ? 'Products Count' : 'Orders Count'}</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Toggle</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-1">
                      <img
                        src={u.image ? buildImageUrl(u.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`}
                        alt=""
                      />
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{type === 'sellers' ? u.products_count : u.orders_count}</td>
                    <td>
                      {u.status ? (
                        <span className="text-success font-weight-bold">Active</span>
                      ) : (
                        <span className="text-danger font-weight-bold">Inactive</span>
                      )}
                    </td>
                    <td>{String(u.created_at || '').slice(0, 10)}</td>
                    <td>
                      <button
                        type="button"
                        className={u.status ? 'btn btn-inverse-warning btn-fw' : 'btn btn-inverse-success btn-fw'}
                        onClick={() => onToggleStatus(type, u.id)}
                      >
                        {u.status ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-inverse-danger btn-fw"
                        onClick={() => onDeleteUser(type, u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {!users.length && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No {type} found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDashboardData = async () => {
    try {
      setError('');

      if (user?.role === 'seller') {
        const [productsRes, statsRes] = await Promise.all([
          apiRequest('/seller/products?page=1'),
          apiRequest('/seller/dashboard-stats'),
        ]);

        const s = statsRes?.data || {};

        setProducts(productsRes?.data?.data?.slice(0, 5) || []);
        setSellers([]);
        setCustomers([]);

        setStats({
          myProducts: s.my_products || 0,
          orderedProducts: s.ordered_products || 0,
          totalSales: s.total_sales || 0,
          productsInStock: s.products_in_stock || 0,
        });

        return;
      }

      if (user?.role === 'admin') {
        const [adminProductsRes, sellersRes, customersRes] = await Promise.all([
          apiRequest('/admin/products?page=1'),
          apiRequest('/admin/sellers?page=1'),
          apiRequest('/admin/customers?page=1'),
        ]);

        const allProductsList = adminProductsRes?.data?.data || [];
        const sellersList = sellersRes?.data?.data || [];
        const customersList = customersRes?.data?.data || [];

        const adminPersonalProducts = allProductsList.filter(p => p.user_id === user?.id);

        setProducts(adminPersonalProducts.slice(0, 5));
        setSellers(sellersList.slice(0, 5));
        setCustomers(customersList.slice(0, 5));

        const totalSellers = sellersRes?.data?.total || sellersList.length || 0;
        const totalCustomers = customersRes?.data?.total || customersList.length || 0;

        setStats({
          totalProducts: adminProductsRes?.data?.total || 0,
          totalSellers,
          totalCustomers,
          totalUsers: totalSellers + totalCustomers,
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user?.role) loadDashboardData();
  }, [user?.role]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      const endpoint = user?.role === 'admin'
        ? `/admin/products/${id}`
        : `/seller/products/${id}`;

      await apiRequest(endpoint, { method: 'DELETE' });

      setMessage('Product deleted');
      loadDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (type, id) => {
    try {
      const endpoint = type === 'sellers'
        ? `/admin/sellers/${id}/toggle-status`
        : `/admin/customers/${id}/toggle-status`;

      await apiRequest(endpoint, { method: 'PUT' });

      setMessage('Status updated');
      loadDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (type, id) => {
    if (!window.confirm(`Delete this ${type === 'sellers' ? 'seller' : 'customer'}?`)) return;

    try {
      const endpoint = type === 'sellers'
        ? `/admin/sellers/${id}`
        : `/admin/customers/${id}`;

      await apiRequest(endpoint, { method: 'DELETE' });

      setMessage('User deleted');
      loadDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <StatusAlert error={error} message={message} />

      <StatCards stats={stats} role={user?.role} />

      <div className="row">
        <MiniProductsTable
          products={products}
          onDeleteProduct={handleDeleteProduct}
        />

        {user?.role === 'admin' && (
          <>
            <MiniUsersTable
              title="Latest Sellers"
              users={sellers}
              type="sellers"
              onToggleStatus={handleToggleStatus}
              onDeleteUser={handleDeleteUser}
            />

            <MiniUsersTable
              title="Latest Customers"
              users={customers}
              type="customers"
              onToggleStatus={handleToggleStatus}
              onDeleteUser={handleDeleteUser}
            />
          </>
        )}
      </div>
    </>
  );
}

export default DashboardHome;