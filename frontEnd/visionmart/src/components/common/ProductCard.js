import { Link } from 'react-router-dom';
import { buildImageUrl } from '../../api';

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  delay = '0.1s',
}) {
  return (
    <div
      className="col-md-6 col-lg-4 col-xl-3 wow fadeInUp"
      data-wow-delay={delay}
    >
      <div className="product-item rounded">
        <div className="product-item-inner border rounded">
          <div
            className="product-item-inner-item"
            style={{
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              overflow: 'hidden',
            }}
          >
            <img
              src={buildImageUrl(product.image)}
              className="img-fluid w-100 rounded-top"
              alt={product.name}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'contain',
                background: '#fff',
              }}
            />

            <div className="product-details">
              <Link to={`/Single/${product.category?.id || 'all'}/${product.id}`}>
                <i className="fa fa-eye fa-1x"></i>
              </Link>
            </div>
          </div>

          <div className="text-center rounded-bottom p-4">
            <span className="d-block mb-2">
              {product.category?.name || 'No category'}
            </span>

            <Link
              to={`/Single/${product.category?.id || 'all'}/${product.id}`}
              className="d-block h4"
            >
              {product.name}
            </Link>

            <span className="text-primary fs-5">${product.price}</span>

            {product?.ai_similarity !== null && product?.ai_similarity !== undefined ? (
              <p className="text-muted mb-2 text-center">
               Similarity: {Number(product.ai_similarity) <= 1? `${(Number(product.ai_similarity) * 100).toFixed(1)}%` : `${Number(product.ai_similarity).toFixed(1)}%`}
              </p>
) : null}
          </div>
        </div>

        <div className="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
          <button
            type="button"
            onClick={() => onAddToCart?.(product.id)}
            className="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4"
          >
            <i className="fas fa-shopping-cart me-2"></i>
            Add To Cart
          </button>

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star text-primary"></i>
              <i className="fas fa-star"></i>
            </div>

            <div className="d-flex">
              <Link
                to={`/Single/${product.category?.id || 'all'}/${product.id}`}
                className="text-primary d-flex align-items-center justify-content-center me-3"
              >
                <span className="rounded-circle btn-sm-square border">
                  <i className="fas fa-eye"></i>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => onToggleWishlist?.(product)}
                className="text-primary d-flex align-items-center justify-content-center me-0 border-0 bg-transparent p-0"
              >
                <span className="rounded-circle btn-sm-square border d-flex align-items-center justify-content-center">
                  <i
                    className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}
                    style={{ color: '#ffb524' }}
                  ></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;