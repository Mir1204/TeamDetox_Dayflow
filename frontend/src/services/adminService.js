import api from '../config/api';

export const adminService = {
  // Get dashboard stats
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get all employees
  async getAllEmployees(filters = {}) {
    const response = await api.get('/admin/employees', { params: filters });
    return response.data;
  },

  // Get employee by ID
  async getEmployeeById(employeeId) {
    const response = await api.get(`/admin/employees/${employeeId}`);
    return response.data;
  },

  // Create employee
  async createEmployee(employeeData) {
    const response = await api.post('/admin/employees', employeeData);
    return response.data;
  },

  // Update employee
  async updateEmployee(employeeId, updateData) {
    const response = await api.put(`/admin/employees/${employeeId}`, updateData);
    return response.data;
  },

  // Delete/Deactivate employee
  async deleteEmployee(employeeId) {
    const response = await api.delete(`/admin/employees/${employeeId}`);
    return response.data;
  },

  // Activate employee
  async activateEmployee(employeeId) {
    const response = await api.put(`/admin/employees/${employeeId}/activate`);
    return response.data;
  },

  // Deactivate employee
  async deactivateEmployee(employeeId) {
    const response = await api.put(`/admin/employees/${employeeId}/deactivate`);
    return response.data;
  },

  // Get attendance report
  async getAttendanceReport(params) {
    const response = await api.get('/admin/reports/attendance', { params });
    return response.data;
  },

  // Get leave report
  async getLeaveReport(params) {
    const response = await api.get('/admin/reports/leave', { params });
    return response.data;
  },

  // Get payroll report
  async getPayrollReport(params) {
    const response = await api.get('/admin/reports/payroll', { params });
    return response.data;
  },

  // Get analytics
  async getAnalytics(params) {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  }
};
export default adminService;