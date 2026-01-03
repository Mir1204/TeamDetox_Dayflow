import React, { useState } from 'react';
import '../styles/ImportantModal.css';

const ImportantModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Important</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="important-text">
            <p><strong>Key Rules/Information</strong></p>
            <p>The Salary Information tab should seem to define and accept all unauthorized accesses to the tab or previous employee attendance or work related information, contact the HR Department.</p>
            <br />
            <p><strong>Login Time:</strong></p>
            <p><strong>Fixed time:-</strong></p>
            <br />
            <p><strong>Salary Components</strong></p>
            <p>Each component is listed with its correct details/information. It's structured in such a way that the salary information of each employee at the office should also be displayed.Performance Bonus Based on the annual performance based in % . Each year Income Statement.</p>
            <br />
            <p><strong>Construction: Types Fund should be Percentage of Base:</strong></p>
            <p>Provident Fund (PF): Should be 12% of the employee's monthly basic salary for EMI's Standard.</p>
            <p>Allowance: VIAF Performance Bonus 10.8% or Income Income Based income Statement. * SSA % if one year Income Statement. * 10,8% of one year Income Statement.</p>
            <br />
            <p><strong>The Calculation of components should not exceed the defined limit</strong></p>
            <br />
            <p><strong>The Salary should calculate each component amount based on the employee's salary range and basic Information.</strong></p>
            <br />
            <p><strong>Format:</strong></p>
            <p>% usage = [RCTV.XX] and Basic = [XX.X% of Compe Basic = [XX.XX].</p>
            <br />
            <p><strong>Each field for configuration (eg: HZ rule 12%)</strong></p>
            <p>and Professional Tax grade ₹</p>
          </div>
          
          <div className="employee-preview">
            <div className="preview-header">
              <span>This view opens when the employee accesses their "My Profile"</span>
            </div>
            <div className="mini-profile">
              <div className="mini-tabs">
                <span className="mini-tab">Company Logo</span>
                <span className="mini-tab">Attendance</span>
                <span className="mini-tab">Attendance Time Off</span>
              </div>
              <div className="mini-content">
                <div className="mini-avatar"></div>
                <div className="mini-info">
                  <h4>My Name</h4>
                  <div className="mini-details">
                    <div className="mini-row">
                      <span>Name</span>
                      <input type="text" defaultValue="Employee Name" />
                    </div>
                    <div className="mini-row">
                      <span>Department</span>
                      <input type="text" defaultValue="IT" />
                    </div>
                    <div className="mini-row">
                      <span>Phone No</span>
                      <input type="text" defaultValue="+1234567890" />
                    </div>
                    <div className="mini-row">
                      <span>Address</span>
                      <input type="text" defaultValue="Employee Address" />
                    </div>
                    <div className="mini-row">
                      <span>Addhar No</span>
                      <input type="text" defaultValue="XXXX XXXX XXXX" />
                    </div>
                    <div className="mini-row">
                      <span>Email</span>
                      <input type="text" defaultValue="employee@company.com" />
                    </div>
                    <div className="mini-row">
                      <span>Date of Joining</span>
                      <input type="text" defaultValue="01/01/2023" />
                    </div>
                    <div className="mini-row">
                      <span>Date of Salary</span>
                      <input type="text" defaultValue="01/01/2024" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportantModal;