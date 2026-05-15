import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../../api';
import Pagination from '../shared/Pagination';
import StatusAlert from '../shared/StatusAlert';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(() => {
    apiRequest(`/admin/categories?page=${page}`).then((res) => {
      setCategories(res.data?.data || []);
      setMeta(res.data || null);
    }).catch((err) => setError(err.message));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }); setMessage('Category deleted successfully'); load(); }
    catch (err) { setError(err.message); }
  };

  return <div className="col-lg-12 grid-margin stretch-card"><div className="card"><Link to="/dashboard/categories/create" className="btn btn-primary btn-rounded btn-fw vm-create-btn">Create Category</Link><div className="card-body"><h4 className="card-title">Categories</h4><StatusAlert error={error} message={message} /><div className="table-responsive"><table className="table"><thead><tr><th>#</th><th>Name.</th><th>Created</th><th>Status</th><th>Update</th><th>Delete</th></tr></thead><tbody>{categories.map((c, i) => <tr key={c.id}><td>{(meta?.from || 1) + i}</td><td>{c.name}</td><td>{String(c.created_at || '').slice(0, 10)}</td><td><label>{Number(c.status) === 1 ? 'Active' : 'Inactive'}</label></td><td><Link to={`/dashboard/categories/${c.id}/edit`} className="btn btn-inverse-success btn-fw">Edit</Link></td><td><button onClick={() => remove(c.id)} className="btn btn-inverse-danger btn-fw">Delete</button></td></tr>)}</tbody></table><Pagination meta={meta} onPageChange={setPage} /></div></div></div></div>;
}
export default CategoriesPage;
