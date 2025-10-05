const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    return handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Failed to fetch: Cannot connect to ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
};

export const apiService = {
  // Authentication
  async register(userData) {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async login(credentials) {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getCurrentUser() {
    return makeRequest('/auth/me');
  },

  async verifyToken() {
    return makeRequest('/auth/verify');
  },

  // Tasks
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = `/tasks${queryString ? `?${queryString}` : ''}`;

    return makeRequest(url);
  },

  async getTask(id) {
    return makeRequest(`/tasks/${id}`);
  },

  async createTask(taskData) {
    return makeRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  async updateTask(id, taskData) {
    return makeRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  async deleteTask(id) {
    return makeRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async toggleTask(id) {
    return makeRequest(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Notifications (Web Push)
  async getVapidPublicKey() {
    return makeRequest('/notifications/vapid-public-key');
  },

  async subscribePush(subscription) {
    return makeRequest('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  },

  async unsubscribePush(endpoint) {
    return makeRequest('/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ endpoint }),
    });
  },

  async sendTestPush() {
    return makeRequest('/notifications/test', {
      method: 'POST',
    });
  },

  // Utility methods
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};