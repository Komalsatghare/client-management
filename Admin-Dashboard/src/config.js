export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('render.com') || window.location.hostname.includes('dhanvij-builders.online')
    ? 'https://client-management-p4be.onrender.com' 
    : 'http://localhost:5000');

export const resolveUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
};
