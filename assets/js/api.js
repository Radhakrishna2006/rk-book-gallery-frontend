import { API_BASE_URL } from './config.js';

let authToken = null;

async function request(endpoint, options = {}) {
  const { headers: requestHeaders = {}, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...requestHeaders,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Something went wrong');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export const api = {
  setAuthToken: (token) => {
    authToken = token;
  },
  getBooks: () => request('/books'),
  getBookById: (id) => request(`/books/${id}`),
  searchBooks: (keyword) => request(`/books/search?keyword=${encodeURIComponent(keyword)}`),
  getCategories: () => request('/categories'),
  registerUser: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  loginUser: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getCart: () => request('/cart'),
  addToCart: (payload) => request('/cart', { method: 'POST', body: JSON.stringify(payload) }),
  updateCartItem: (id, payload) => request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrders: () => request('/orders'),
  getAdminUsers: () => request('/admin/users'),
  getAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};
