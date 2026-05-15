import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchCategories,
  fetchCart,
  fetchWishlist,
  searchByImage,
  buildImageUrl,
} from '../api';
import { getInitials } from '../utils/helpers';
import '../styles/profile-menu.css';

function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const categoriesDropdownRef = useRef(null);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);



  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const items =
          data?.categories || data?.data?.categories || data?.data || [];
        setCategories(items);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setCart(null);
      setWishlist(null);
      return;
    }

    const loadData = () => {
      fetchCart()
        .then((data) => setCart(data?.data || null))
        .catch(() => setCart(null));

      fetchWishlist()
        .then((data) => setWishlist(data?.data || null))
        .catch(() => setWishlist(null));
    };

    loadData();

    window.addEventListener('cartUpdated', loadData);

    return () => {
      window.removeEventListener('cartUpdated', loadData);
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buildProfileImage = () => {
    return buildImageUrl(user?.image);
  };



  const profileImage = buildProfileImage();
  const initials = getInitials(user?.name);

  const cartItems = cart?.items || [];
  const wishlistItems = wishlist?.items || [];

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + Number(item.product?.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cartItems]);

  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
  };

  const submitSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set('q', query.trim());
    }

    navigate(`/?${params.toString()}`);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('productsScrollRequested'));
    }, 120);
  };

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const preview = await fileToBase64(file);

      window.dispatchEvent(
        new CustomEvent('aiSearchStarted', {
          detail: { preview },
        })
      );

      const data = await searchByImage(file);

      const results =
        data?.results ||
        data?.data?.results ||
        data?.products ||
        data?.data?.products ||
        data?.similar_products ||
        data?.data?.similar_products ||
        [];

      const predictedCategory =
        data?.predicted_category ||
        data?.data?.predicted_category ||
        data?.category ||
        data?.data?.category ||
        '';

      const confidence =
        data?.confidence ||
        data?.prediction_confidence ||
        data?.data?.confidence ||
        data?.data?.prediction_confidence ||
        null;

      window.dispatchEvent(
        new CustomEvent('aiResultsReady', {
          detail: {
            results,
            preview,
            meta: {
              predictedCategory,
              confidence,
            },
          },
        })
      );
    } catch (error) {
      console.error('AI image search failed:', error);

      window.dispatchEvent(
        new CustomEvent('aiResultsFailed', {
          detail: {
            preview: '',
            message: 'AI search failed.',
          },
        })
      );
    } finally {
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="container-fluid px-5 py-4 d-none d-lg-block">
        <div className="row gx-0 align-items-center text-center">
          <div className="col-md-3 col-lg-3 text-center text-lg-start">
            {isAuthenticated ? (
              <div ref={profileMenuRef} className="profile-wrapper">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="profile-trigger"
                >
                  {profileImage && !imageError ? (
                    <img
                      src={profileImage}
                      alt={user?.name || 'Profile'}
                      className="profile-avatar"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="profile-avatar fallback">{initials}</div>
                  )}

                  <span className="profile-name">{user?.name}</span>

                  <i
                    className={`fas fa-chevron-${
                      isProfileMenuOpen ? 'up' : 'down'
                    } profile-arrow`}
                  ></i>
                </button>

                {isProfileMenuOpen ? (
                  <div className="profile-dropdown">
                    <Link
                      to="/profile/edit"
                      className="profile-menu-item edit"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span className="icon-circle edit-icon">
                        <i className="fas fa-user-edit"></i>
                      </span>
                      <span>Edit Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="profile-menu-item logout"
                    >
                      <span className="icon-circle logout-icon">
                        <i className="fas fa-sign-out-alt"></i>
                      </span>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline-primary rounded-pill px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>

          <div className="col-md-6 col-lg-6 text-center">
            <div className="position-relative ps-4">
              <form onSubmit={submitSearch}>
                <div className="d-flex border rounded-pill overflow-hidden">
                  <input
                    className="form-control border-0 rounded-0 w-100 py-3"
                    type="text"
                    placeholder="Search Looking For?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn border-0 border-start px-4 bg-white"
                    onClick={openImagePicker}
                    title="Search by image"
                  >
                    <i className="fas fa-camera text-dark"></i>
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 px-5 nav-search-btn"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="nav-file-input"
                  onChange={handleImageChange}
                />
              </form>
            </div>
          </div>

          <div className="col-md-3 col-lg-3 text-center text-lg-end">
            <div className="d-inline-flex align-items-center">
              <Link
                to={isAuthenticated ? '/wishlist' : '/login'}
                className="text-muted d-flex align-items-center justify-content-center me-3 text-decoration-none"
              >
                <span className="rounded-circle btn-md-square border d-flex align-items-center justify-content-center position-relative">
                  <i className="fas fa-heart"></i>

                  {wishlistCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '10px' }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </span>
              </Link>

              <Link
                to={isAuthenticated ? '/cart' : '/login'}
                className="text-muted d-flex align-items-center justify-content-center text-decoration-none"
              >
                <span className="rounded-circle btn-md-square border d-flex align-items-center justify-content-center position-relative">
                  <i className="fas fa-shopping-cart"></i>

                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: '10px' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </span>

                <span className="text-dark ms-2">
                  {user?.role === 'customer'
                    ? `$${cartTotal.toFixed(2)}`
                    : 'Cart'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid nav-bar p-0 sticky-top shadow-sm">
        <div className="row gx-0 bg-primary px-5 align-items-center">
          <div className="col-lg-3 d-none d-lg-block">
            <nav className="navbar navbar-light position-relative nav-categories-wrap" ref={categoriesDropdownRef}>
              <button
                className="navbar-toggler border-0 fs-4 w-100 px-0 text-start nav-categories-toggle"
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              >
                <h4 className="m-0">
                  <i className="fa fa-bars me-2"></i>
                  All Categories
                </h4>
              </button>

              {isCategoriesOpen && (
                <div
                  className="collapse navbar-collapse rounded-bottom show"
                  id="allCat"
                >
                  <div className="navbar-nav ms-auto py-0">
                    <ul className="list-unstyled categories-bars">
                      <li>
                        <Link
                          to="/"
                          className="text-decoration-none text-reset d-block"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <div className="categories-bars-item">
                            <span>All Categories</span>
                          </div>
                        </Link>
                      </li>

                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            to={`/?category=${category.id}`}
                            className="text-decoration-none text-reset d-block"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            <div className="categories-bars-item">
                              <span>{category.name}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </nav>
          </div>

          <div className="col-12 col-lg-9">
            <nav className="navbar navbar-expand-lg navbar-light bg-primary">


              <button
                className="navbar-toggler ms-auto"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
              >
                <span className="fa fa-bars fa-1x"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav ms-auto py-0">
                  <NavLink to="/" end className="nav-item nav-link">
                    Home
                  </NavLink>

                  <NavLink to="/orders" className="nav-item nav-link">
                    Orders
                  </NavLink>

                  <div className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link text-decoration-none border-0 shadow-none"
                      data-bs-toggle="dropdown"
                      type="button"
                    >
                      Pages
                    </button>
                    <div className="dropdown-menu m-0">
                      <Link to="/wishlist" className="dropdown-item">
                        Wishlist
                      </Link>
                      <Link to="/cart" className="dropdown-item">
                        Cart Page
                      </Link>
                      <Link to="/profile/edit" className="dropdown-item">
                        Edit Profile
                      </Link>
                    </div>
                  </div>



                  <div className="nav-item dropdown d-block d-lg-none mb-3">
                    <button
                      className="nav-link dropdown-toggle btn btn-link text-decoration-none border-0 shadow-none"
                      data-bs-toggle="dropdown"
                      type="button"
                    >
                      All Category
                    </button>

                    <div className="dropdown-menu m-0">
                      <ul className="list-unstyled categories-bars">
                        <li>
                          <Link
                            to="/"
                            className="text-decoration-none text-reset d-block"
                          >
                            <div className="categories-bars-item">
                              <span>All Categories</span>
                            </div>
                          </Link>
                        </li>

                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              to={`/?category=${category.id}`}
                              className="text-decoration-none text-reset d-block"
                            >
                              <div className="categories-bars-item">
                                <span>{category.name}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;