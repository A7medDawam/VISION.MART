import { useState } from 'react';
import { apiRequest, buildImageUrl } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import StatusAlert from '../shared/StatusAlert';

function ProfilePage() {
  const { user, setUser } = useAuth();

  const [mode, setMode] = useState('profile');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image ? buildImageUrl(user.image) : '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resetAlerts = () => {
    setError('');
    setMessage('');
  };

  const switchMode = () => {
    resetAlerts();
    setMode((prev) => (prev === 'profile' ? 'password' : 'profile'));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setLoadingProfile(true);
    resetAlerts();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);

      if (image) {
        formData.append('image', image);
      }

      const data = await apiRequest('/profile/update', {
        method: 'POST',
        body: formData,
      });

      if (data.user) {
        setUser(data.user);
        setPreview(data.user.image ? buildImageUrl(data.user.image) : '');
      }

      setMessage(data.message || 'Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setLoadingPassword(true);
    resetAlerts();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('current_password', currentPassword);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);

      const data = await apiRequest('/profile/update', {
        method: 'POST',
        body: formData,
      });

      if (data.user) {
        setUser(data.user);
      }

      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
      setMessage(data.message || 'Password updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <>
      <StatusAlert error={error} message={message} />

      <div className="row">
        <div className="col-md-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="profile-header-top">
                <div>
                  <h4 className="card-title">
                    {mode === 'profile' ? 'Edit Profile' : 'Change Password'}
                  </h4>
                  <p className="card-description">
                    {mode === 'profile'
                      ? 'Update your account information'
                      : 'Enter your old password before setting a new one'}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-inverse-primary btn-fw"
                  onClick={switchMode}
                >
                  {mode === 'profile' ? 'Change Password' : 'Back To Profile'}
                </button>
              </div>

              {mode === 'profile' ? (
                <form className="forms-sample" onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                     <div className="form-group">
                        <label>Profile Image</label>

                        <label className="dashboard-file-upload">
                            <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            />

                            <span className="dashboard-file-button">
                              Choose Image
                            </span>

                            <span className="dashboard-file-name">
                            {image ? image.name : 'No image selected'}
                            </span>
                        </label>
                     </div>

                  <button type="submit" className="btn btn-primary me-2" disabled={loadingProfile}>
                    {loadingProfile ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              ) : (
                <form className="forms-sample" onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter old password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary me-2" disabled={loadingPassword}>
                    {loadingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body text-center">
              <h4 className="card-title">Profile Preview</h4>

              <img
                src={
                  preview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}`
                }
                alt=""
                className="profile-preview-img mb-3"
              />

              <h5>{name}</h5>
              <p className="text-muted">{email}</p>
              <span className="badge badge-outline-success">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;