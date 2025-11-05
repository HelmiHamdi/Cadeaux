import adminApi from './adminApi';

export const codeService = {
 
  getGiftCodes: (giftId) => adminApi.get(`/codes/gift/${giftId}`),
  
 
  searchByCode: (code) => adminApi.get(`/codes/search/${code}`),
  
 
  searchByCodes: (codes) => adminApi.post('/codes/search-multiple', { codes })
};