import api from '../config/api';

export const payrollService = {
  // Get own salary
  async getOwnSalary() {
    const response = await api.get('/payroll/my-salary');
    return response.data;
  },

  // Get own salary history
  async getOwnSalaryHistory() {
    const response = await api.get('/payroll/my-salary/history');
    return response.data;
  },

  // Generate own salary slip
  async generateOwnSalarySlip(month, year) {
    const response = await api.get('/payroll/my-salary/slip', {
      params: { month, year }
    });
    return response.data;
  },

  // Get all payroll (Admin/HR)
  async getAllPayroll(filters = {}) {
    const response = await api.get('/payroll/all', { params: filters });
    return response.data;
  },

  // Get payroll summary (Admin/HR)
  async getPayrollSummary() {
    const response = await api.get('/payroll/summary');
    return response.data;
  },

  // Get employee payroll (Admin/HR)
  async getEmployeePayroll(employeeId) {
    const response = await api.get(`/payroll/employee/${employeeId}`);
    return response.data;
  },

  // Get employee salary history (Admin/HR)
  async getEmployeeSalaryHistory(employeeId) {
    const response = await api.get(`/payroll/employee/${employeeId}/history`);
    return response.data;
  },

  // Create payroll (Admin/HR)
  async createPayroll(employeeId, salaryData) {
    const response = await api.post('/payroll/create', {
      employeeId,
      ...salaryData
    });
    return response.data;
  },

  // Update payroll (Admin/HR)
  async updatePayroll(employeeId, updateData) {
    const response = await api.put(`/payroll/employee/${employeeId}`, updateData);
    return response.data;
  },

  // Delete payroll (Admin)
  async deletePayroll(employeeId) {
    const response = await api.delete(`/payroll/employee/${employeeId}`);
    return response.data;
  }
};

export default {
  payroll: payrollService
};