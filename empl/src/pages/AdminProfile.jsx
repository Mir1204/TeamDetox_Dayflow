import React, { useState } from 'react';
import '../styles/AdminProfile.css';

const AdminProfile = ({ onBackToDashboard }) => {
  const [activeSection, setActiveSection] = useState('profile');

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
      {/* Header */}
      <div className="profile-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBackToDashboard}>← Back to Dashboard</button>
        </div>
        <div className="header-tabs">
          <span className="header-tab">Company Logo</span>
          <span className="header-tab">Attendance</span>
          <span className="header-tab">Attendance Time Off</span>
        </div>
        <div className="header-right">
          <div className="profile-circle"></div>
        </div>
      </div>

      <div className="profile-content">
        {/* Left Section - Profile Info */}
        <div className="profile-left">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle"></div>
            </div>
            
            <div className="profile-info">
              <h2>My Name</h2>
              <p className="employee-id">Login ID</p>
              <div className="profile-details">
                <div className="detail-row">
                  <span className="label">Department</span>
                  <span className="value">IT</span>
                </div>
                <div className="detail-row">
                  <span className="label">Position</span>
                  <span className="value">Senior Developer</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email</span>
                  <span className="value">employee@company.com</span>
                </div>
                <div className="detail-row">
                  <span className="label">Phone</span>
                  <span className="value">+1234567890</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="action-btn primary">Photo ID</button>
                <button className="action-btn secondary">Salary Slip</button>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {/* <div className="notes-section">
            <h3>Notes</h3>
            <div className="notes-content">
              <p>Each meal should display the employee's profile picture and some basic information.</p>
              <p>At the top left corner of each meal there should be an icon indicating the employee's attendance or work status.</p>
              <p>The colored indicators are as follows:</p>
              <ul>
                <li>🟢 Green: The Employee is present in the office</li>
                <li>🔴 Red: The Employee is absent</li>
                <li>🟡 Yellow: The Employee is absent (Employee does not need time off and is absent.)</li>
              </ul>
            </div>
            <div className="notes-actions">
              <button className="notes-btn">Add Work</button>
              <button className="notes-btn">Add Work</button>
            </div>
          </div> */}
        </div>

        {/* Right Section - Salary Information */}
        <div className="profile-right">
          {/* <div className="salary-header">
            <h3>For Admin:</h3>
            <p>Salary Info tab Should only be visible to Admin</p>
          </div> */}

          <div className="salary-section">
            <div className="salary-tab">
              <button className="salary-tab-btn active">Salary Info</button>
            </div>

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
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;