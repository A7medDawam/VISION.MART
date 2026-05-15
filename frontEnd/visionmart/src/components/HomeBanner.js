import { Link } from 'react-router-dom';

function HomeBanner() {
  return (
    <div className="container-fluid carousel bg-light px-0">
      <div className="row g-0 justify-content-end">
        <div className="col-12 col-lg-7 col-xl-9">
          <div id="visionMartBanner" className="carousel slide bg-light py-5" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row g-0 header-carousel-item align-items-center">
                  <div className="col-xl-6 carousel-img">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/carousel-1.png`} className="img-fluid w-100" alt="AI commerce" />
                  </div>
                  <div className="col-xl-6 carousel-content p-4">
                    <h4 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '3px' }}>
                      AI-Powered E-Commerce
                    </h4>
                    <h1 className="display-3 text-capitalize mb-4">
                      Smarter shopping with image-based product search
                    </h1>
                    <p className="text-dark mb-4">
                      Discover products faster using search, categories, wishlist, cart, and visual AI assistance.
                    </p>
                    <Link className="btn btn-primary rounded-pill py-3 px-5" to="/">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="row g-0 header-carousel-item align-items-center">
                  <div className="col-xl-6 carousel-img">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/carousel-2.png`} className="img-fluid w-100" alt="Smart products" />
                  </div>
                  <div className="col-xl-6 carousel-content p-4">
                    <h4 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '3px' }}>
                      Built for Customers
                    </h4>
                    <h1 className="display-3 text-capitalize mb-4">
                      Browse products, save favorites, and place orders easily
                    </h1>
                    <p className="text-dark mb-4">
                      VISION.MART combines modern shopping flow with a clean marketplace experience.
                    </p>
                    <Link className="btn btn-primary rounded-pill py-3 px-5" to="/wishlist">
                      View Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#visionMartBanner" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#visionMartBanner" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-5 col-xl-3">
          <div className="carousel-header-banner h-100">
            <img
              src={`${process.env.PUBLIC_URL}/assets/img/header-img.jpg`}
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
              alt="Special offer"
            />
            <div className="carousel-banner-offer">
              <p className="bg-primary text-white rounded fs-5 py-2 px-4 mb-0 me-3">Smart</p>
              <p className="text-primary fs-5 fw-bold mb-0">Vision Search</p>
            </div>
            <div className="carousel-banner">
              <div className="carousel-banner-content text-center p-4">
                <span className="d-block mb-2">VISION.MART</span>
                <span className="d-block text-white fs-3">Search by image, wishlist, cart and orders</span>
              </div>
              <Link to="/orders" className="btn btn-primary rounded-pill py-2 px-4">
                <i className="fas fa-shopping-cart me-2"></i>
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
