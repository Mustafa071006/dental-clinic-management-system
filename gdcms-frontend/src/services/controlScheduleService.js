import api from './api';

const controlScheduleService = {
  getAll: async (params = {}) => {
    const response = await api.get('/control-schedules', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/control-schedules/${id}`);
    return response.data;
  },

  getByPatient: async (patientId) => {
  const response = await api.get(
    `/control-schedules/patient/${patientId}`
  );

  return response.data;
},

  create: async (data) => {
    const response = await api.post('/control-schedules', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/control-schedules/${id}`, data);
    return response.data;
  },
};

export default controlScheduleService;