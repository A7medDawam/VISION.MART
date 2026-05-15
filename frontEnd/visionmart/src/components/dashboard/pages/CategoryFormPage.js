import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../../api';
import StatusAlert from '../shared/StatusAlert';

function CategoryFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('1');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    apiRequest(`/admin/categories/${id}`).then((res) => { setName(res.data?.name || ''); setStatus(String(res.data?.status ?? 1)); }).catch((err) => setError(err.message));
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(isEdit ? `/admin/categories/${id}` : '/admin/categories', { method: isEdit ? 'PUT' : 'POST', body: { name, status: Number(status) } });
      setMessage(isEdit ? 'Category updated successfully' : 'Category created successfully');
      setTimeout(() => navigate('/dashboard/categories'), 500);
    } catch (err) { setError(err.message); }
  };

  return <div className="col-md-12 grid-margin stretch-card"><div className="card"><div className="card-body"><h4 className="card-title">{isEdit ? 'Edit Category' : 'Create Category'}</h4><StatusAlert error={error} message={message} /><form className="forms-sample" onSubmit={submit}><div className="form-group"><label>Name</label><input type="text" name="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" required /></div><div className="form-group"><label className="mt-2 me-2">Status</label><select className="btn btn-sm btn-outline-primary dropdown-toggle" value={status} onChange={(e) => setStatus(e.target.value)}><option value="1">Active</option><option value="0">Inactive</option></select></div><button type="submit" className="btn btn-primary me-2">Submit</button></form></div></div></div>;
}
export default CategoryFormPage;
