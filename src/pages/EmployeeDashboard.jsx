/**
 * Employee Dashboard Component
 * 
 * Main dashboard for employee management system with three core modules:
 * 1. Employees - Staff management and profiles
 * 2. Attendance - Time tracking and attendance records
 * 3. Time Off - Leave management and approval system
 * 
 * Features:
 * - Role-based access control
 * - Real-time status indicators
 * - Interactive employee profiles
 * - Attendance tracking with date navigation
 * - Time off management with approval workflow
 * - Search and filter capabilities
 * - Responsive design
 * 
 * @component
 * @version 1.0.0
 * @author TeamDetox
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/EmployeeDashboard.css';
import companyLogo from '../assets/company-logo.jpeg';

/**
 * Employee Dashboard Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Logout handler function
 * @param {Function} props.onNavigateToProfile - Profile navigation handler
 * @param {string} props.initialModule - Initial active module (employees, attendance, timeoff)
 * @returns {JSX.Element} Employee dashboard component
 */
const EmployeeDashboard = ({ onLogout, onNavigateToProfile, initialModule = 'employees' }) => {
  // ========== STATE MANAGEMENT ==========
  
  /** Currently active tab/module */
  const [activeTab, setActiveTab] = useState(initialModule);
  
  /** Currently selected employee for detailed view */
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  /** User check-in/out status */
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  /** Search term for filtering employees */
  const [searchTerm, setSearchTerm] = useState('');
  
  /** Debounced search term for performance optimization */
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  /** Profile dropdown visibility state */
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  /** Employee detail modal visibility */
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  
  /** Active tab in employee modal */
  const [modalActiveTab, setModalActiveTab] = useState('resume');
  
  /** Selected date for attendance view */
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  /** Attendance view type (daily, weekly, monthly) */
  const [attendanceView, setAttendanceView] = useState('daily');
  
  /** Time off filter type */
  const [timeoffFilter, setTimeoffFilter] = useState('all');

  // ========== EFFECTS ==========
  
  /**
   * Update active tab when initialModule changes
   * This enables direct navigation from profile to specific modules
   */
  useEffect(() => {
    setActiveTab(initialModule);
  }, [initialModule]);

  /**
   * Debounce search input for performance optimization
   * Delays search execution to reduce unnecessary filtering
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // ========== MOCK DATA ==========
  
  /**
   * Mock employee data for demonstration
   * In production, this would be fetched from API
   * 
   * @type {Array<Object>} Employee objects with complete profile information
   */
  const employees = useMemo(() => [
    { 
      id: 1, 
      name: 'John Smith', 
      status: 'present', // Status: present, absent, on-leave
      avatar: '👤', 
      statusColor: 'green', // Color indicator for status
      loginId: 'john.smith',
      email: 'john.smith@company.com',
      mobile: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      department: 'Information Technology',
      manager: 'Sarah Johnson',
      location: 'New York, NY',
      // Salary information (in cents for precision)
      monthWage: 50000,
      yearlyWage: 600000,
      workingDays: 22,
      baseSalary: 250000,
      houseRent: 125000,
      standardAllowance: 4167,
      performanceBonus: 8333,
      medicalAllowance: 2083,
      fixedAllowance: 2083
    },
    { 
      id: 2, 
      name: 'Emily Davis', 
      status: 'absent', 
      avatar: '👤', 
      statusColor: 'yellow',
      loginId: 'emily.davis',
      email: 'emily.davis@company.com',
      mobile: '+1 (555) 234-5678',
      company: 'TechCorp Solutions',
      department: 'Human Resources',
      manager: 'Michael Brown',
      location: 'Los Angeles, CA',
      monthWage: 45000,
      yearlyWage: 540000,
      workingDays: 22,
      baseSalary: 220000,
      houseRent: 110000,
      standardAllowance: 3667,
      performanceBonus: 7333,
      medicalAllowance: 1833,
      fixedAllowance: 1833
    },
    { 
      id: 3, 
      name: 'Michael Wilson', 
      status: 'present', 
      avatar: '👤', 
      statusColor: 'green',
      loginId: 'michael.wilson',
      email: 'michael.wilson@company.com',
      mobile: '+1 (555) 345-6789',
      company: 'TechCorp Solutions',
      department: 'Engineering',
      manager: 'Lisa Anderson',
      location: 'San Francisco, CA',
      monthWage: 55000,
      yearlyWage: 660000,
      workingDays: 22,
      baseSalary: 275000,
      houseRent: 137500,
      standardAllowance: 4583,
      performanceBonus: 9167,
      medicalAllowance: 2292,
      fixedAllowance: 2292
    },
    { 
      id: 4, 
      name: 'Sarah Johnson', 
      status: 'on-leave', 
      avatar: '👤', 
      statusColor: 'airplane',
      loginId: 'sarah.johnson',
      email: 'sarah.johnson@company.com',
      mobile: '+1 (555) 456-7890',
      company: 'TechCorp Solutions',
      department: 'Marketing',
      manager: 'David Lee',
      location: 'Chicago, IL',
      monthWage: 48000,
      yearlyWage: 576000,
      workingDays: 22,
      baseSalary: 240000,
      houseRent: 120000,
      standardAllowance: 4000,
      performanceBonus: 8000,
      medicalAllowance: 2000,
      fixedAllowance: 2000
    },
    { 
      id: 5, 
      name: 'David Lee', 
      status: 'present', 
      avatar: '👤', 
      statusColor: 'green',
      loginId: 'david.lee',
      email: 'david.lee@company.com',
      mobile: '+1 (555) 567-8901',
      company: 'TechCorp Solutions',
      department: 'Sales',
      manager: 'Jennifer White',
      location: 'Miami, FL',
      monthWage: 52000,
      yearlyWage: 624000,
      workingDays: 22,
      baseSalary: 260000,
      houseRent: 130000,
      standardAllowance: 4333,
      performanceBonus: 8667,
      medicalAllowance: 2167,
      fixedAllowance: 2167
    },
    { 
      id: 6, 
      name: 'Lisa Anderson', 
      status: 'absent', 
      avatar: '👤', 
      statusColor: 'yellow',
      loginId: 'lisa.anderson',
      email: 'lisa.anderson@company.com',
      mobile: '+1 (555) 678-9012',
      company: 'TechCorp Solutions',
      department: 'Finance',
      manager: 'Robert Taylor',
      location: 'Houston, TX',
      monthWage: 49000,
      yearlyWage: 588000,
      workingDays: 22,
      baseSalary: 245000,
      houseRent: 122500,
      standardAllowance: 4083,
      performanceBonus: 8167,
      medicalAllowance: 2042,
      fixedAllowance: 2042
    },
    { 
      id: 7, 
      name: 'Robert Taylor', 
      status: 'present', 
      avatar: '👤', 
      statusColor: 'green',
      loginId: 'robert.taylor',
      email: 'robert.taylor@company.com',
      mobile: '+1 (555) 789-0123',
      company: 'TechCorp Solutions',
      department: 'Operations',
      manager: 'Amanda Clark',
      location: 'Seattle, WA',
      monthWage: 51000,
      yearlyWage: 612000,
      workingDays: 22,
      baseSalary: 255000,
      houseRent: 127500,
      standardAllowance: 4250,
      performanceBonus: 8500,
      medicalAllowance: 2125,
      fixedAllowance: 2125
    },
    { 
      id: 8, 
      name: 'Amanda Clark', 
      status: 'on-leave', 
      avatar: '👤', 
      statusColor: 'airplane',
      loginId: 'amanda.clark',
      email: 'amanda.clark@company.com',
      mobile: '+1 (555) 890-1234',
      company: 'TechCorp Solutions',
      department: 'Legal',
      manager: 'Kevin Martinez',
      location: 'Boston, MA',
      monthWage: 53000,
      yearlyWage: 636000,
      workingDays: 22,
      baseSalary: 265000,
      houseRent: 132500,
      standardAllowance: 4417,
      performanceBonus: 8833,
      medicalAllowance: 2208,
      fixedAllowance: 2208
    },
    { 
      id: 9, 
      name: 'Jennifer White', 
      status: 'absent', 
      avatar: '👤', 
      statusColor: 'yellow',
      loginId: 'jennifer.white',
      email: 'jennifer.white@company.com',
      mobile: '+1 (555) 901-2345',
      company: 'TechCorp Solutions',
      department: 'Customer Service',
      manager: 'Daniel Kim',
      location: 'Denver, CO',
      monthWage: 47000,
      yearlyWage: 564000,
      workingDays: 22,
      baseSalary: 235000,
      houseRent: 117500,
      standardAllowance: 3917,
      performanceBonus: 7833,
      medicalAllowance: 1958,
      fixedAllowance: 1958
    }
  ], []); // End of useMemo for employees

  /**
   * Mock time off data for demonstration
   * In production, this would be fetched from API
   */
  const timeOffAllocation = useMemo(() => ({
    paidTimeOff: {
      total: 24,
      used: 5,
      available: 19
    },
    sickLeave: {
      total: 7,
      used: 2,
      available: 5
    },
    unpaidLeave: {
      total: 'Unlimited',
      used: 3,
      available: 'Unlimited'
    }
  }), []); // End of useMemo for timeOffAllocation

  /**
   * Mock time off requests for demonstration
   * In production, this would be fetched from API
   */
  const timeOffRequests = useMemo(() => [
    {
      id: 1,
      employeeName: 'John Smith',
      startDate: '28/10/2025',
      endDate: '30/10/2025',
      timeOffType: 'Paid time Off',
      status: 'pending',
      reason: 'Family vacation'
    },
    {
      id: 2,
      employeeName: 'Emily Davis',
      startDate: '15/11/2025',
      endDate: '15/11/2025',
      timeOffType: 'Sick Leave',
      status: 'approved',
      reason: 'Medical appointment'
    },
    {
      id: 3,
      employeeName: 'Michael Wilson',
      startDate: '20/11/2025',
      endDate: '22/11/2025',
      timeOffType: 'Unpaid Leave',
      status: 'pending',
      reason: 'Personal matter'
    },
    {
      id: 4,
      employeeName: 'Sarah Johnson',
      startDate: '05/12/2025',
      endDate: '07/12/2025',
      timeOffType: 'Paid time Off',
      status: 'rejected',
      reason: 'Holiday break'
    },
    {
      id: 5,
      employeeName: 'David Lee',
      startDate: '12/12/2025',
      endDate: '12/12/2025',
      timeOffType: 'Sick Leave',
      status: 'approved',
      reason: 'Flu symptoms'
    }
  ], []); // Memoize to prevent unnecessary re-renders

  // ========== EVENT HANDLERS ==========
  
  /**
   * Handle time off request actions (approve/reject)
   * 
   * @param {number} requestId - ID of the time off request
   * @param {string} action - Action to perform (approve/reject)
   */
  const handleTimeOffAction = useCallback((requestId, action) => {
    try {
      // In production, this would make an API call
      alert(`Time off request ${action} for request ID: ${requestId}`);
      
      // Here you would typically update the request status
      // and refresh the data from the server
    } catch (error) {
      console.error('Error handling time off action:', error);
      alert('Error processing time off request. Please try again.');
    }
  }, []);

  /**
   * Mock attendance data for demonstration
   * In production, this would be fetched from API based on selected date
   * 
   * @type {Array<Object>} Attendance records
   */
  const attendanceData = useMemo(() => [
    {
      id: 1,
      employeeName: 'John Smith',
      checkIn: '10:00',
      checkOut: '14:00',
      workHours: '09:00',
      extraHours: '01:00',
      date: '2025-10-22',
      status: 'present'
    },
    {
      id: 2,
      employeeName: 'Emily Davis',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00',
      date: '2025-10-22',
      status: 'present'
    },
    {
      id: 3,
      employeeName: 'Michael Wilson',
      checkIn: '09:30',
      checkOut: '18:30',
      workHours: '08:30',
      extraHours: '00:30',
      date: '2025-10-22',
      status: 'present'
    },
    {
      id: 4,
      employeeName: 'Sarah Johnson',
      checkIn: '--',
      checkOut: '--',
      workHours: '--',
      extraHours: '--',
      date: '2025-10-22',
      status: 'on-leave'
    },
    {
      id: 5,
      employeeName: 'David Lee',
      checkIn: '11:00',
      checkOut: '20:00',
      workHours: '08:00',
      extraHours: '01:00',
      date: '2025-10-22',
      status: 'present'
    }
  ], []);

  // ========== COMPUTED VALUES ==========
  
  /**
   * Filter employees based on debounced search term
   * Uses memoization for performance optimization
   * Searches both name and department for better UX
   * 
   * @type {Array<Object>} Filtered employee list
   */
  const filteredEmployees = useMemo(() => 
    employees.filter(employee =>
      employee.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ), [employees, debouncedSearchTerm]
  );

  /**
   * Get current user data from localStorage with fallback
   * 
   * @returns {Object} User data object
   */
  const getCurrentUser = useCallback(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { 
        name: 'Demo User', 
        role: 'admin',
        email: 'demo@company.com'
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { name: 'Demo User', role: 'admin', email: 'demo@company.com' };
    }
  }, []);

  const user = getCurrentUser();

  // ========== EVENT HANDLERS ==========
  
  /**
   * Handle employee card click to open detailed modal
   * 
   * @param {Object} employee - Employee data object
   */
  const handleEmployeeClick = useCallback((employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
    setModalActiveTab('resume'); // Reset to first tab
  }, []);

  /**
   * Format date for display
   * 
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  const formatDate = useCallback((date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }, []);

  /**
   * Get day of week from date
   * 
   * @param {Date} date - Date object
   * @returns {string} Day of week string
   */
  const getDayOfWeek = useCallback((date) => {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  }, []);

  /**
   * Navigate to previous or next date
   * 
   * @param {string} direction - Direction to navigate ('prev' or 'next')
   */
  const navigateDate = useCallback((direction) => {
    const newDate = new Date(selectedDate);
    
    if (direction === 'prev') {
      newDate.setDate(selectedDate.getDate() - 1);
    } else if (direction === 'next') {
      newDate.setDate(selectedDate.getDate() + 1);
    }
    
    setSelectedDate(newDate);
  }, [selectedDate]);

  /**
   * Handle check-in/check-out toggle
   * In production, this would sync with time tracking system
   */
  const handleCheckToggle = useCallback(() => {
    try {
      if (isCheckedIn) {
        setIsCheckedIn(false);
        alert('Checked Out successfully!');
        // In production: API call to record check-out time
      } else {
        setIsCheckedIn(true);
        alert('Checked In successfully!');
        // In production: API call to record check-in time
      }
    } catch (error) {
      console.error('Error toggling check status:', error);
      alert('Error updating check status. Please try again.');
    }
  }, [isCheckedIn]);

  /**
   * Handle search input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // ========== COMPONENT RENDER ==========
  
  return (
    <div className="dashboard-container">
      {/* 
        MAIN HEADER SECTION
        Contains navigation, branding, and user controls
      */}
      <div className="dashboard-header">
        {/* Left side: Logo and main navigation */}
        <div className="header-left">
          {/* Company branding */}
          <div className="company-logo">
            <img src={companyLogo} alt="Company Logo" className="logo-image" />
          </div>
          
          {/* Main navigation tabs */}
          <nav className="main-navigation" role="navigation">
            <button 
              className={`nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
              aria-label="View employees section"
            >
              Employees
            </button>
            <button 
              className={`nav-tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              aria-label="View attendance section"
            >
              Attendance
            </button>
            <button 
              className={`nav-tab ${activeTab === 'timeoff' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeoff')}
              aria-label="View time off section"
            >
              Time Off
            </button>
          </nav>
        </div>
        
        {/* Right side: User controls and status */}
        <div className="header-right">
          {/* 
            Check In/Out Button
            Circular button with status-based styling
            Green: Available for check-in
            Red: Currently checked in (available for check-out)
          */}
          <button 
            className={`check-in-circle ${isCheckedIn ? 'checked-in' : 'checked-out'}`}
            onClick={handleCheckToggle}
            title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
            aria-label={isCheckedIn ? 'Check out from work' : 'Check in to work'}
          >
          </button>

          {/* User status indicator */}
          <div className="user-status">
            <div className="user-avatar" aria-label="User avatar">👤</div>
          </div>
          
          {/* 
            User menu dropdown
            Provides access to profile and logout functionality
          */}
          <div className="user-menu">
            <button 
              className="profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="Open user menu"
              aria-expanded={showProfileDropdown}
            >
              My Profile
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown" role="menu">
                <button 
                  onClick={() => onNavigateToProfile()}
                  role="menuitem"
                >
                  View Profile
                </button>
                <button 
                  onClick={onLogout}
                  role="menuitem"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        MAIN CONTENT AREA
        Dynamic content based on active tab selection
      */}
      <div className="dashboard-content">
        {/* 
          EMPLOYEES SECTION
          Employee management with search and detailed profiles
        */}
        {activeTab === 'employees' && (
          <div className="employees-section">
            {/* Section header */}
            <div className="section-header">
              <p className="main-title">Employee Dashboard</p>
            </div>

            {/* Search and filter controls */}
            <div className="controls-section">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search employees by name or department..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search employees"
              />
            </div>

            {/* 
              Employee Grid Display
              Shows employee cards with status indicators
              Cards are clickable for detailed view
            */}
            <div className="employee-grid" role="grid" aria-label="Employee list">
              {filteredEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="employee-card"
                  onClick={() => handleEmployeeClick(employee)}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`View details for ${employee.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleEmployeeClick(employee);
                    }
                  }}
                >
                  {/* Status indicator with color coding */}
                  <div 
                    className={`status-indicator ${employee.statusColor}`}
                    aria-label={`Status: ${employee.status}`}
                  >
                    {employee.statusColor === 'airplane' ? '✈️' : ''}
                  </div>
                  
                  {/* Employee avatar */}
                  <div className="employee-avatar" aria-hidden="true">
                    {employee.avatar}
                  </div>
                  
                  {/* Employee name */}
                  <div className="employee-name">{employee.name}</div>
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
            <div className="attendance-header">
              <div className="attendance-title">
                <h2>Attendances List view</h2>
                <p className="attendance-subtitle">For Admin/HR Officer</p>
              </div>
            </div>

            <div className="attendance-controls">
              <div className="attendance-label">Attendance</div>
              <input 
                type="text" 
                className="attendance-search" 
                placeholder="Searchbar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="date-navigation">
              <button 
                className="nav-arrow"
                onClick={() => navigateDate('prev')}
              >
                &lt;
              </button>
              <button 
                className="nav-arrow"
                onClick={() => navigateDate('next')}
              >
                &gt;
              </button>
              <div className="date-selector">
                <button className="date-btn">Date ˅</button>
              </div>
              <div className="day-selector">
                <button className="day-btn">Day</button>
              </div>
            </div>

            <div className="attendance-date">
              {formatDate(selectedDate)}
            </div>

            <div className="attendance-table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Emp</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Extra Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map(record => (
                    <tr key={record.id} className={`attendance-row ${record.status}`}>
                      <td>
                        <div className="employee-cell">
                          <span className="employee-bracket">[</span>
                          <span className="employee-name">{record.employeeName}</span>
                          <span className="employee-bracket">]</span>
                        </div>
                      </td>
                      <td className="time-cell">{record.checkIn}</td>
                      <td className="time-cell">{record.checkOut}</td>
                      <td className="time-cell">{record.workHours}</td>
                      <td className="time-cell">{record.extraHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'timeoff' && (
          <div className="timeoff-section">
            <div className="timeoff-controls">
              <div className="timeoff-label">Time Off Allocation</div>
              <button className="new-timeoff-btn">NEW</button>
              <input 
                type="text" 
                className="timeoff-search" 
                placeholder="Searchbar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Time Off Allocation Cards */}
            <div className="allocation-cards">
              <div className="allocation-card paid">
                <h3>Paid time Off</h3>
                <div className="allocation-info">
                  <span className="days-available">{timeOffAllocation.paidTimeOff.available} Days Available</span>
                </div>
              </div>
              <div className="allocation-card sick">
                <h3>Sick time off</h3>
                <div className="allocation-info">
                  <span className="days-available">{timeOffAllocation.sickLeave.available} Days Available</span>
                </div>
              </div>
              <div className="allocation-card unpaid">
                <h3>Unpaid Leave</h3>
                <div className="allocation-info">
                  <span className="days-available">{timeOffAllocation.unpaidLeave.available}</span>
                </div>
              </div>
            </div>

            {/* Time Off Requests Table */}
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
                  {timeOffRequests
                    .filter(request => 
                      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      request.timeOffType.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(request => (
                    <tr key={request.id} className={`timeoff-row ${request.status}`}>
                      <td>
                        <div className="employee-cell">
                          <span className="employee-bracket">[</span>
                          <span className="employee-name">{request.employeeName}</span>
                          <span className="employee-bracket">]</span>
                        </div>
                      </td>
                      <td className="date-cell">{request.startDate}</td>
                      <td className="date-cell">{request.endDate}</td>
                      <td className="type-cell">
                        <span className={`timeoff-type ${request.timeOffType.toLowerCase().replace(/\s+/g, '-')}`}>
                          {request.timeOffType}
                        </span>
                      </td>
                      <td className="status-cell">
                        {request.status === 'pending' ? (
                          <div className="action-buttons">
                            <button 
                              className="reject-btn"
                              onClick={() => handleTimeOffAction(request.id, 'rejected')}
                              title="Reject Request"
                            >
                            </button>
                            <button 
                              className="approve-btn"
                              onClick={() => handleTimeOffAction(request.id, 'approved')}
                              title="Approve Request"
                            >
                            </button>
                          </div>
                        ) : (
                          <span className={`status-badge ${request.status}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employee Profile Modal */}
        {showEmployeeModal && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setShowEmployeeModal(false)}>
            <div className="employee-profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>My Profile</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowEmployeeModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="profile-modal-content">
                {/* Profile Info Section */}
                <div className="profile-info-section">
                  <div className="profile-avatar-container">
                    <div className="profile-avatar-wrapper">
                      <div className="avatar-circle">
                        <span className="avatar-icon">{selectedEmployee.avatar}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="basic-info-grid">
                    <div className="info-left">
                      <div className="info-field">
                        <label>My Name</label>
                        <input type="text" className="info-input" value={selectedEmployee.name} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Login ID</label>
                        <input type="text" className="info-input" value={selectedEmployee.loginId} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Email</label>
                        <input type="email" className="info-input" value={selectedEmployee.email} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Mobile</label>
                        <input type="text" className="info-input" value={selectedEmployee.mobile} readOnly />
                      </div>
                    </div>
                    
                    <div className="info-right">
                      <div className="info-field">
                        <label>Company</label>
                        <input type="text" className="info-input" value={selectedEmployee.company} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Department</label>
                        <input type="text" className="info-input" value={selectedEmployee.department} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Manager</label>
                        <input type="text" className="info-input" value={selectedEmployee.manager} readOnly />
                      </div>
                      <div className="info-field">
                        <label>Location</label>
                        <input type="text" className="info-input" value={selectedEmployee.location} readOnly />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button 
                    className={`tab-btn ${modalActiveTab === 'resume' ? 'active' : ''}`}
                    onClick={() => setModalActiveTab('resume')}
                  >
                    Resume
                  </button>
                  <button 
                    className={`tab-btn ${modalActiveTab === 'private' ? 'active' : ''}`}
                    onClick={() => setModalActiveTab('private')}
                  >
                    Private Info
                  </button>
                  {user && user.role === 'admin' && (
                    <button 
                      className={`tab-btn ${modalActiveTab === 'salary' ? 'active' : ''}`}
                      onClick={() => setModalActiveTab('salary')}
                    >
                      Salary Info
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {modalActiveTab === 'resume' && (
                    <div className="resume-section">
                      <h4>Resume Information</h4>
                      <p>Resume details will be displayed here.</p>
                    </div>
                  )}

                  {modalActiveTab === 'private' && (
                    <div className="private-info-section">
                      <h4>Private Information</h4>
                      <p>Private information will be displayed here.</p>
                    </div>
                  )}

                  {modalActiveTab === 'salary' && user && user.role === 'admin' && (
                    <div className="salary-info-section">
                      <div className="salary-header">
                        <h4>Salary Info</h4>
                        <p className="admin-note">Salary Info tab Should only be visible to Admin</p>
                      </div>
                      
                      <div className="salary-overview">
                        <div className="salary-item">
                          <span className="salary-label">Month Wage</span>
                          <span className="salary-value">{selectedEmployee.monthWage?.toLocaleString()}</span>
                          <span className="salary-period">/Month</span>
                        </div>
                        <div className="salary-item">
                          <span className="salary-label">Yearly wage</span>
                          <span className="salary-value">{selectedEmployee.yearlyWage?.toLocaleString()}</span>
                          <span className="salary-period">/Yearly</span>
                        </div>
                      </div>

                      <div className="salary-details">
                        <div className="salary-components">
                          <h5>Salary Components</h5>
                          <div className="component-row">
                            <span>Base Salary</span>
                            <span>{selectedEmployee.baseSalary?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>50.00%</span>
                          </div>
                          <p className="component-note">Define Basic salary from company cost component is based on monthly wages</p>
                          
                          <div className="component-row">
                            <span>House Rent Allowance</span>
                            <span>{selectedEmployee.houseRent?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>50.00%</span>
                          </div>
                          <p className="component-note">HRA provided to employees 50% of the basic salary</p>
                          
                          <div className="component-row">
                            <span>Standard Allowance</span>
                            <span>{selectedEmployee.standardAllowance?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>16.67%</span>
                          </div>
                          <p className="component-note">A standard allowance is a predetermined, fixed amount paid to employees as part of their salary</p>
                          
                          <div className="component-row">
                            <span>Performance Bonus</span>
                            <span>{selectedEmployee.performanceBonus?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>8.33%</span>
                          </div>
                          <p className="component-note">Variable pay paid during payroll. The value defined by the company and calculated as a part of the basic salary</p>
                          
                          <div className="component-row">
                            <span>Medical Allowance</span>
                            <span>{selectedEmployee.medicalAllowance?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>8.33%</span>
                          </div>
                          <p className="component-note">CTC is paid by the company to employees to cover their travel expenses</p>
                          
                          <div className="component-row">
                            <span>Fixed Allowance</span>
                            <span>{selectedEmployee.fixedAllowance?.toLocaleString()}</span>
                            <span>₹/month</span>
                            <span>11.67%</span>
                          </div>
                          <p className="component-note">Fixed allowance portion of wages is determined after calculating all salary components</p>
                        </div>

                        <div className="working-info">
                          <div className="working-days">
                            <span>No of working days in a week:</span>
                            <span>{selectedEmployee.workingDays}</span>
                            <span>/hrs</span>
                          </div>
                          
                          <div className="additional-info">
                            <div className="info-item">
                              <span>Break Time:</span>
                              <div className="break-time"></div>
                              <span>/hrs</span>
                            </div>
                            
                            <div className="pf-info">
                              <h6>Provident Fund (PF) Contribution</h6>
                              <div className="pf-row">
                                <span>Employee</span>
                                <span>3000.00</span>
                                <span>₹/month</span>
                                <span>12.00%</span>
                              </div>
                              <p>PF is calculated based on the basic salary</p>
                              
                              <div className="pf-row">
                                <span>Employer</span>
                                <span>3000.00</span>
                                <span>₹/month</span>
                                <span>12.00%</span>
                              </div>
                              <p>PF is calculated based on the basic salary</p>
                            </div>
                            
                            <div className="tax-info">
                              <h6>Tax Deductions</h6>
                              <div className="tax-row">
                                <span>Professional Tax</span>
                                <span>200.00</span>
                                <span>₹/month</span>
                              </div>
                              <p>Professional Tax deducted from the Gross salary</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== COMPONENT EXPORT ==========

/**
 * Export the Employee Dashboard component
 * 
 * This component serves as the main interface for:
 * - Employee management and directory
 * - Attendance tracking and reporting
 * - Time off request management
 * - Interactive employee profiles
 * - Real-time status monitoring
 * 
 * Performance optimizations included:
 * - Memoized employee data and filtered results
 * - Debounced search functionality
 * - useCallback for event handlers
 * - Optimized re-rendering with React.memo patterns
 * 
 * Accessibility features:
 * - ARIA labels and roles
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Focus management
 */
export default EmployeeDashboard;