import api from './api';

const examinationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/examinations', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/examinations/${id}`);
    return response.data;
  },

  getByPatient: async (patientId) => {
    const response = await api.get(
      `/examinations/patient/${patientId}`
    );
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/examinations', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/examinations/${id}`, data);
    return response.data;
  },
};

export default examinationService;