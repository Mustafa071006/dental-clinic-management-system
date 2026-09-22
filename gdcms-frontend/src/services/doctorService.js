import api from './api';

const doctorService = {
  // GET /api/users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // POST /api/users
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // PUT /api/users/:id
  updateDoctor: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // PUT /api/users/:id/reset-password
  resetPassword: async (id, data) => {
    const response = await api.put(
      `/users/${id}/reset-password`,
      data
    );
    return response.data;
  },

  // PATCH /api/users/:id/status
  toggleStatus: async (id) => {
    const response = await api.patch(
      `/users/${id}/status`
    );
    return response.data;
  },

  // DELETE /api/users/:id
  deleteDoctor: async (id) => {
    const response = await api.delete(
      `/users/${id}`
    );
    return response.data;
  },
};

export default doctorService;