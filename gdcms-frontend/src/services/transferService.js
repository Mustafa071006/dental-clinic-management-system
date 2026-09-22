import api from './api';

const transferService = {
  getAll: async (params = {}) => {
    const response = await api.get('/transfers', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/transfers', data);
    return response.data;
  },
};

export default transferService;