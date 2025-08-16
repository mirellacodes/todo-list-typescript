// API configuration for different environments
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://todo-list-typescript-backend-pxntrbsmr-mirellacodes-projects.vercel.app' : 'http://localhost:5000');

// API endpoints
export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/tasks`,
  TASK: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  TOGGLE_TASK: (id: string) => `${API_BASE_URL}/tasks/${id}/toggle`,
};

// Session-aware API functions
export const createApiConfig = (sessionId: string) => ({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add session ID to URL
export const addSessionToUrl = (url: string, sessionId: string) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}session=${sessionId}`;
};
