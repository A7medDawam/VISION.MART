import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest, predictCategory, buildImageUrl } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import StatusAlert from '../shared/StatusAlert';

const empty = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  category_id: '',
};

function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  const base = user?.role === 'admin' ? '/admin/products' : '/seller/products';

  useEffect(() => {
    apiRequest('/categories')
      .then((res) => setCategories(res.categories || []))
      .catch(() => {});

    if (isEdit) {
      apiRequest(`${base}/${id}`)
        .then((res) => {
          const p = res.data;

          setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            quantity: p.quantity || '',
            category_id: p.category_id || p.category?.id || '',
          });

          if (p.image) {
            setPreview(p.image);
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [base, id, isEdit]);

  const change = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];

    setImage(file || null);
    setAiMessage('');

    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setAiMessage('AI is analyzing image...');

    try {
      const data = await predictCategory(file);
      const confidence = data.confidence
        ? ` (${(data.confidence * 100).toFixed(2)}%)`
        : '';

      setAiMessage(`AI Suggests: ${data.predicted_category || 'Category'}${confidence}`);

      if (data.category_id) {
        setForm((f) => ({
          ...f,
          category_id: String(data.category_id),
        }));
      }
    } catch {
      setAiMessage('AI failed. Try again.');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    const body = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      body.append(key, value);
    });

    if (image) {
      body.append('image', image);
    }

    if (isEdit) {
      body.append('_method', 'PUT');
    }

    try {
      await apiRequest(isEdit ? `${base}/${id}` : base, {
        method: 'POST',
        body,
      });

      setMessage(isEdit ? 'Product updated successfully' : 'Product created successfully');

      setTimeout(() => navigate('/dashboard/products'), 500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="col-md-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <div className="product-form-header">
            <div>
              <h4 className="card-title">{isEdit ? 'Edit Product' : 'Create Product'}</h4>
              <p className="card-description">
                {isEdit ? 'Update product information' : 'Add a new product to your store'}
              </p>
            </div>
          </div>

          <StatusAlert error={error} message={message} />

          <form className="forms-sample product-form" onSubmit={submit}>
            <div className="row">
              <div className="col-lg-8">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={change}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control product-textarea"
                    value={form.description}
                    onChange={change}
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Price</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={form.price}
                        onChange={change}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control"
                        value={form.quantity}
                        onChange={change}
                        placeholder="Enter quantity"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category_id"
                    className="form-control product-select"
                    value={form.category_id}
                    onChange={change}
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="product-upload-box">
                  <label className="product-upload-label">Product Image</label>

                  <label className="product-upload-area">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={onImageChange}
                      required={!isEdit}
                    />

                    {preview ? (
                      <img
                        src={buildImageUrl(preview)}
                        alt="Product preview"
                        className="product-image-preview"
                      />
                    ) : (
                      <div className="product-upload-placeholder">
                        <i className="mdi mdi-cloud-upload"></i>
                        <span>Choose Product Image</span>
                        <small>JPG, PNG, WEBP</small>
                      </div>
                    )}
                  </label>

                  {aiMessage && (
                    <div className="product-ai-message">
                      {aiMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="product-form-actions">
              <button
                type="button"
                className="btn btn-inverse-light"
                onClick={() => navigate('/dashboard/products')}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductFormPage;