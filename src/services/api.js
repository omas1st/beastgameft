import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const validateGameId = (gameId) => API.post('/validate-gameid', { gameId });
export const fetchGifts = () => API.get('/gifts');
export const saveSpinResult = (gameId, giftId) => API.post('/save-spin', { gameId, giftId });
export const saveUserDetails = (gameId, details) => API.post('/save-details', { gameId, ...details });
export const generateDeliveryId = (gameId) => API.post('/generate-delivery', { gameId });
export const getUserData = (gameId) => API.get(`/user-data?gameId=${gameId}`);

// Admin
export const fetchGameIds = () => API.get('/admin/gameids');
export const createGameId = (id) => API.post('/admin/gameids', { id });
export const updateGameIdData = (id, data) => API.put(`/admin/gameids/${id}`, data);
export const deleteGameId = (id) => API.delete(`/admin/gameids/${id}`);
export const fetchAdminGifts = () => API.get('/admin/gifts');
export const addGift = (formData) => API.post('/admin/gifts', formData); // multipart
export const updateGift = (id, formData) => API.put(`/admin/gifts/${id}`, formData);
export const deleteGift = (id) => API.delete(`/admin/gifts/${id}`);

export const fetchSettings = () => API.get('/settings');
export const updateSettings = (data) => API.put('/admin/settings', data);