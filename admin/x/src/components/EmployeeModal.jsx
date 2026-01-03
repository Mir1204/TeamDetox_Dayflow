import React, { useState } from 'react';
import '../styles/EmployeeModal.css';

const EmployeeModal = ({ isOpen, onClose, employee, isAdmin = true }) => {
  const [activeTab, setActiveTab] = useState('resume');

  if (!isOpen || !employee) return null;

  // Mock detailed employee data
  const employeeDetails = {
    name: 'My Name',
    loginId: 'Login ID',
    email: 'Email',
    mobile: 'Mobile',
    company: 'Company',
    department: 'Department', 
    manager: 'Manager',
    education: 'Education',
    avatar: '👤',
    skills: ['JavaScript', 'React', 'Node.js'],
    certifications: ['AWS Certified', 'Google Cloud'],
    about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    interests: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    salaryInfo: {
      monthWage: 50000,
      yearlyWage: 600000,
      workingDays: 22,
      breakTime: 1, // hours
      basicSalary: 28000,
      employeesContribution: 10,
      houseRentAllowance: 14000,
      standardAllowance: 9127,
      performanceBonus: 2475,
      leaveTravelAllowance: 2062,
      fuelAllowance: 2470,
      providentFund: 3360,
      professionalTax: 2400,
      incomeTax: 8500
    }
  };

  const { salaryInfo } = employeeDetails;

  const handleAddSkill = () => {
    alert('Add Skill functionality - to be implemented');
  };

  const handleAddCertification = () => {
    alert('Add Certification functionality - to be implemented');
  };

  return (
    <div className="employee-modal-overlay" onClick={onClose}>
      <div className="employee-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="employee-modal-header">
          <h2>For Admin:</h2>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="employee-nav-tabs">
          <span className="employee-nav-tab">Company Logo</span>
          <span className="employee-nav-tab">Employees</span>
          <span className="employee-nav-tab">Attendance</span>
          <span className="employee-nav-tab">Time Off</span>
        </div>

        <div className="employee-modal-body">
          {/* Left Section */}
          <div className="employee-left-panel">
            <div className="employee-profile-section">
              <div className="employee-avatar-large">
                {employeeDetails.avatar}
              </div>
              <h3>{employeeDetails.name}</h3>
              <p className="employee-login-id">{employeeDetails.loginId}</p>
              
              <div className="employee-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Company</span>
                  <span className="detail-value">{employeeDetails.company}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{employeeDetails.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{employeeDetails.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Manager</span>
                  <span className="detail-value">{employeeDetails.manager}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile</span>
                  <span className="detail-value">{employeeDetails.mobile}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Education</span>
                  <span className="detail-value">{employeeDetails.education}</span>
                </div>
              </div>

              <div className="employee-action-buttons">
                <button 
                  className={`employee-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume
                </button>
                <button 
                  className={`employee-tab-btn ${activeTab === 'private' ? 'active' : ''}`}
                  onClick={() => setActiveTab('private')}
                >
                  Private Info
                </button>
                {isAdmin && (
                  <button 
                    className={`employee-tab-btn ${activeTab === 'salary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('salary')}
                  >
                    Salary Info
                  </button>
                )}
              </div>
            </div>

            {/* Resume Tab Content */}
            {activeTab === 'resume' && (
              <div className="resume-content">
                <div className="resume-section">
                  <h4>About</h4>
                  <p>{employeeDetails.about}</p>
                </div>

                <div className="resume-section">
                  <h4>What I love about my job</h4>
                  <p>{employeeDetails.interests}</p>
                </div>

                <div className="resume-section">
                  <h4>My interests and hobbies</h4>
                  <p>{employeeDetails.about}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="employee-right-panel">
            {activeTab === 'resume' && (
              <>
                <div className="skills-section">
                  <div className="section-header">
                    <h4>Skills</h4>
                    <button className="add-btn" onClick={handleAddSkill}>+ Add Skill</button>
                  </div>
                  <div className="skills-list">
                    {employeeDetails.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="certification-section">
                  <div className="section-header">
                    <h4>Certification</h4>
                    <button className="add-btn" onClick={handleAddCertification}>+ Add Skill</button>
                  </div>
                  <div className="certification-list">
                    {employeeDetails.certifications.map((cert, index) => (
                      <span key={index} className="cert-tag">{cert}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'salary' && isAdmin && (
              <div className="salary-info-panel">
                <div className="salary-header">
                  <h3>Salary Info tab Should only be visible to Admin</h3>
                  <button className="salary-tab active">Salary Info</button>
                </div>

                <div className="salary-details">
                  <div className="salary-basic-info">
                    <div className="salary-row">
                      <span>Month Wage</span>
                      <span>{salaryInfo.monthWage.toLocaleString()}</span>
                      <span>/Month</span>
                      <span>No of working days: {salaryInfo.workingDays}</span>
                    </div>
                    <div className="salary-row">
                      <span>Yearly wage</span>
                      <span>{salaryInfo.yearlyWage.toLocaleString()}</span>
                      <span>/Yearly</span>
                      <span>Break Time: {salaryInfo.breakTime}/Hrs</span>
                    </div>
                  </div>

                  <div className="salary-components">
                    <h4>Salary Components</h4>
                    
                    <div className="component-row">
                      <span>Basic Salary</span>
                      <span>{salaryInfo.basicSalary.toLocaleString()}</span>
                      <span>/month</span>
                      <span>{salaryInfo.employeesContribution}%</span>
                    </div>
                    <div className="component-row">
                      <span>Employee's contribution based on the basic salary</span>
                    </div>
                    
                    <div className="component-row">
                      <span>House Rent Allowance</span>
                      <span>{salaryInfo.houseRentAllowance.toLocaleString()}</span>
                      <span>/month</span>
                      <span>50.00%</span>
                    </div>
                    <div className="component-row">
                      <span>Should be calculated 50% of the basic salary</span>
                    </div>
                    
                    <div className="component-row">
                      <span>Standard Allowance</span>
                      <span>{salaryInfo.standardAllowance.toLocaleString()}</span>
                      <span>/month</span>
                      <span>16.63%</span>
                    </div>
                    <div className="component-row">
                      <span>A standard allowance is a predetermined fixed amount provided to employees for specific expenses such as:</span>
                    </div>
                    
                    <div className="component-row">
                      <span>Performance Bonus</span>
                      <span>{salaryInfo.performanceBonus.toLocaleString()}</span>
                      <span>/month</span>
                      <span>8.83%</span>
                    </div>
                    <div className="component-row">
                      <span>Variable allowance paid based on individual/team performance derived by the company and should have the basic salary</span>
                    </div>
                    
                    <div className="component-row">
                      <span>Leave Travel Allowance</span>
                      <span>{salaryInfo.leaveTravelAllowance.toLocaleString()}</span>
                      <span>/month</span>
                      <span>9.33%</span>
                    </div>
                    <div className="component-row">
                      <span>LTA is paid by the company to employees to cover their travel expenses and typically calculated as a percentage of the basic salary component</span>
                    </div>
                    
                    <div className="component-row">
                      <span>Fuel Allowance</span>
                      <span>{salaryInfo.fuelAllowance.toLocaleString()}</span>
                      <span>/month</span>
                      <span>11.63%</span>
                    </div>
                    <div className="component-row">
                      <span>Fuel allowance portion of wages as defined in the policies and calculated as a vehicle's category etc...</span>
                    </div>
                  </div>

                  <div className="tax-deductions">
                    <h4>Tax Deductions</h4>
                    
                    <div className="component-row">
                      <span>Provident Fund (PF) Contribution</span>
                      <span>{salaryInfo.providentFund.toLocaleString()}</span>
                      <span>/month</span>
                      <span>12.00%</span>
                    </div>
                    <div className="component-row">
                      <span>PF is calculated based on the basic salary</span>
                    </div>
                    
                    <div className="component-row">
                      <span>Professional Tax</span>
                      <span>{salaryInfo.professionalTax.toLocaleString()}</span>
                      <span>/month</span>
                    </div>
                    <div className="component-row">
                      <span>Professional Tax deducted from the gross salary</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'private' && (
              <div className="private-info-panel">
                <h3>Private Information</h3>
                <p>Private employee information would be displayed here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;