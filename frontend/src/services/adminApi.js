import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

// Créer instance axios
const adminApi = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token automatiquement
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await adminApi.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_data', JSON.stringify(response.data.admin));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  },

  getProfile: () => {
    const adminData = localStorage.getItem('admin_data');
    return adminData ? JSON.parse(adminData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  }
};

export const adminService = {
  getDashboard: () => adminApi.get('/admin/dashboard'),
  addNewGifts: (data) => adminApi.post('/admin/gifts', data),
  updateGift: (id, data) => adminApi.put(`/admin/gifts/${id}`, data),
  deleteGift: (id) => adminApi.delete(`/admin/gifts/${id}`),
  getGiftParticipants: (giftId) => adminApi.get(`/admin/gifts/${giftId}/participants`),
  
  triggerManualDraw: () => adminApi.post('/admin/draws/manual')
};

export default adminApi;