// import React, { useState } from 'react';
import '../styles/EmployeeDashboard.css';
import EmployeeModal from '../components/EmployeeModal';
import companyLogo from '../assets/company-logo.jpeg';
import React, { useState, useRef, useEffect } from 'react';
// const [activeTab, setActiveTab] = useState('resume');



const EmployeeDashboard = ({ onLogout, onSwitchToProfile }) => {
  const profileDropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState('employee');
  const [profileTab, setProfileTab] = useState('resume');

  // const [activeTab, setActiveTab] = useState('resume');

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [attendanceView, setAttendanceView] = useState('admin'); // 'admin' or 'employee'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [timeOffView, setTimeOffView] = useState('admin'); // 'admin' or 'employee'
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [timeOffSearch, setTimeOffSearch] = useState('');

  // Mock attendance data
  const attendanceData = [
    {
      id: 1,
      employee: 'Employee 1',
      date: '22 October 2024',
      checkIn: '10:00',
      checkOut: '18:00',
      unitHours: '08:00',
      shiftHours: '09:00',
      extraHours: '01:00'
    },
    {
      id: 2,
      employee: 'Employee 2',
      date: '22 October 2024',
      checkIn: '10:00',
      checkOut: '18:00',
      unitHours: '08:00',
      shiftHours: '09:00',
      extraHours: '01:00'
    },
    {
      id: 3,
      employee: 'Employee 3',
      date: '22 October 2024',
      checkIn: '10:00',
      checkOut: '18:00',
      unitHours: '08:00',
      shiftHours: '09:00',
      extraHours: '01:00'
    }
  ];

  // Mock employee attendance data
  const employeeAttendanceData = [
    {
      id: 1,
      date: '24/10/2024',
      checkIn: '10:00',
      checkOut: '18:00',
      unitHours: '08:00',
      extraHours: '01:00'
    },
    {
      id: 2,
      date: '24/10/2024',
      checkIn: '',
      checkOut: '',
      unitHours: '',
      extraHours: ''
    }
  ];

  // Mock time off data for admin view
  const timeOffRequests = [
    {
      id: 1,
      name: 'Emp Name',
      startDate: '24/10/2024',
      endDate: '24/10/2024',
      timeOffType: 'Paid time Off',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Emp Name',
      startDate: '25/10/2024',
      endDate: '26/10/2024',
      timeOffType: 'Sick Leave',
      status: 'pending'
    }
  ];

  // Mock employee time off data
  const employeeTimeOffData = [
    {
      id: 1,
      name: 'Emp Name',
      startDate: '24/10/2024',
      endDate: '24/10/2024',
      timeOffType: 'Paid time Off',
      status: 'approved'
    }
  ];

  // Filter time off data based on search
  const filteredTimeOffRequests = timeOffRequests.filter(request =>
    request.name.toLowerCase().includes(timeOffSearch.toLowerCase())
  );
  const filteredAttendanceData = attendanceData.filter(record =>
    record.employee.toLowerCase().includes(attendanceSearch.toLowerCase())
  );
  const employees = [
    { id: 1, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 2, name: 'Employee Name', status: 'absent', avatar: '👤', statusColor: 'red' },
    { id: 3, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 4, name: 'Employee Name', status: 'leave', avatar: '👤', statusColor: 'yellow' },
    { id: 5, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 6, name: 'Employee Name', status: 'absent', avatar: '👤', statusColor: 'red' },
    { id: 7, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' },
    { id: 8, name: 'Employee Name', status: 'leave', avatar: '👤', statusColor: 'yellow' },
    { id: 9, name: 'Employee Name', status: 'present', avatar: '👤', statusColor: 'green' }
  ];

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleCloseModal = () => {
    setShowEmployeeModal(false);
    setSelectedEmployee(null);
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleNewEmployee = () => {
    alert('Add New Employee functionality - to be implemented');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleTimeOffRequest = () => {
    setShowTimeOffModal(true);
  };

  const handleCloseTimeOffModal = () => {
    setShowTimeOffModal(false);
  };

  const handleApproveTimeOff = (id) => {
    alert(`Time off request ${id} approved!`);
  };

  const handleRejectTimeOff = (id) => {
    alert(`Time off request ${id} rejected!`);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      {/* <div className="dashboard-header">
        <div className="header-left">
        </div>
        <div className="header-right">
          <div className="check-buttons-small">
            <button
              className={`check-circle ${isCheckedIn ? 'checked-in' : 'checked-out'}`}
              onClick={handleCheckToggle}
              title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
            ></button>
          </div>
          <div className="user-profile-section">
            <div className="profile-dropdown-container">
              <div className="user-avatar" onClick={handleProfileClick}>👤</div>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button onClick={onSwitchToProfile}>My Profile</button>
                  <button onClick={onLogout}>Log Out</button>
                </div>
              )}
            </div>
            <span className="user-name">Admin User</span>
          </div>
        </div>
      </div> */}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showEmployeeModal}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        isAdmin={true}
      />

      {/* Fixed Navigation Tabs */}
      {/* <div className="nav-tabs-fixed">
        <div className="nav-left">
          <div className="company-logo-nav">
            <img src={companyLogo} alt="Company Logo" className="nav-logo" />
          </div>
          <button
            className={`tab-btn ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => setActiveTab('employee')}
          >
            Employees
          </button>
          <button
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button
            className={`tab-btn ${activeTab === 'timeoff' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeoff')}
          >
            Time Off
          </button>
        </div>

        

        
        
      </div> */}
      {/* Fixed Navigation Tabs (Single Top Header) */}
      <div className="nav-tabs-fixed">

        {/* LEFT SIDE */}
        <div className="nav-left">
          <div className="company-logo-nav">
            <img src={companyLogo} alt="Company Logo" className="nav-logo" />
          </div>

          <button
            className={`tab-btn ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => setActiveTab('employee')}
          >
            Employees
          </button>

          <button
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>

          <button
            className={`tab-btn ${activeTab === 'timeoff' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeoff')}
          >
            Time Off
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* Check In / Check Out */}
          <button
            className={`check-circle ${isCheckedIn ? 'checked-in' : 'checked-out'}`}
            onClick={handleCheckToggle}
            title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
          ></button>

          {/* User Profile */}
          <div className="profile-dropdown-container" ref={profileDropdownRef}>
            <div className="user-avatar" onClick={handleProfileClick}>👤</div>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={() => setActiveTab('profile')}>
                  My Profile
                </button>
                <button onClick={onLogout}>Log Out</button>
              </div>
            )}
          </div>


          <span className="user-name">Employee User</span>
        </div>

      </div>


      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'profile' && (
          <div className="tab-content profile-tab">
            <div className="profile-container">
              <h2>My Profile</h2>
              <div className="profile-content">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">👤</div>
                  <div className="profile-basic-info">
                    <h3>My Name</h3>
                    <p>Position</p>
                    <p>Employee ID</p>
                    <p>Department</p>
                    <p>Manager</p>
                  </div>
                </div>

                {/* <div className="profile-tabs">
                  <div className="profile-tab-buttons">
                    <button className="profile-tab-btn active">Resume</button>
                    <button className="profile-tab-btn">Private Info</button>
                    
                    <button className="profile-tab-btn">Security</button>
                  </div>
                  <div className="profile-tab-content">
                    <div className="profile-form-grid">
                      <div className="form-column">
                        <div className="form-group">
                          <label>Date of Birth</label>
                          <input type="text" placeholder="Enter date" />
                        </div>
                        <div className="form-group">
                          <label>Mailing Address</label>
                          <input type="text" placeholder="Enter address" />
                        </div>
                        <div className="form-group">
                          <label>Nationality</label>
                          <input type="text" placeholder="Enter nationality" />
                        </div>
                        <div className="form-group">
                          <label>Personal Email</label>
                          <input type="email" placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                          <label>Gender</label>
                          <input type="text" placeholder="Enter gender" />
                        </div>
                        <div className="form-group">
                          <label>Marital Status</label>
                          <input type="text" placeholder="Enter status" />
                        </div>
                        <div className="form-group">
                          <label>Date of Joining</label>
                          <input type="text" placeholder="Enter date" />
                        </div>
                      </div>
                      <div className="form-column">
                        <div className="form-group">
                          <label>Bank Details</label>
                          <input type="text" placeholder="Enter details" />
                        </div>
                        <div className="form-group">
                          <label>Account Number</label>
                          <input type="text" placeholder="Enter account number" />
                        </div>
                        <div className="form-group">
                          <label>Bank Name</label>
                          <input type="text" placeholder="Enter bank name" />
                        </div>
                        <div className="form-group">
                          <label>IFSC Code</label>
                          <input type="text" placeholder="Enter IFSC" />
                        </div>
                        <div className="form-group">
                          <label>PAN No</label>
                          <input type="text" placeholder="Enter PAN" />
                        </div>
                        <div className="form-group">
                          <label>UAN No</label>
                          <input type="text" placeholder="Enter UAN" />
                        </div>
                        <div className="form-group">
                          <label>Emp Code</label>
                          <input type="text" placeholder="Enter code" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="profile-tabs">

  {/* ================= TAB BUTTONS ================= */}
  <div className="profile-tab-buttons">
    <button
      className={`profile-tab-btn ${profileTab === 'resume' ? 'active' : ''}`}
      onClick={() => setProfileTab('resume')}
    >
      Resume
    </button>

    <button
      className={`profile-tab-btn ${profileTab === 'private' ? 'active' : ''}`}
      onClick={() => setProfileTab('private')}
    >
      Private Info
    </button>

    <button
      className={`profile-tab-btn ${profileTab === 'security' ? 'active' : ''}`}
      onClick={() => setProfileTab('security')}
    >
      Security
    </button>
  </div>

  {/* ================= TAB CONTENT ================= */}
  <div className="profile-tab-content">

    {/* ===== RESUME TAB ===== */}
    {profileTab === 'resume' && (
      <div className="profile-form-grid">

        <div className="form-group full-width">
          <label>Professional Summary</label>
          <textarea placeholder="Write a brief professional summary..." />
        </div>

        <div className="form-group full-width">
          <label>Work Experience</label>
          <textarea placeholder="Describe your work experience..." />
        </div>

        <div className="form-group full-width">
          <label>Education</label>
          <textarea placeholder="Enter your education details..." />
        </div>

        <div className="form-group full-width">
          <label>Skills</label>
          <input type="text" placeholder="e.g. React, Java, SQL" />
        </div>

      </div>
    )}

    {/* ===== PRIVATE INFO TAB ===== */}
    {profileTab === 'private' && (
      <div className="profile-form-grid">

        <div className="form-column">
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Mailing Address</label>
            <input type="text" placeholder="Enter address" />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input type="text" placeholder="Enter nationality" />
          </div>

          <div className="form-group">
            <label>Personal Email</label>
            <input type="email" placeholder="Enter email" />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <input type="text" placeholder="Enter gender" />
          </div>

          <div className="form-group">
            <label>Marital Status</label>
            <input type="text" placeholder="Enter status" />
          </div>

          <div className="form-group">
            <label>Date of Joining</label>
            <input type="date" />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Bank Details</label>
            <input type="text" placeholder="Enter details" />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input type="text" placeholder="Enter account number" />
          </div>

          <div className="form-group">
            <label>Bank Name</label>
            <input type="text" placeholder="Enter bank name" />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input type="text" placeholder="Enter IFSC" />
          </div>

          <div className="form-group">
            <label>PAN No</label>
            <input type="text" placeholder="Enter PAN" />
          </div>

          <div className="form-group">
            <label>UAN No</label>
            <input type="text" placeholder="Enter UAN" />
          </div>

          <div className="form-group">
            <label>Emp Code</label>
            <input type="text" placeholder="Enter code" />
          </div>
        </div>

      </div>
    )}

    {/* ===== SECURITY TAB ===== */}
    {profileTab === 'security' && (
      <div className="profile-form-grid">

        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" />
        </div>

      </div>
    )}

  </div>
</div>


              </div>
            </div>
          </div>
        )}

        {activeTab === 'employee' && (
          <>
            {/* <div className="content-header">
              <h2>After login the user must land on this page</h2>
              <div className="action-buttons">
                <button className="settings-btn">Settings</button>
              </div>
            </div> */}

            <div className="dashboard-controls">
              <button className="new-btn" onClick={handleNewEmployee}>NEW</button>
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
                  <div className={`status-indicator ${employee.statusColor}`}></div>
                  <div className="employee-avatar">{employee.avatar}</div>
                  <div className="employee-info">
                    <h4>[{employee.name}]</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="check-info-section">
              <div className="status-legend">
                <p>Each card should display the employee's profile picture and some basic information.</p>
                <p>At the top-right corner of each card, there should be an icon indicating the employee's attendance or work status.</p>
                <p>The status indicators are as follows:</p>
                <ul>
                  <li><span className="legend-dot green"></span> Green dot: Employee is present in the office</li>
                  <li><span className="legend-dot red"></span> Red dot: Employee is absent</li>
                  <li><span className="legend-dot yellow"></span> Yellow dot: Employee is absent (Employee has not applied time off and is absent.)</li>
                </ul>
              </div>
              <div className="check-buttons-section">
                <button className="check-btn-large check-in-btn">
                  Check In →
                </button>
                <p className="check-time">Since 09:00AM</p>
                <button className="check-btn-large check-out-btn">
                  Check Out →
                </button>
                <p className="success-note">Upon successful Check IN, the red status dot changes to green. 🟢</p>
              </div>
            </div> */}

            {/* <div className="bottom-info">
              <p>Employees can mark their attendance using the Check In/Check Out section, and users can view their attendance records through the Attendance module.</p>
            </div> */}
            <footer class="app-footer">
              <div class="footer-left">
                © 2026 <strong>DETOX HRMS</strong>. All rights reserved.
              </div>

              <div class="footer-center">
                Secure • Reliable • Employee-Centric Management System
              </div>

              <div class="footer-right">
                <a href="#">Privacy Policy</a>
                <span>|</span>
                <a href="#">Terms of Service</a>
                <span>|</span>
                <a href="#">Help & Support</a>
              </div>
            </footer>

          </>
        )}

        {activeTab === 'attendance' && (
          <div className="tab-content attendance-tab">

            <div className="attendance-employee-view">
              <div className="employee-attendance-header">
                <div className="date-range-controls">
                  <button className="nav-btn">‹‹</button>
                  <button className="nav-btn">‹</button>

                  <div className="date-inputs">
                    <select className="date-select">
                      <option>Oct ∨</option>
                      <option>October 2024</option>
                    </select>

                    <input type="text" placeholder="Days Present" className="count-input" />
                    <input type="text" placeholder="Leaves" className="count-input" />
                    <input type="text" placeholder="Working Days" className="count-input" />
                  </div>

                  <button className="nav-btn">›</button>
                  <button className="nav-btn">››</button>
                </div>
              </div>

              <div className="employee-attendance-table-container">
                <table className="attendance-table employee-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Unit Hours</th>
                      <th>Extra Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeAttendanceData.map(record => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.checkIn || '-'}</td>
                        <td>{record.checkOut || '-'}</td>
                        <td>{record.unitHours || '-'}</td>
                        <td>{record.extraHours || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}


        {activeTab === 'timeoff' && (
          <div className="tab-content timeoff-tab">
            <div className="timeoff-header">
              <div className="timeoff-view-toggle">
                {/* <button
                  className={`view-toggle-btn ${timeOffView === 'admin' ? 'active' : ''}`}
                  onClick={() => setTimeOffView('admin')}
                >
                  For Admin & HR Officers
                </button> */}
                <button
                  className={`view-toggle-btn ${timeOffView === 'employee' ? 'active' : ''}`}
                  onClick={() => setTimeOffView('employee')}
                >
                  For Employees View
                </button>
              </div>
            </div>

            {/* {timeOffView === 'admin' && (
              <div className="timeoff-admin-view">
                <div className="timeoff-controls">
                  <div className="timeoff-sections">
                    <button className="section-btn active">Time Off</button>
                    <button className="section-btn">Allocation</button>
                  </div>
                  <div className="timeoff-search">
                    <input
                      type="text"
                      placeholder="Searchbar"
                      className="search-input-timeoff"
                      value={timeOffSearch}
                      onChange={(e) => setTimeOffSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="timeoff-table-container">
                  <table className="timeoff-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Time off Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimeOffRequests.map(request => (
                        <tr key={request.id}>
                          <td>{request.name}</td>
                          <td>{request.startDate}</td>
                          <td>{request.endDate}</td>
                          <td>{request.timeOffType}</td>
                          <td>
                            <div className="status-actions">
                              <button
                                className="reject-btn"
                                onClick={() => handleRejectTimeOff(request.id)}
                              >
                                Reject
                              </button>
                              <button
                                className="approve-btn"
                                onClick={() => handleApproveTimeOff(request.id)}
                              >
                                Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )} */}

            {timeOffView === 'employee' && (
              <div className="timeoff-employee-view">
                <div className="employee-timeoff-header">
                  <div className="timeoff-actions">
                    <button className="timeoff-action-btn post-btn" onClick={handleTimeOffRequest}>
                      Post time Off
                    </button>
                    <button className="timeoff-action-btn sick-btn" onClick={handleTimeOffRequest}>
                      Sick time off
                    </button>
                    <div className="days-available">
                      <span>20 Days Available</span>
                    </div>
                  </div>
                </div>

                <div className="employee-timeoff-table-container">
                  <table className="timeoff-table employee-timeoff-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Time off Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeTimeOffData.map(record => (
                        <tr key={record.id}>
                          <td>{record.name}</td>
                          <td>{record.startDate}</td>
                          <td>{record.endDate}</td>
                          <td>{record.timeOffType}</td>
                          <td>
                            <span className={`status-badge ${record.status}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="timeoff-note">
                  <div className="note-container">
                    <h4>Note</h4>
                    <p>Employees can view only their own time off records, while Admins and HR Officers can view all records & approve/reject them for all employees</p>
                  </div>
                </div>
              </div>
            )}

            {/* Time Off Request Modal */}
            {showTimeOffModal && (
              <div className="modal-overlay" onClick={handleCloseTimeOffModal}>
                <div className="timeoff-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Time off Type Request</h3>
                    <button className="close-btn" onClick={handleCloseTimeOffModal}>×</button>
                  </div>
                  <div className="modal-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Employee</label>
                        <select className="modal-select">
                          <option>[Employee]</option>
                          <option>Employee 1</option>
                          <option>Employee 2</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Time off Type</label>
                        <select className="modal-select">
                          <option>[Paid time off]</option>
                          <option>Paid time off</option>
                          <option>Sick Leave</option>
                          <option>Unpaid Leaves</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Validity Period</label>
                        <input type="date" className="modal-input" placeholder="May 12" />
                      </div>
                      <div className="form-group">
                        <label></label>
                        <input type="date" className="modal-input" placeholder="May 16" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Allocations</label>
                        <input type="text" className="modal-input" placeholder="05 Days" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group full-width">
                        <label>Attachment:</label>
                        <div className="file-upload">
                          <input type="file" id="file-upload" className="file-input" />
                          <label htmlFor="file-upload" className="file-label">
                            📁 (For sick leave certificate)
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="timeoff-types-info">
                      <h4>TimeOff Types:</h4>
                      <ul>
                        <li>- Paid Time off</li>
                        <li>- Sick Leave</li>
                        <li>- Unpaid Leaves</li>
                      </ul>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="submit-btn">Submit</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;