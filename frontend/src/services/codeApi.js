import adminApi from './adminApi';

export const codeService = {
  // Récupérer tous les codes d'un cadeau
  getGiftCodes: (giftId) => adminApi.get(`/codes/gift/${giftId}`),
  
  // Rechercher un participant par code
  searchByCode: (code) => adminApi.get(`/codes/search/${code}`),
  
  // Rechercher plusieurs participants par codes
  searchByCodes: (codes) => adminApi.post('/codes/search-multiple', { codes })
};