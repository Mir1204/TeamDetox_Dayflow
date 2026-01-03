import React, { useState } from 'react';
import '../styles/AdminProfile.css';

const AdminProfile = ({ onBackToDashboard }) => {
  const [activeSection, setActiveSection] = useState('resume');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isEditingPrivateInfo, setIsEditingPrivateInfo] = useState(false);
  
  // Basic info state with dummy data
  const [basicInfo, setBasicInfo] = useState({
    name: 'John Smith',
    jobPosition: 'Senior Software Developer',
    email: 'john.smith@company.com',
    mobile: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    department: 'Information Technology',
    manager: 'Sarah Johnson',
    location: 'New York, NY'
  });

  // Resume data with dummy data
  const [resumeData, setResumeData] = useState({
    summary: 'Experienced software developer with 8+ years in full-stack development, specializing in React, Node.js, and cloud technologies.',
    experience: 'Senior Software Developer at TechCorp Solutions (2020-Present)\nSoftware Developer at InnovateTech (2018-2020)\nJunior Developer at StartupXYZ (2016-2018)',
    education: 'Bachelor of Science in Computer Science\nUniversity of Technology (2012-2016)\nGPA: 3.8/4.0',
    skills: 'JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, Agile/Scrum'
  });

  // Private info data with dummy data
  const [privateInfo, setPrivateInfo] = useState({
    dateOfBirth: '1990-05-15',
    residingAddress: '123 Main Street, Apartment 4B, New York, NY 10001',
    nationality: 'United States',
    personalEmail: 'john.smith.personal@gmail.com',
    gender: 'Male',
    maritalStatus: 'Married',
    dateOfJoining: '2020-03-01',
    accountNumber: '****-****-****-1234',
    bankName: 'Chase Bank',
    ifscCode: 'CHASUS33',
    panNo: 'ABCDE1234F',
    uanNo: 'UAN123456789',
    empCode: 'EMP001'
  });

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

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
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

  // Mock salary data
  const salaryData = {
    basicSalary: 50000,
    hra: 15000,
    conveyance: 3000,
    medicalAllowance: 2000,
    specialAllowance: 5000,
    providentFund: 6000,
    professionalTax: 2400,
    incomeTax: 8500
  };

  const calculateTotals = () => {
    const grossSalary = salaryData.basicSalary + salaryData.hra + salaryData.conveyance + 
                       salaryData.medicalAllowance + salaryData.specialAllowance;
    const totalDeductions = salaryData.providentFund + salaryData.professionalTax + salaryData.incomeTax;
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, totalDeductions, netSalary };
  };

  const { grossSalary, totalDeductions, netSalary } = calculateTotals();

  return (
    <div className="admin-profile-container">
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
                {isEditingBasicInfo ? (
                  <input 
                    type="text" 
                    className="info-input editable" 
                    value={basicInfo.jobPosition}
                    onChange={(e) => handleBasicInfoChange('jobPosition', e.target.value)}
                  />
                ) : (
                  <input type="text" className="info-input" value={basicInfo.jobPosition} readOnly />
                )}
              </div>
              <div className="info-field">
                <label>Email</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="email" 
                    className="info-input editable" 
                    value={basicInfo.email}
                    onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                  />
                ) : (
                  <input type="email" className="info-input" value={basicInfo.email} readOnly />
                )}
              </div>
              <div className="info-field">
                <label>Mobile</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="tel" 
                    className="info-input editable" 
                    value={basicInfo.mobile}
                    onChange={(e) => handleBasicInfoChange('mobile', e.target.value)}
                  />
                ) : (
                  <input type="tel" className="info-input" value={basicInfo.mobile} readOnly />
                )}
              </div>
            </div>
            
            <div className="info-right">
              <div className="info-field">
                <label>Company</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="text" 
                    className="info-input editable" 
                    value={basicInfo.company}
                    onChange={(e) => handleBasicInfoChange('company', e.target.value)}
                  />
                ) : (
                  <input type="text" className="info-input" value={basicInfo.company} readOnly />
                )}
              </div>
              <div className="info-field">
                <label>Department</label>
                {isEditingBasicInfo ? (
                  <input 
                    type="text" 
                    className="info-input editable" 
                    value={basicInfo.department}
                    onChange={(e) => handleBasicInfoChange('department', e.target.value)}
                  />
                ) : (
                  <input type="text" className="info-input" value={basicInfo.department} readOnly />
                )}
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