import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { buildImageUrl } from '../../../api';

function DashboardNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <button className="navbar-toggler align-self-center" type="button" onClick={onToggleSidebar}>
          <span className="mdi mdi-menu"></span>
        </button>

        <ul className="navbar-nav w-100">
          <li className="nav-item w-100">
            <form className="nav-link mt-2 mt-md-0 d-none d-lg-flex search" onSubmit={(e) => e.preventDefault()}>
              <input type="text" className="form-control" placeholder="Search products" />
            </form>
          </li>
        </ul>

        <ul className="navbar-nav navbar-nav-right">
          <li className={`nav-item dropdown ${open ? 'show' : ''}`}>
            <button
              className="nav-link bg-transparent border-0"
              type="button"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="navbar-profile">
                <img
                  className="img-xs rounded-circle"
                  src={
                    user?.image
                      ? buildImageUrl(user.image)
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}`
                  }
                  alt=""
                />
                <p className="mb-0 d-none d-sm-block navbar-profile-name ms-2">
                  {user?.name}
                </p>
                <i className="mdi mdi-menu-down d-none d-sm-block ms-1"></i>
              </div>
            </button>

            <div className={`dropdown-menu dropdown-menu-end navbar-dropdown preview-list ${open ? 'show' : ''}`}>
              <h6 className="p-3 mb-0">Profile</h6>

              <div className="dropdown-divider"></div>

              <Link
                className="dropdown-item preview-item"
                to="/dashboard/profile"
                onClick={() => setOpen(false)}
              >
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-cog text-success"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1">Settings</p>
                </div>
              </Link>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item preview-item bg-transparent border-0 w-100"
                type="button"
                onClick={logout}
              >
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-logout text-danger"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1">Log out</p>
                </div>
              </button>
            </div>
          </li>
        </ul>

        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={onToggleSidebar}>
          <span className="mdi mdi-format-line-spacing"></span>
        </button>
      </div>
    </nav>
  );
}

export default DashboardNavbar;