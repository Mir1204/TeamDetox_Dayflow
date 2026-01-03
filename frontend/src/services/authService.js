import api from '../config/api';

export const authService = {
  // Sign Up
  async signUp(userData) {
    const response = await api.post('/auth/signup', {
      employeeId: userData.email.split('@')[0], // Generate from email
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Employee',
      firstName: userData.name.split(' ')[0],
      lastName: userData.name.split(' ')[1] || ''
    });
    return response.data;
  },

  // Sign In
  async signIn(email, password) {
    const response = await api.post('/auth/signin', {
      email,
      password
    });
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  async logout() {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    return response.data;
  },

  // Verify Email
  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Forgot Password
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  async resetPassword(token, password) {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
      confirmPassword: password
    });
    return response.data;
  }
};
export default authService;