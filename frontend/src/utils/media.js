import { API_URL } from '../api';
export const imageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop';
  if (String(path).startsWith('http')) return path;
  return `${API_URL}${path}`;
};
