import { Link, NavLink } from 'react-router-dom';
import { buildImageUrl } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

const itemClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

function DashboardSidebar() {
  const { user } = useAuth();

  const role = user?.role;

  const profileImage = user?.image
    ? buildImageUrl(user.image)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">

      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top dashboard-logo">
        <Link className="sidebar-brand-text" to="/dashboard">
          VISION<span>.</span>MART
        </Link>

        <Link className="sidebar-brand-mini-text" to="/dashboard">
          VM
        </Link>
      </div>

      <ul className="nav">

        
        <li className="nav-item profile">
          <div className="profile-desc">
            <div className="profile-pic">

              <div className="count-indicator">
                <img
                  className="img-xs rounded-circle"
                  src={profileImage}
                  alt="profile"
                />
                <span className="count bg-success"></span>
              </div>

              <div className="profile-name">
                <h5 className="mb-0 profile-username">
                  {user?.name || 'User'}
                </h5>
                <span className="profile-role">{role}</span>
              </div>

            </div>
          </div>
        </li>

        
        <li className="nav-item menu-items">
          <NavLink className={itemClass} to="/dashboard" end>
            <span className="menu-icon">
              <i className="mdi mdi-speedometer"></i>
            </span>
            <span className="menu-title">Dashboard</span>
          </NavLink>
        </li>

        
        {role === 'admin' && (
          <>
            <li className="nav-item menu-items">
              <NavLink className={itemClass} to="/dashboard/categories">
                <span className="menu-icon">
                  <i className="mdi mdi-format-list-bulleted-type"></i>
                </span>
                <span className="menu-title">Categories</span>
              </NavLink>
            </li>

            <li className="nav-item menu-items">
              <NavLink className={itemClass} to="/dashboard/products">
                <span className="menu-icon">
                  <i className="mdi mdi-tshirt-crew"></i>
                </span>
                <span className="menu-title">Products</span>
              </NavLink>
            </li>

            <li className="nav-item menu-items">
              <NavLink className={itemClass} to="/dashboard/sellers">
                <span className="menu-icon">
                  <i className="fa fa-user-circle-o"></i>
                </span>
                <span className="menu-title">Sellers</span>
              </NavLink>
            </li>

            <li className="nav-item menu-items">
              <NavLink className={itemClass} to="/dashboard/customers">
                <span className="menu-icon">
                  <i className="fa fa-user-o"></i>
                </span>
                <span className="menu-title">Customers</span>
              </NavLink>
            </li>
          </>
        )}

        
        {role === 'seller' && (
          <li className="nav-item menu-items">
            <NavLink className={itemClass} to="/dashboard/products">
              <span className="menu-icon">
                <i className="mdi mdi-tshirt-crew"></i>
              </span>
              <span className="menu-title">My Products</span>
            </NavLink>
          </li>
        )}

      </ul>
    </nav>
  );
}

export default DashboardSidebar;