const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...rest } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add token if exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }

  return data;
}

export const authApi = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  }),
  verifyOtp: (email, token) => apiRequest('/auth/verify', {
    method: 'POST',
    body: { email, token },
  }),
  getMe: () => apiRequest('/auth/me'),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  }),
  resetPassword: (email, token, newPassword) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: { email, token, newPassword },
  }),
};
