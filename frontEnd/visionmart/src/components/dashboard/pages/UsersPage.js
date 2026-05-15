import { useCallback, useEffect, useState } from 'react';
import { apiRequest, buildImageUrl } from '../../../api';
import Pagination from '../shared/Pagination';
import StatusAlert from '../shared/StatusAlert';

function UsersPage({ type }) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const singular = type === 'sellers' ? 'Seller' : 'Customer';
  const countField = type === 'sellers' ? 'products_count' : 'orders_count';

  const load = useCallback(() => {
    setError('');

    apiRequest(`/admin/${type}?page=${page}`)
      .then((res) => {
        setUsers(res.data?.data || []);
        setMeta(res.data || null);
      })
      .catch((err) => setError(err.message));
  }, [page, type]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id) => {
    try {
      await apiRequest(`/admin/${type}/${id}/toggle-status`, {
        method: 'PUT',
      });

      setMessage(`${singular} status updated successfully`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) return;

    try {
      await apiRequest(`/admin/${type}/${id}`, {
        method: 'DELETE',
      });

      setMessage(`${singular} deleted successfully`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{singular}s Table</h4>

          <StatusAlert error={error} message={message} />

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>{type === 'sellers' ? 'Products Count' : 'Orders Count'}</th>
                  <th>Status</th>
                  <th>Toggle Status</th>
                  <th>Created At</th>
                  <th>Remove {singular}</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-1">
                      <img
                        src={
                          u.image
                            ? buildImageUrl(u.image)
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`
                        }
                        alt=""
                      />
                    </td>

                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u[countField]}</td>

                    <td>
                      {u.status ? (
                        <span className="text-success font-weight-bold">Active</span>
                      ) : (
                        <span className="text-danger font-weight-bold">Inactive</span>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => toggle(u.id)}
                        className={`btn btn-sm ${
                          u.status ? 'btn-inverse-warning' : 'btn-inverse-success'
                        }`}
                      >
                        {u.status ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>

                    <td>{String(u.created_at || '').slice(0, 10)}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => remove(u.id)}
                        className="btn btn-inverse-danger btn-fw"
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

            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;