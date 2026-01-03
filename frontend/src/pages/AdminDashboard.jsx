import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { payrollService } from '../services/payrollService';
import '../styles/EmployeeDashboard.css';
import companyLogo from '../assets/company-logo.jpeg';

const AdminDashboard = ({ onLogout, onNavigateToProfile, initialModule = 'dashboard', user }) => {
  const [activeTab, setActiveTab] = useState(initialModule);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollData, setPayrollData] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load data based on active tab
  useEffect(() => {
    switch(activeTab) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'employees':
        loadEmployees();
        break;
      case 'attendance':
        loadAttendance();
        break;
      case 'leave':
        loadLeaveRequests();
        break;
      case 'payroll':
        loadPayroll();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const stats = await adminService.getDashboard();
      setDashboardStats(stats.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllEmployees();
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const date = selectedDate.toISOString().split('T')[0];
      const response = await attendanceService.getAllAttendance({
        startDate: date,
        endDate: date
      });
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error loading attendance:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await leaveService.getAllLeaves();
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error loading leave requests:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPayroll = async () => {
    try {
      setIsLoading(true);
      const response = await payrollService.getAllPayroll();
      setPayrollData(response.data);
    } catch (error) {
      console.error('Error loading payroll:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveService.approveLeave(leaveId, 'Approved by admin');
      alert('Leave approved successfully!');
      loadLeaveRequests();
    } catch (error) {
      alert('Error approving leave: ' + error.message);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await leaveService.rejectLeave(leaveId, 'Rejected by admin');
      alert('Leave rejected successfully!');
      loadLeaveRequests();
    } catch (error) {
      alert('Error rejecting leave: ' + error.message);
    }
  };

  const handleCheckToggle = async () => {
    try {
      if (isCheckedIn) {
        await attendanceService.checkOut();
        setIsCheckedIn(false);
        alert('Checked Out successfully!');
      } else {
        await attendanceService.checkIn();
        setIsCheckedIn(true);
        alert('Checked In successfully!');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.personalDetails?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.personalDetails?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobDetails?.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="company-logo">
            <img src={companyLogo} alt="Company Logo" className="logo-image" />
          </div>
          <nav className="main-navigation">
            <button 
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
            <button 
              className={`nav-tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </button>
            <button 
              className={`nav-tab ${activeTab === 'leave' ? 'active' : ''}`}
              onClick={() => setActiveTab('leave')}
            >
              Leave
            </button>
            <button 
              className={`nav-tab ${activeTab === 'payroll' ? 'active' : ''}`}
              onClick={() => setActiveTab('payroll')}
            >
              Payroll
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          <button 
            className={`check-in-circle ${isCheckedIn ? 'checked-in' : 'checked-out'}`}
            onClick={handleCheckToggle}
            title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
          />
          <div className="user-status">
            <div className="user-avatar">👤</div>
          </div>
          <div className="user-menu">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {user?.name || 'Admin'} (Admin)
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={onNavigateToProfile}>View Profile</button>
                <button onClick={onLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {error && (
          <div style={{ color: '#ff6b6b', padding: '1rem', background: '#2a2a2a', borderRadius: '8px', marginBottom: '1rem' }}>
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboardStats && (
              <div className="admin-dashboard-section">
                <h2 style={{ color: '#fff', marginBottom: '2rem' }}>Admin Dashboard</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #404040' }}>
                    <h3 style={{ color: '#007bff', margin: '0 0 1rem 0' }}>Total Employees</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardStats.overview?.totalEmployees || 0}</p>
                  </div>
                  <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #404040' }}>
                    <h3 style={{ color: '#28a745', margin: '0 0 1rem 0' }}>Active Employees</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardStats.overview?.activeEmployees || 0}</p>
                  </div>
                  <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #404040' }}>
                    <h3 style={{ color: '#ffc107', margin: '0 0 1rem 0' }}>Pending Leaves</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardStats.overview?.pendingLeaves || 0}</p>
                  </div>
                  <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #404040' }}>
                    <h3 style={{ color: '#17a2b8', margin: '0 0 1rem 0' }}>Today Attendance</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{dashboardStats.overview?.todayAttendance || 0}</p>
                  </div>
                </div>

                <div style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #404040' }}>
                  <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Recent Leave Requests</h3>
                  {dashboardStats.recentLeaves?.length > 0 ? (
                    <div>
                      {dashboardStats.recentLeaves.map(leave => (
                        <div key={leave._id} style={{ padding: '0.75rem', borderBottom: '1px solid #404040' }}>
                          <span style={{ color: '#fff' }}>{leave.employeeId?.personalDetails?.firstName} {leave.employeeId?.personalDetails?.lastName}</span>
                          <span style={{ color: '#ccc', marginLeft: '1rem' }}>{leave.leaveType}</span>
                          <span style={{ 
                            color: leave.status === 'Pending' ? '#ffc107' : leave.status === 'Approved' ? '#28a745' : '#dc3545',
                            marginLeft: '1rem'
                          }}>
                            {leave.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#999' }}>No recent leave requests</p>
                  )}
                </div>
              </div>
            )}

            {/* Employees Tab */}
            {activeTab === 'employees' && (
              <div className="employees-section">
                <div className="section-header">
                  <h2 style={{ color: '#fff' }}>Employee Management</h2>
                </div>
                <div className="controls-section">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="employee-grid">
                  {filteredEmployees.map(employee => (
                    <div key={employee._id} className="employee-card">
                      <div className={`status-indicator ${employee.isActive ? 'green' : 'red'}`} />
                      <div className="employee-avatar">👤</div>
                      <div className="employee-name">
                        {employee.personalDetails?.firstName} {employee.personalDetails?.lastName}
                      </div>
                      <div style={{ color: '#999', fontSize: '0.9rem' }}>
                        {employee.jobDetails?.department}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="attendance-section">
                <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Attendance Management</h2>
                <div className="attendance-table-container">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Work Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map(record => (
                        <tr key={record._id}>
                          <td>{record.employeeId?.personalDetails?.firstName} {record.employeeId?.personalDetails?.lastName}</td>
                          <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '--'}</td>
                          <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '--'}</td>
                          <td>{record.workingHours?.toFixed(2) || '--'}</td>
                          <td>
                            <span style={{ 
                              color: record.status === 'Present' ? '#28a745' : record.status === 'Absent' ? '#dc3545' : '#ffc107'
                            }}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leave Tab */}
            {activeTab === 'leave' && (
              <div className="timeoff-section">
                <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Leave Management</h2>
                <div className="timeoff-table-container">
                  <table className="timeoff-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map(leave => (
                        <tr key={leave._id}>
                          <td>{leave.employeeId?.personalDetails?.firstName} {leave.employeeId?.personalDetails?.lastName}</td>
                          <td>{leave.leaveType}</td>
                          <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                          <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                          <td>{leave.totalDays}</td>
                          <td>
                            <span style={{ 
                              color: leave.status === 'Pending' ? '#ffc107' : leave.status === 'Approved' ? '#28a745' : '#dc3545'
                            }}>
                              {leave.status}
                            </span>
                          </td>
                          <td>
                            {leave.status === 'Pending' && (
                              <div className="action-buttons">
                                <button 
                                  className="approve-btn"
                                  onClick={() => handleApproveLeave(leave._id)}
                                >
                                  ✓
                                </button>
                                <button 
                                  className="reject-btn"
                                  onClick={() => handleRejectLeave(leave._id)}
                                >
                                  ✗
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payroll Tab */}
            {activeTab === 'payroll' && (
              <div className="payroll-section">
                <h2 style={{ color: '#fff', marginBottom: '1.5rem' }}>Payroll Management</h2>
                <div className="timeoff-table-container">
                  <table className="timeoff-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Basic Salary</th>
                        <th>Gross Salary</th>
                        <th>Net Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollData.map(payroll => (
                        <tr key={payroll._id}>
                          <td>{payroll.employeeId?.personalDetails?.firstName} {payroll.employeeId?.personalDetails?.lastName}</td>
                          <td>{payroll.employeeId?.jobDetails?.department}</td>
                          <td>₹{payroll.salaryStructure?.basicSalary?.toLocaleString()}</td>
                          <td>₹{payroll.grossSalary?.toLocaleString()}</td>
                          <td>₹{payroll.netSalary?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;