import api from '../config/api';

export const leaveService = {
  // Apply for leave
  async applyLeave(leaveData, attachments = []) {
    const formData = new FormData();
    
    // Add leave data
    Object.keys(leaveData).forEach(key => {
      formData.append(key, leaveData[key]);
    });
    
    // Add attachments
    attachments.forEach((file, index) => {
      formData.append('attachments', file);
    });
    
    const response = await api.post('/leave/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get own leaves
  async getOwnLeaves(filters = {}) {
    const response = await api.get('/leave/my-leaves', { params: filters });
    return response.data;
  },

  // Get own leave by ID
  async getOwnLeaveById(leaveId) {
    const response = await api.get(`/leave/my-leaves/${leaveId}`);
    return response.data;
  },

  // Update own leave
  async updateOwnLeave(leaveId, updateData) {
    const response = await api.put(`/leave/my-leaves/${leaveId}`, updateData);
    return response.data;
  },

  // Cancel own leave
  async cancelOwnLeave(leaveId) {
    const response = await api.delete(`/leave/my-leaves/${leaveId}`);
    return response.data;
  },

  // Get leave balance
  async getLeaveBalance(year) {
    const response = await api.get('/leave/balance', { params: { year } });
    return response.data;
  },

  // Get all leaves (Admin/HR)
  async getAllLeaves(filters = {}) {
    const response = await api.get('/leave/all', { params: filters });
    return response.data;
  },

  // Get pending leaves (Admin/HR)
  async getPendingLeaves() {
    const response = await api.get('/leave/pending');
    return response.data;
  },

  // Get employee leaves (Admin/HR)
  async getEmployeeLeaves(employeeId, filters = {}) {
    const response = await api.get(`/leave/employee/${employeeId}`, { params: filters });
    return response.data;
  },

  // Approve leave (Admin/HR)
  async approveLeave(leaveId, adminComments = '') {
    const response = await api.put(`/leave/${leaveId}/approve`, { adminComments });
    return response.data;
  },

  // Reject leave (Admin/HR)
  async rejectLeave(leaveId, adminComments = '') {
    const response = await api.put(`/leave/${leaveId}/reject`, { adminComments });
    return response.data;
  },

  // Get employee leave balance (Admin/HR)
  async getEmployeeLeaveBalance(employeeId, year) {
    const response = await api.get(`/leave/employee/${employeeId}/balance`, {
      params: { year }
    });
    return response.data;
  }
};
export default leaveService;