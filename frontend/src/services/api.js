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
  if (!response.ok) throw new Error('Registration failed');
  const data = await response.json();
  if (data.token) localStorage.setItem('vridhi_token', data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  if (data.token) localStorage.setItem('vridhi_token', data.token);
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
  if (!response.ok) throw new Error('Intake submission failed');
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
