import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, buildImageUrl } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../shared/Pagination';
import StatusAlert from '../shared/StatusAlert';

function ProductsPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const base = user?.role === 'admin' ? '/admin/products' : '/seller/products';

  const load = useCallback(() => {
    setError('');

    apiRequest(`${base}?page=${page}`)
      .then((res) => {
        setProducts(res.data?.data || []);
        setMeta(res.data || null);
      })
      .catch((err) => setError(err.message));
  }, [base, page]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await apiRequest(`${base}/${id}`, { method: 'DELETE' });
      setMessage('Product deleted successfully');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">

          <Link to="/dashboard/products/create" className="btn btn-primary btn-rounded btn-fw vm-create-btn mb-4">
            Create Product
          </Link>

          <h4 className="card-title">Products</h4>

          <StatusAlert error={error} message={message} />

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
                {user?.role === 'admin' && <col className="col-seller" />}
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
                  {user?.role === 'admin' && <th>Seller</th>}
                  <th>Created</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td>{(meta?.from || 1) + i}</td>

                    <td>
                      <img className="vm-product-img" src={buildImageUrl(p.image)} alt="" />
                    </td>

                    <td className="cell-name">{p.name}</td>

                    <td className="cell-desc">{p.description}</td>

                    <td>{p.quantity}</td>
                    <td>{p.price}</td>
                    <td className="cell-cat">{p.category?.name}</td>

                    {user?.role === 'admin' && (
                      <td className="cell-seller">
                        {p.user?.role === 'seller' ? (
                          p.user?.name
                        ) : (
                          <span className="text-info font-weight-bold">Sold by us</span>
                        )}
                      </td>
                    )}

                    <td>{String(p.created_at || '').slice(0, 10)}</td>

                    <td>
                      <Link to={`/dashboard/products/${p.id}/edit`} className="btn btn-inverse-success btn-fw">
                        Edit
                      </Link>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="btn btn-inverse-danger btn-fw"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {!products.length && (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 11 : 10} className="text-center text-muted">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          <Pagination meta={meta} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;