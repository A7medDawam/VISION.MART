import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  apiRequest,
  fetchProducts,
  fetchWishlist,
} from '../api';
import { useAuth } from '../context/AuthContext';
import HomeBanner from './HomeBanner';
import ProductCard from './common/ProductCard';

function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productsRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [aiMode, setAiMode] = useState(false);
  const [aiPreview, setAiPreview] = useState('');
  const [aiMeta, setAiMeta] = useState({});

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const page = searchParams.get('page') || '1';

  const predictedCategory = aiMeta?.predictedCategory || '';
  const confidence = aiMeta?.confidence;

  const scrollToProducts = () => {
    const element = productsRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY - 110;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  };

  const clearAiSearch = async () => {
    setAiMode(false);
    setAiPreview('');
    setAiMeta({});
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await fetchProducts({
        q,
        category,
        page,
      });

      const payload = data?.data || {};
      setProducts(payload.data || []);
      setMeta(payload);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToProducts();
      }, 120);
    }
  };

  const formatConfidence = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return value;
    return `${numeric.toFixed(2)}%`;
  };

  useEffect(() => {
    const handleProductsScrollRequest = () => {
      const runScroll = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToProducts();
          }, 120);
        });
      };

      runScroll();
      setTimeout(runScroll, 400);
      setTimeout(runScroll, 900);
    };

    const handleAiSearchStarted = (e) => {
      const preview = e.detail?.preview || '';

      setAiMode(true);
      setAiPreview(preview);
      setAiMeta({});
      setProducts([]);
      setMeta(null);
      setError('');
      setMessage('');
      setLoading(true);

      const runScroll = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToProducts();
          }, 120);
        });
      };

      runScroll();
      setTimeout(runScroll, 400);
    };

    const handleAiResultsReady = (e) => {
      const results = e.detail?.results || [];
      const preview = e.detail?.preview || '';
      const meta = e.detail?.meta || {};

      setAiMode(true);
      setAiPreview(preview);
      setAiMeta(meta);
      setProducts(results);
      setMeta(null);
      setError(results.length ? '' : 'No similar products found.');
      setMessage('');
      setLoading(false);

      const runScroll = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToProducts();
          }, 120);
        });
      };

      runScroll();
      setTimeout(runScroll, 400);
      setTimeout(runScroll, 900);
    };

    const handleAiResultsFailed = (e) => {
      const preview = e.detail?.preview || '';
      const message = e.detail?.message || 'AI search failed.';

      setAiMode(true);
      setAiPreview(preview);
      setAiMeta({});
      setProducts([]);
      setMeta(null);
      setError(message);
      setMessage('');
      setLoading(false);

      const runScroll = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToProducts();
          }, 120);
        });
      };

      runScroll();
      setTimeout(runScroll, 400);
    };

    window.addEventListener('productsScrollRequested', handleProductsScrollRequest);
    window.addEventListener('aiSearchStarted', handleAiSearchStarted);
    window.addEventListener('aiResultsReady', handleAiResultsReady);
    window.addEventListener('aiResultsFailed', handleAiResultsFailed);

    return () => {
      window.removeEventListener('productsScrollRequested', handleProductsScrollRequest);
      window.removeEventListener('aiSearchStarted', handleAiSearchStarted);
      window.removeEventListener('aiResultsReady', handleAiResultsReady);
      window.removeEventListener('aiResultsFailed', handleAiResultsFailed);
    };
  }, []);

  useEffect(() => {
    if (aiMode) return;

    const loadProducts = async () => {
      setLoading(true);
      setError('');
      setMessage('');

      try {
        const data = await fetchProducts({
          q,
          category,
          page,
        });

        const payload = data?.data || {};
        setProducts(payload.data || []);
        setMeta(payload);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [q, category, page, aiMode]);

  const loadWishlist = async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setWishlistItems([]);
      return;
    }

    try {
      const data = await fetchWishlist();
      setWishlistItems(data?.data?.items || []);
    } catch {
      setWishlistItems([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated, user]);

  const categoryName = useMemo(() => {
    const found = products.find(
      (item) => String(item.category?.id) === String(category)
    );
    return found?.category?.name || '';
  }, [products, category]);

  const isProductWishlisted = (productId) => {
    return wishlistItems.some(
      (item) => String(item.product?.id) === String(productId)
    );
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/cart/${productId}`, {
        method: 'POST',
      });

      setMessage(response.message || 'Product added to cart successfully');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated || user?.role !== 'customer') {
      navigate('/login');
      return;
    }

    const existingItem = wishlistItems.find(
      (item) => String(item.product?.id) === String(product.id)
    );

    try {
      if (existingItem) {
        await apiRequest(`/wishlist/item/${existingItem.id}`, {
          method: 'DELETE',
        });
        setMessage('Removed from wishlist successfully');
      } else {
        await apiRequest(`/wishlist/${product.id}`, {
          method: 'POST',
        });
        setMessage('Wishlist updated successfully');
      }

      await loadWishlist();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setMessage(err.message || 'Action failed');
    }
  };

  const normalizeAiProduct = (item, index) => {
    const fallbackCategoryName =
      item?.category?.name ||
      item?.category_name ||
      item?.predicted_category ||
      predictedCategory ||
      '';

    return {
      ...item,
      id: item?.id || item?.product_id || `ai-${index}`,
      name: item?.name || item?.product_name || item?.title || 'Product',
      image:
        item?.image ||
        item?.image_url ||
        item?.product_image ||
        item?.thumbnail ||
        '',
      category: item?.category || {
        id: item?.category_id || null,
        name: fallbackCategoryName,
      },
      ai_similarity:
        item?.similarity ?? item?.score ?? item?.distance_score ?? null,
    };
  };

  return (
    <>
      <HomeBanner />

      <div
        id="products-section"
        className="container-fluid product py-5"
        ref={productsRef}
      >
        <div className="container py-5">
          <div className="tab-class">
            <div className="row g-4 align-items-start">
              <div className="col-lg-8 text-start">
                <h1>{aiMode ? 'AI Search Results' : 'Our Products'}</h1>

                {aiMode && predictedCategory ? (
                  <p className="text-muted mb-0 fs-4">
                    Predicted category: <strong>{predictedCategory}</strong>
                    {confidence !== null &&
                    confidence !== undefined &&
                    confidence !== ''
                      ? ` (${formatConfidence(confidence)} confidence)`
                      : ''}
                  </p>
                ) : aiMode ? (
                  <p className="text-muted mb-0">AI image search results</p>
                ) : null}
              </div>

              <div className="col-lg-4 text-lg-end text-start">
                {aiMode ? (
                  <button
                    type="button"
                    onClick={clearAiSearch}
                    className="btn rounded-pill px-4 py-2 fw-semibold clear-ai-btn"
                  >
                    Clear AI Search
                  </button>
                ) : (
                  <ul className="nav nav-pills d-inline-flex text-center mb-0">
                    <li className="nav-item mb-4">
                      <span className="d-flex mx-2 py-2 bg-light rounded-pill active">
                        <span className="text-dark px-4">
                          {category ? categoryName || 'Category' : 'All Products'}
                        </span>
                      </span>
                    </li>

                    {q ? (
                      <li className="nav-item mb-4">
                        <span className="d-flex py-2 mx-2 bg-light rounded-pill">
                          <span className="text-dark px-4">Search: {q}</span>
                        </span>
                      </li>
                    ) : null}

                    <li className="nav-item mb-4">
                      <span className="d-flex mx-2 py-2 bg-light rounded-pill">
                        <span className="text-dark px-4">
                          Total: {meta?.total || products.length || 0}
                        </span>
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {message ? (
              <div className="alert alert-success mb-4 mt-4">{message}</div>
            ) : null}

            {loading ? (
              <div className="text-center py-5">
                {aiMode && aiPreview ? (
                  <div
                    className="mx-auto mb-4 p-2 bg-white border rounded-4 shadow-sm"
                    style={{ width: '220px' }}
                  >
                    <img
                      src={aiPreview}
                      alt="AI search preview"
                      className="img-fluid rounded-4"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : null}

                <h4 className="fw-semibold">
                  {aiMode
                    ? '⏳ AI is analyzing your image and finding similar products...'
                    : 'Loading products...'}
                </h4>
              </div>
            ) : aiMode && error ? (
              <div className="text-center py-5">
                {aiPreview ? (
                  <div
                    className="mx-auto mb-4 p-2 bg-white border rounded-4 shadow-sm"
                    style={{ width: '220px' }}
                  >
                    <img
                      src={aiPreview}
                      alt="AI search preview"
                      className="img-fluid rounded-4"
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : null}

                <h4 className="fw-semibold">
                  <span className="me-2 text-danger">❌</span>
                  {error}
                </h4>
              </div>
            ) : error ? (
              <div className="alert alert-danger mb-4 mt-4">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h5>{aiMode ? 'No similar products found.' : 'No products found.'}</h5>
              </div>
            ) : (
              <div className="tab-content mt-4">
                {aiMode && aiPreview ? (
                  <div className="text-center mb-5">
                    <div
                      className="d-inline-block p-2 bg-white border rounded-4 shadow-sm"
                      style={{ width: '220px' }}
                    >
                      <img
                        src={aiPreview}
                        alt="AI search preview"
                        className="img-fluid rounded-4"
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="tab-pane fade show p-0 active">
                  <div className="row g-4">
                    {aiMode
                      ? products.map((item, index) => {
                          const normalizedProduct = normalizeAiProduct(item, index);

                          return (
                            <ProductCard
                              key={normalizedProduct.id}
                              product={normalizedProduct}
                              onAddToCart={handleAddToCart}
                              onToggleWishlist={handleToggleWishlist}
                              isWishlisted={isProductWishlisted(normalizedProduct.id)}
                            />
                          );
                        })
                      : products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={isProductWishlisted(product.id)}
                          />
                        ))}
                  </div>

                  {!aiMode && meta?.links ? (
                    <div className="d-flex justify-content-center mt-5 flex-wrap gap-2">
                      {meta.links.map((link, index) => {
                        const label = link.label
                          .replace('&laquo; Previous', 'Previous')
                          .replace('Next &raquo;', 'Next');

                        if (!link.url) {
                          return (
                            <span
                              key={index}
                              className="btn btn-light border rounded-pill px-4 py-2 disabled"
                            >
                              <span dangerouslySetInnerHTML={{ __html: label }} />
                            </span>
                          );
                        }

                        const url = new URL(link.url);
                        const nextPage = url.searchParams.get('page') || '1';
                        const params = new URLSearchParams();

                        if (q) params.set('q', q);
                        if (category) params.set('category', category);
                        params.set('page', nextPage);

                        return (
                          <Link
                            key={index}
                            to={`/?${params.toString()}`}
                            className={`btn rounded-pill px-4 py-2 ${
                              link.active ? 'btn-primary text-white' : 'btn-light border'
                            }`}
                          >
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;