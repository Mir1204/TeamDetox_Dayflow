import React, { useState, useEffect } from 'react';
import '../styles/AdminProfile.css';
import companyLogo from '../assets/company-logo.jpeg';

const AdminProfile = ({ onBackToDashboard, apiBaseUrl, onLogout, onNavigateToModule }) => {
  const [activeSection, setActiveSection] = useState('resume');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingPrivateInfo, setIsEditingPrivateInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Get user from localStorage or use default
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Basic info state - will be loaded from user data or API
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    jobPosition: '',
    email: '',
    mobile: '',
    company: '',
    department: '',
    manager: '',
    location: ''
  });

  // Resume data - will be loaded from API
  const [resumeData, setResumeData] = useState({
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });

  // Private info data - will be loaded from API
  const [privateInfo, setPrivateInfo] = useState({
    dateOfBirth: '',
    nationality: '',
    maritalStatus: '',
    emergencyContact: '',
    address: '',
    socialSecurity: '',
    bankAccount: ''
  });

  // Salary data - will be loaded from API
  const [salaryData, setSalaryData] = useState({
    baseSalary: '',
    bonuses: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    payFrequency: '',
    lastRaise: '',
    nextReview: ''
  });

  // Load user profile data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Load data based on user info from localStorage
        setBasicInfo({
          name: user.name || '',
          jobPosition: user.role === 'admin' ? 'Administrator' : 'Employee',
          email: user.email || '',
          mobile: user.phone || '',
          company: user.companyName || '',
          department: user.role === 'admin' ? 'Management' : 'General',
          manager: user.role === 'admin' ? 'CEO' : 'Department Head',
          location: 'Head Office'
        });
      } else {
        // Use dummy data if no user logged in
        loadDummyData();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
      loadDummyData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDummyData = () => {
    setBasicInfo({
      name: 'John Smith',
      jobPosition: 'Senior Software Developer',
      email: 'john.smith@company.com',
      mobile: '+1 (555) 123-4567',
      company: 'TechCorp Solutions',
      department: 'Information Technology',
      manager: 'Sarah Johnson',
      location: 'New York, NY'
    });

    setResumeData({
      summary: 'Experienced software developer with 8+ years in full-stack development, specializing in React, Node.js, and cloud technologies.',
      experience: 'Senior Software Developer at TechCorp Solutions (2020-Present)\nSoftware Developer at InnovateTech (2018-2020)\nJunior Developer at StartupXYZ (2016-2018)',
      education: 'Bachelor of Science in Computer Science\nUniversity of Technology (2012-2016)\nGPA: 3.8/4.0',
      skills: 'JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, Agile/Scrum'
    });

    setPrivateInfo({
      dateOfBirth: '1990-05-15',
      nationality: 'United States',
      maritalStatus: 'Married',
      emergencyContact: '+1 (555) 987-6543 (Jane Smith)',
      address: '123 Main Street, Apartment 4B, New York, NY 10001',
      socialSecurity: '***-**-1234',
      bankAccount: '****-****-****-1234 (Chase Bank)'
    });

    setSalaryData({
      baseSalary: '$95,000',
      bonuses: '$8,000',
      allowances: '$2,400',
      deductions: '$1,800',
      netSalary: '$103,600',
      payFrequency: 'Monthly',
      lastRaise: 'January 2023',
      nextReview: 'January 2024'
    });
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Field validation function
  const validateField = (field, value) => {
    let error = '';
    
    switch(field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'mobile':
        if (value && !/^[\+]?[(]?[\d\s\-\)]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'name':
        if (!value || value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    return error === '';
  };

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate field in real-time
    if (value) {
      validateField(field, value);
    } else {
      // Clear error if field is empty
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleResumeChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivateInfoChange = (field, value) => {
    setPrivateInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditingBasicInfo(!isEditingBasicInfo);
  };

  const handleResumeEditToggle = () => {
    setIsEditingResume(!isEditingResume);
  };

  const handlePrivateInfoEditToggle = () => {
    setIsEditingPrivateInfo(!isEditingPrivateInfo);
  };

  const handleSave = () => {
    setIsEditingBasicInfo(false);
    alert('Basic information saved successfully!');
  };

  const handleResumeSave = () => {
    setIsEditingResume(false);
    alert('Resume information saved successfully!');
  };

  const handlePrivateInfoSave = () => {
    setIsEditingPrivateInfo(false);
    alert('Private information saved successfully!');
  };

  const calculateTotals = () => {
    const basicSalary = parseFloat(salaryData.baseSalary?.replace(/[$,]/g, '') || '0');
    const bonuses = parseFloat(salaryData.bonuses?.replace(/[$,]/g, '') || '0');
    const allowances = parseFloat(salaryData.allowances?.replace(/[$,]/g, '') || '0');
    const deductions = parseFloat(salaryData.deductions?.replace(/[$,]/g, '') || '0');
    
    const grossSalary = basicSalary + bonuses + allowances;
    const netSalary = grossSalary - deductions;
    
    return { grossSalary, netSalary, totalDeductions: deductions };
  };

  const { grossSalary, totalDeductions, netSalary } = calculateTotals();

  return (
    <div className="admin-profile-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="company-logo">
            <img src={companyLogo} alt="Company Logo" className="logo-image" />
          </div>
          <nav className="main-navigation">
            <button 
              className={`nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => onNavigateToModule && onNavigateToModule('employees')}
            >
              Employees
            </button>
            <button 
              className={`nav-tab`}
              onClick={() => onNavigateToModule && onNavigateToModule('attendance')}
            >
              Attendance
            </button>
            <button 
              className={`nav-tab`}
              onClick={() => onNavigateToModule && onNavigateToModule('timeoff')}
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
              className="profile-btn active-profile"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              My Profile
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <button onClick={() => onBackToDashboard()}>Back to Dashboard</button>
                <button onClick={onLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header-section">
          <h1 className="page-title">My Profile</h1>
        </div>
        {/* Profile Info Section */}
        <div className="profile-info-section">
          <div className="profile-avatar-container">
            <div className="profile-avatar-wrapper">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="avatar-circle">
                  <span className="avatar-icon">👤</span>
                </div>
              )}
              <label htmlFor="profile-upload" className="edit-icon">
                <span>✏️</span>
              </label>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          <div className="basic-info-grid">
            <div className="info-left">
              <div className="name-section">
                <h2 className="user-name">{basicInfo.name}</h2>
                <div className="edit-controls">
                  {!isEditingBasicInfo ? (
                    <button className="edit-btn" onClick={handleEditToggle}>
                      <span>✏️</span> Edit
                    </button>
                  ) : (
                    <div className="save-cancel-btns">
                      <button className="save-btn" onClick={handleSave}>
                        <span>💾</span> Save
                      </button>
                      <button className="cancel-btn" onClick={handleEditToggle}>
                        <span>❌</span> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="info-field">
                <label>Job Position</label>
                <div className="input-wrapper">
                  {isEditingBasicInfo ? (
                    <input 
                      type="text" 
                      className={`info-input editable ${fieldErrors.jobPosition ? 'error' : ''}`}
                      value={basicInfo.jobPosition}
                      onChange={(e) => handleBasicInfoChange('jobPosition', e.target.value)}
                      placeholder="Enter your job position"
                    />
                  ) : (
                    <input type="text" className="info-input" value={basicInfo.jobPosition} readOnly />
                  )}
                  {fieldErrors.jobPosition && (
                    <span className="error-message">{fieldErrors.jobPosition}</span>
                  )}
                </div>
              </div>
              <div className="info-field">
                <label>Email</label>
                <div className="input-wrapper">
                  {isEditingBasicInfo ? (
                    <input 
                      type="email" 
                      className={`info-input editable ${fieldErrors.email ? 'error' : ''}`}
                      value={basicInfo.email}
                      onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <input type="email" className="info-input" value={basicInfo.email} readOnly />
                  )}
                  {fieldErrors.email && (
                    <span className="error-message">{fieldErrors.email}</span>
                  )}
                </div>
              </div>
              <div className="info-field">
                <label>Mobile</label>
                <div className="input-wrapper">
                  {isEditingBasicInfo ? (
                    <input 
                      type="tel" 
                      className={`info-input editable ${fieldErrors.mobile ? 'error' : ''}`}
                      value={basicInfo.mobile}
                      onChange={(e) => handleBasicInfoChange('mobile', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <input type="tel" className="info-input" value={basicInfo.mobile} readOnly />
                  )}
                  {fieldErrors.mobile && (
                    <span className="error-message">{fieldErrors.mobile}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="info-right">
              <div className="info-field">
                <label>Company</label>
                <div className="input-wrapper">
                  {isEditingBasicInfo ? (
                    <input 
                      type="text" 
                      className="info-input editable" 
                      value={basicInfo.company}
                      onChange={(e) => handleBasicInfoChange('company', e.target.value)}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <input type="text" className="info-input" value={basicInfo.company} readOnly />
                  )}
                </div>
              </div>
              <div className="info-field">
                <label>Department</label>
                <div className="input-wrapper">
                  {isEditingBasicInfo ? (
                    <input 
                      type="text" 
                      className="info-input editable" 
                      value={basicInfo.department}
                      onChange={(e) => handleBasicInfoChange('department', e.target.value)}
                      placeholder="Enter department"
                    />
                  ) : (
                    <input type="text" className="info-input" value={basicInfo.department} readOnly />
                  )}
                </div>
              </div>
              <div className="info-field">
                <label>Manager</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="text" 
                    className="info-input editable" 
                    value={basicInfo.manager}
                    onChange={(e) => handleBasicInfoChange('manager', e.target.value)}
                  />
                ) : (
                  <input type="text" className="info-input" value={basicInfo.manager} readOnly />
                )}
              </div>
              <div className="info-field">
                <label>Location</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="text" 
                    className="info-input editable" 
                    value={basicInfo.location}
                    onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                  />
                ) : (
                  <input type="text" className="info-input" value={basicInfo.location} readOnly />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeSection === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveSection('resume')}
          >
            Resume
          </button>
          <button 
            className={`tab-btn ${activeSection === 'private' ? 'active' : ''}`}
            onClick={() => setActiveSection('private')}
          >
            Private Info
          </button>
          <button 
            className={`tab-btn ${activeSection === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveSection('salary')}
          >
            Salary Info
          </button>
          <button 
            className={`tab-btn ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSection('security')}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeSection === 'resume' && (
            <div className="resume-section">
              <div className="section-header">
                <h3>Resume Information</h3>
                <div className="edit-controls">
                  {!isEditingResume ? (
                    <button className="edit-btn" onClick={handleResumeEditToggle}>
                      <span>✏️</span> Edit
                    </button>
                  ) : (
                    <div className="save-cancel-btns">
                      <button className="save-btn" onClick={handleResumeSave}>
                        <span>💾</span> Save
                      </button>
                      <button className="cancel-btn" onClick={handleResumeEditToggle}>
                        <span>❌</span> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="resume-form">
                <div className="form-field">
                  <label>Professional Summary</label>
                  {isEditingResume ? (
                    <textarea 
                      className="form-textarea editable" 
                      rows="3"
                      value={resumeData.summary}
                      onChange={(e) => handleResumeChange('summary', e.target.value)}
                      placeholder="Write a brief professional summary highlighting your key skills and experience..."
                    />
                  ) : (
                    <textarea className="form-textarea" rows="3" value={resumeData.summary} readOnly />
                  )}
                </div>
                
                <div className="form-field">
                  <label>Work Experience</label>
                  {isEditingResume ? (
                    <textarea 
                      className="form-textarea editable" 
                      rows="4"
                      value={resumeData.experience}
                      onChange={(e) => handleResumeChange('experience', e.target.value)}
                    />
                  ) : (
                    <textarea className="form-textarea" rows="4" value={resumeData.experience} readOnly />
                  )}
                </div>
                
                <div className="form-field">
                  <label>Education</label>
                  {isEditingResume ? (
                    <textarea 
                      className="form-textarea editable" 
                      rows="3"
                      value={resumeData.education}
                      onChange={(e) => handleResumeChange('education', e.target.value)}
                    />
                  ) : (
                    <textarea className="form-textarea" rows="3" value={resumeData.education} readOnly />
                  )}
                </div>
                
                <div className="form-field">
                  <label>Skills</label>
                  {isEditingResume ? (
                    <textarea 
                      className="form-textarea editable" 
                      rows="2"
                      value={resumeData.skills}
                      onChange={(e) => handleResumeChange('skills', e.target.value)}
                    />
                  ) : (
                    <textarea className="form-textarea" rows="2" value={resumeData.skills} readOnly />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'private' && (
            <div className="private-info-section">
              <div className="section-header">
                <h3>Private Information</h3>
                <div className="edit-controls">
                  {!isEditingPrivateInfo ? (
                    <button className="edit-btn" onClick={handlePrivateInfoEditToggle}>
                      <span>✏️</span> Edit
                    </button>
                  ) : (
                    <div className="save-cancel-btns">
                      <button className="save-btn" onClick={handlePrivateInfoSave}>
                        <span>💾</span> Save
                      </button>
                      <button className="cancel-btn" onClick={handlePrivateInfoEditToggle}>
                        <span>❌</span> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-field">
                    <label>Date of Birth</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="date" 
                        className="form-input editable" 
                        value={privateInfo.dateOfBirth}
                        onChange={(e) => handlePrivateInfoChange('dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={new Date(privateInfo.dateOfBirth).toLocaleDateString()} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Residing Address</label>
                    {isEditingPrivateInfo ? (
                      <textarea 
                        className="form-textarea editable" 
                        rows="2"
                        value={privateInfo.residingAddress}
                        onChange={(e) => handlePrivateInfoChange('residingAddress', e.target.value)}
                      />
                    ) : (
                      <textarea className="form-textarea" rows="2" value={privateInfo.residingAddress} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Nationality</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.nationality}
                        onChange={(e) => handlePrivateInfoChange('nationality', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.nationality} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Personal Email</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="email" 
                        className="form-input editable" 
                        value={privateInfo.personalEmail}
                        onChange={(e) => handlePrivateInfoChange('personalEmail', e.target.value)}
                      />
                    ) : (
                      <input type="email" className="form-input" value={privateInfo.personalEmail} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Gender</label>
                    {isEditingPrivateInfo ? (
                      <select 
                        className="form-input editable" 
                        value={privateInfo.gender}
                        onChange={(e) => handlePrivateInfoChange('gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.gender} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Marital Status</label>
                    {isEditingPrivateInfo ? (
                      <select 
                        className="form-input editable" 
                        value={privateInfo.maritalStatus}
                        onChange={(e) => handlePrivateInfoChange('maritalStatus', e.target.value)}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.maritalStatus} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Date of Joining</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="date" 
                        className="form-input editable" 
                        value={privateInfo.dateOfJoining}
                        onChange={(e) => handlePrivateInfoChange('dateOfJoining', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={new Date(privateInfo.dateOfJoining).toLocaleDateString()} readOnly />
                    )}
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="bank-details-header">
                    <h4>Bank Details</h4>
                  </div>
                  <div className="form-field">
                    <label>Account Number</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.accountNumber}
                        onChange={(e) => handlePrivateInfoChange('accountNumber', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.accountNumber} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Bank Name</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.bankName}
                        onChange={(e) => handlePrivateInfoChange('bankName', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.bankName} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>IFSC Code</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.ifscCode}
                        onChange={(e) => handlePrivateInfoChange('ifscCode', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.ifscCode} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>PAN No</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.panNo}
                        onChange={(e) => handlePrivateInfoChange('panNo', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.panNo} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>UAN NO</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.uanNo}
                        onChange={(e) => handlePrivateInfoChange('uanNo', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.uanNo} readOnly />
                    )}
                  </div>
                  <div className="form-field">
                    <label>Emp Code</label>
                    {isEditingPrivateInfo ? (
                      <input 
                        type="text" 
                        className="form-input editable" 
                        value={privateInfo.empCode}
                        onChange={(e) => handlePrivateInfoChange('empCode', e.target.value)}
                      />
                    ) : (
                      <input type="text" className="form-input" value={privateInfo.empCode} readOnly />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'salary' && (
            <div className="salary-section">
              <div className="salary-grid">
                <div className="salary-column">
                  <h4>Earnings</h4>
                  <div className="salary-row">
                    <span>Month Wages</span>
                    <span>{salaryData.basicSalary.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Yearly</span>
                    <span>{(salaryData.basicSalary * 12).toLocaleString()}</span>
                    <span>Yearly</span>
                  </div>
                  <div className="salary-row">
                    <span>House Components</span>
                    <span>{salaryData.hra.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Car Allowance</span>
                    <span>{salaryData.conveyance.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Medical Allowance</span>
                    <span>{salaryData.medicalAllowance.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Special Allowance</span>
                    <span>{salaryData.specialAllowance.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Gross Total Allowance</span>
                    <span>{grossSalary.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Final Allowance</span>
                    <span>{netSalary.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                </div>

                <div className="salary-column">
                  <h4>Deductions</h4>
                  <div className="salary-row">
                    <span>Provident Fund (PF) Contribution</span>
                    <span>{salaryData.providentFund.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Professional Tax</span>
                    <span>{salaryData.professionalTax.toLocaleString()}</span>
                    <span>/Year</span>
                  </div>
                  <div className="salary-row">
                    <span>Income Tax</span>
                    <span>{salaryData.incomeTax.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                  <div className="salary-row">
                    <span>Total Deductions</span>
                    <span>{totalDeductions.toLocaleString()}</span>
                    <span>/Month</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="security-section">
              <h3>Security Settings</h3>
              <p>Security settings will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;