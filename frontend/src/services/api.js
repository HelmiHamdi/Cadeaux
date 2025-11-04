import axios from 'axios';

// URL de base - vérifie bien qu'il n'y a pas de /api en double
const API_BASE_URL = 'https://cadeaurama.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // Réduit le timeout à 8 secondes
});

export const giftService = {
  getAllGifts: () => api.get('/api/gifts'), // Note le /api ici
  
  participate: async (giftId, data) => {
    try {
      const response = await api.post(`/api/gifts/${giftId}/participate`, data, {
        timeout: 10000 // 10 secondes max pour la participation
      });
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
