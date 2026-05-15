import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="container-fluid footer py-4 wow fadeIn" data-wow-delay="0.2s">
      <div className="container py-4">
        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <Link to="/" className="navbar-brand mb-3 d-inline-block">
              <h1 className="fw-bold text-primary m-0">
                VISION<span className="text-secondary">.MART</span>
              </h1>
            </Link>

            <p className="text-white-50 mb-0">
              Smart e-commerce platform that combines AI-powered product
              categorization, image-based search, and easier product management
              for sellers and customers.
            </p>
          </div>

          <div className="col-lg-4">
            <h4 className="text-light mb-3">Quick Links</h4>
            <div className="d-flex flex-column footer-links">
              <Link to="/">Home</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/profile/edit">Edit Profile</Link>
            </div>
          </div>

          <div className="col-lg-4">
            <h4 className="text-light mb-3">Project Scope</h4>
            <p className="text-white-50 mb-2">
              Supports text and visual product search, cart, wishlist, orders,
              and role-based workflows for customers, sellers, and admin.
            </p>
            <p className="text-white-50 mb-0">
              Built with React, Laravel, FastAPI, TensorFlow, and MySQL to
              deliver a smarter online shopping experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;