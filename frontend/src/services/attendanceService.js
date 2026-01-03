import api from '../config/api';

export const attendanceService = {
  // Check in
  async checkIn() {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  // Check out
  async checkOut() {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },

  // Get own attendance
  async getOwnAttendance(startDate, endDate) {
    const response = await api.get('/attendance/my-attendance', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Get own attendance summary
  async getOwnAttendanceSummary(year, month) {
    const response = await api.get('/attendance/my-attendance/summary', {
      params: { year, month }
    });
    return response.data;
  },

  // Get today's attendance
  async getTodayAttendance() {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  // Get all attendance (Admin/HR)
  async getAllAttendance(params) {
    const response = await api.get('/attendance/all', { params });
    return response.data;
  },

  // Get employee attendance (Admin/HR)
  async getEmployeeAttendance(employeeId, startDate, endDate) {
    const response = await api.get(`/attendance/employee/${employeeId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Mark attendance manually (Admin/HR)
  async markAttendance(attendanceData) {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
  },

  // Update attendance (Admin/HR)
  async updateAttendance(attendanceId, updateData) {
    const response = await api.put(`/attendance/${attendanceId}`, updateData);
    return response.data;
  },

  // Delete attendance (Admin)
  async deleteAttendance(attendanceId) {
    const response = await api.delete(`/attendance/${attendanceId}`);
    return response.data;
  }
};
export default attendanceService;