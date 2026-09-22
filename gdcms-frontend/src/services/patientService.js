import api from './api';

const patientService = {
  getAll: async (params = {}) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/patients/${id}/status`, { status });
    return response.data;
  },
};

export default patientService;