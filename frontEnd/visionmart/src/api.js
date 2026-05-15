const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const AI_BASE_URL =
  process.env.REACT_APP_AI_BASE_URL || 'http://127.0.0.1:8001';

const STORAGE_BASE_URL =
  process.env.REACT_APP_STORAGE_BASE_URL ||
  API_BASE_URL.replace(/\/api\/?$/, '');

export function getToken() {
  return localStorage.getItem('token') || '';
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function setStoredUser(user) {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function buildImageUrl(path) {
  if (!path) {
    return `${process.env.PUBLIC_URL}/images/content/postList.jpg`;
  }

  const str = String(path);

  if (/^https?:\/\//i.test(str) || /^data:image\//i.test(str) || /^blob:/i.test(str)) {
    return str;
  }

  const cleaned = str.replace(/^\/+/, '');

  if (cleaned.startsWith('storage/')) {
    return `${STORAGE_BASE_URL}/${cleaned}`;
  }

  return `${STORAGE_BASE_URL}/storage/${cleaned}`;
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? data.message ||
          Object.values(data.errors || {})
            .flat()
            .join('\n') ||
          'Request failed'
        : 'Request failed';

    throw new Error(message);
  }

  return data;
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body = options.body;

  if (body && !isFormData && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  return handleResponse(response);
}

export async function aiRequest(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const headers = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  let body = options.body;

  if (body && !isFormData && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const fetchWithTimeout = async (resource, opts = {}, timeout = 7000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const resp = await fetch(resource, { ...opts, signal: controller.signal });
      return resp;
    } finally {
      clearTimeout(id);
    }
  };

  try {
    const response = await fetchWithTimeout(`${AI_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      body,
    });

    return await handleResponse(response);
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error('AI request timed out');
    }
    throw err;
  }
}

export function fetchProducts(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      search.set(key, value);
    }
  });

  const query = search.toString();
  return apiRequest(`/products${query ? `?${query}` : ''}`);
}

export function fetchCategories() {
  return apiRequest('/categories');
}

export function fetchCart() {
  return apiRequest('/cart');
}

export function fetchWishlist() {
  return apiRequest('/wishlist');
}

export function placeOrder() {
  return apiRequest('/orders', {
    method: 'POST',
  });
}

export function fetchOrders() {
  return apiRequest('/orders');
}

export async function searchByImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/ai/search', {
    method: 'POST',
    body: formData,
  });
}

export async function predictCategory(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    return await aiRequest('/predict-category', {
      method: 'POST',
      body: formData,
    }, 7000);
  } catch (err) {
    return {
      predicted_category: null,
      category_id: null,
      confidence: 0,
      top_predictions: [],
      error: err?.message || 'AI service unavailable',
      _ai_unavailable: true,
    };
  }
}

export { API_BASE_URL, AI_BASE_URL, STORAGE_BASE_URL };