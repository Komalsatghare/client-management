export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('netlify.app') 
    ? 'https://client-management-p4be.onrender.com' 
    : 'http://localhost:5000');
