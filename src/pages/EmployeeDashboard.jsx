import React, { useState } from 'react';
import '../styles/EmployeeDashboard.css';
import companyLogo from '../assets/company-logo.jpeg';

const EmployeeDashboard = ({ onLogout, onNavigateToProfile }) => {
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // Mock employee data with three status indicators: green dot, yellow dot, airplane
  const employees = [
    { id: 1, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 2, name: 'Employee Name', status: 'absent', avatar: '👤', statusColor: 'yellow' },
    { id: 3, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 4, name: 'Employee Name', status: 'on-leave', avatar: '👤', statusColor: 'airplane' },
    { id: 5, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 6, name: 'Employee Name', status: 'absent', avatar: '👤', statusColor: 'yellow' },
    { id: 7, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 8, name: 'Employee Name', status: 'on-leave', avatar: '👤', statusColor: 'airplane' },
    { id: 9, name: 'Employee Name', status: 'absent', avatar: '👤', statusColor: 'yellow' }
  ];

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleCheckToggle = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      alert('Checked Out successfully!');
    } else {
      setIsCheckedIn(true);
      alert('Checked In successfully!');
    }
  };

  const getUserFromStorage = () => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: 'Demo User', role: 'admin' };
  };

  const user = getUserFromStorage();

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
              className={`nav-tab ${activeTab === 'timeoff' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeoff')}
            >
              Time Off
            </button>
          </nav>
        </div>
        
        <div className="header-right">
          {/* Check In/Out Button */}
          <button 
            className={`check-in-circle ${isCheckedIn ? 'checked-in' : 'checked-out'}`}
            onClick={handleCheckToggle}
            title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
          >
          </button>

          <div className="user-status">
            <div className="user-avatar">👤</div>
          </div>
          
          <div className="user-menu">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              My Profile
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={() => onNavigateToProfile()}>View Profile</button>
                <button onClick={onLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <p className="main-title">Employee Dashboard</p>
            </div>

            <div className="controls-section">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Employee Grid */}
            <div className="employee-grid">
              {filteredEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="employee-card"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className={`status-indicator ${employee.statusColor}`}>
                    {employee.statusColor === 'airplane' ? '✈️' : ''}
                  </div>
                  <div className="employee-avatar">{employee.avatar}</div>
                  <div className="employee-name">[Employee Name]</div>
                </div>
              ))}
            </div>

            {/* Settings and Info */}
            <div className="bottom-section">
              <div className="left-info">
              </div>

              <div className="right-actions">
                {/* Additional actions can be added here */}
              </div>
            </div>


          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-section">
            <h2>Attendance Module</h2>
            <p>Attendance tracking and records will be displayed here.</p>
          </div>
        )}

        {activeTab === 'timeoff' && (
          <div className="timeoff-section">
            <h2>Time Off Module</h2>
            <p>Time off requests and management will be displayed here.</p>
          </div>
        )}

        {/* Employee Modal */}
        {showEmployeeModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowEmployeeModal(false)}>
            <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Employee Information</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowEmployeeModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="employee-avatar-large">{selectedEmployee.avatar}</div>
                <h4>{selectedEmployee.name}</h4>
                <p>Status: <span className={`status-text ${selectedEmployee.status}`}>
                  {selectedEmployee.status}
                </span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;