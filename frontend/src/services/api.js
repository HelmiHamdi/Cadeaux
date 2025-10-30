import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL:import.meta.env.NODE==="developement"? API_BASE_URL : '/api',
  headers: {
    'Content-Type': 'application/json', 
  },
});

export const giftService = {
  getAllGifts: () => api.get('/gifts'),
  participate: async (giftId, data) => {
    try {
      const response = await api.post(`/gifts/${giftId}/participate`, data);
      return response; 
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error("Vous avez déjà participé à ce cadeau !");
      }
      throw new Error("Erreur lors de la participation. Veuillez réessayer.");
    }
  },
};
export const drawService = {
  getWeeklyWinners: () => api.get('/draws/winners'),
};



export default api;
