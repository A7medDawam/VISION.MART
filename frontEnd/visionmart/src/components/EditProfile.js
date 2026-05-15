import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest, buildImageUrl } from '../api';
import { getInitials } from '../utils/helpers';
import '../styles/edit-profile.css';

function EditProfile() {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();



  const UPDATE_PROFILE_ENDPOINT = '/profile/update';

  const [mode, setMode] = useState('profile');

  const [form, setForm] = useState({
    name: '',
    email: '',
    image: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [preview, setPreview] = useState('');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setForm({
      name: user?.name || '',
      email: user?.email || '',
      image: null,
    });
  }, [isAuthenticated, navigate, user]);

  const profileImage = useMemo(() => buildImageUrl(user?.image), [user]);

  const initials = useMemo(() => getInitials(user?.name || form.name || 'U'), [form.name, user]);

  const resetAlerts = () => {
    setSuccess('');
    setError('');
  };

  const switchMode = () => {
    resetAlerts();
    setMode((prev) => (prev === 'profile' ? 'password' : 'profile'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    resetAlerts();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    resetAlerts();
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    resetAlerts();
    setForm((prev) => ({ ...prev, image: file }));

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    resetAlerts();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);

      if (form.image) {
        formData.append('image', form.image);
      }

      const data = await apiRequest(UPDATE_PROFILE_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const updatedUser = data?.user || data?.data?.user || data?.data || null;

      if (updatedUser && typeof setUser === 'function') {
        setUser(updatedUser);
      }

      setSuccess(data?.message || 'Profile updated successfully');
      setForm((prev) => ({ ...prev, image: null }));
      setPreview('');
      setImageError(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setLoadingPassword(true);
    resetAlerts();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('current_password', passwordForm.current_password);
      formData.append('password', passwordForm.password);
      formData.append('password_confirmation', passwordForm.password_confirmation);

      const data = await apiRequest(UPDATE_PROFILE_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const updatedUser = data?.user || data?.data?.user || data?.data || null;

      if (updatedUser && typeof setUser === 'function') {
        setUser(updatedUser);
      }

      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });

      setSuccess('Password updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <section className="edit-profile-page">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="profile-header-top">
                <div>
              <h1>{mode === 'profile' ? 'Edit Profile' : 'Change Password'}</h1>
              <p>
                {mode === 'profile'
                  ? 'Update your account information'
                  : 'Enter your old password before setting a new one'}
              </p>
            </div>

            <button
              type="button"
              className="btn-change-password"
              onClick={switchMode}
            >
              {mode === 'profile' ? 'Change Password' : 'Back To Profile'}
            </button>
          </div>
        </div>

        <div className="edit-profile-body">
          <div className="edit-profile-sidebar">
            <div className="edit-profile-avatar-wrap">
              {preview ? (
                <img src={preview} alt="Preview" className="edit-profile-avatar" />
              ) : profileImage && !imageError ? (
                <img
                  src={profileImage}
                  alt={user?.name || 'Profile'}
                  className="edit-profile-avatar"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="edit-profile-avatar fallback">{initials}</div>
              )}
            </div>

            <h3>{form.name || user?.name}</h3>
            <span className="edit-profile-role">{user?.role || 'User'}</span>
          </div>

          {mode === 'profile' ? (
            <form className="edit-profile-form" onSubmit={handleSubmit}>
              {success ? <div className="profile-alert success">{success}</div> : null}
              {error ? <div className="profile-alert error">{error}</div> : null}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
                <label>Profile Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <small>You can leave this empty if you do not want to change the image.</small>
              </div>

              <div className="edit-profile-actions">
                <button type="button" className="btn-light-custom" onClick={() => navigate(-1)}>
                  Cancel
                </button>

                <button type="submit" className="btn-primary-custom" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <form className="edit-profile-form" onSubmit={handlePasswordSubmit}>
              {success ? <div className="profile-alert success">{success}</div> : null}
              {error ? <div className="profile-alert error">{error}</div> : null}

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={passwordForm.password_confirmation}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="edit-profile-actions">
                <button type="button" className="btn-light-custom" onClick={switchMode}>
                  Back
                </button>

                <button type="submit" className="btn-primary-custom" disabled={loadingPassword}>
                  {loadingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default EditProfile;