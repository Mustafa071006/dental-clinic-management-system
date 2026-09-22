import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post(
      '/auth/login',
      { email, password }
    );

    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(
      '/auth/forgot-password',
      { email }
    );

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;