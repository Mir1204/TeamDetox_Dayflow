import api from '../config/api';

export const employeeService = {
  // Get own profile
  async getOwnProfile() {
    const response = await api.get('/employee/profile');
    return response.data;
  },

  // Update own profile
  async updateOwnProfile(data) {
    const response = await api.put('/employee/profile', data);
    return response.data;
  },

  // Upload profile picture
  async updateProfilePicture(file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.put('/employee/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Upload document
  async uploadDocument(file, documentName) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('name', documentName);
    
    const response = await api.post('/employee/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete document
  async deleteDocument(documentId) {
    const response = await api.delete(`/employee/documents/${documentId}`);
    return response.data;
  },

  // Get dashboard data
  async getDashboard() {
    const response = await api.get('/employee/dashboard');
    return response.data;
  }
};
export default employeeService;