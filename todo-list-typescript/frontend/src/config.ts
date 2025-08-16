// API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://your-backend-url.vercel.app' : 'http://localhost:5000');

// API endpoints
export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/tasks`,
  TASK: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  TOGGLE_TASK: (id: string) => `${API_BASE_URL}/tasks/${id}/toggle`,
};
