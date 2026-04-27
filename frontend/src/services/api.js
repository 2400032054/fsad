const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('vridhi_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Registration failed');
  }
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('vridhi_token', data.token);
    if (data.role) localStorage.setItem('vridhi_role', data.role);
  }
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Login failed');
  }
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('vridhi_token', data.token);
    if (data.role) localStorage.setItem('vridhi_role', data.role);
  }
  return data;
};

export const verifyMFA = async (code) => {
  const response = await fetch(`${BASE_URL}/auth/verify-mfa`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ code })
  });
  if (!response.ok) throw new Error('MFA verification failed');
  return response.json();
};

export const submitIntakeForm = async (formData) => {
  const response = await fetch(`${BASE_URL}/intake`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Intake submission failed');
  }
  return response.json();
};

export const getRecommendations = async () => {
  const response = await fetch(`${BASE_URL}/recommendations`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load recommendations');
  return response.json();
};

export const getAdminRequirements = async () => {
  const response = await fetch(`${BASE_URL}/admin/requirements`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to load user requirements');
  }
  return response.json();
};
