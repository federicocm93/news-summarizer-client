// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://news-summarizer-api-gbih.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_URL}/api/auth/google`,
  GOOGLE_CALLBACK: `${API_URL}/api/auth/google/callback`,
  ME: `${API_URL}/api/auth/me`,
  
  // Summary endpoints
  GENERATE_SUMMARY: `${API_URL}/api/summary/generate`,
}; 