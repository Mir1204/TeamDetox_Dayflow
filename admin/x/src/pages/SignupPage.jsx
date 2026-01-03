import React, { useState } from 'react';
import Input from '../components/Input';
import { validateField, validateForm, hasFormErrors } from '../utils/validation';
import '../styles/SignupPage.css';

const SignupPage = ({ onSwitchToSignin }) => {
  // Form state management
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur for real-time validation
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate entire form
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Form is valid - would submit to backend here
    console.log('Form submitted with data:', formData);
    alert('Sign up form is valid and ready for backend integration!');
  };



  // Check if submit should be disabled
  const isSubmitDisabled = () => {
    return (
      hasFormErrors(errors) || 
      !formData.companyName.trim() || 
      !formData.name.trim() || 
      !formData.email.trim() || 
      !formData.phone.trim() || 
      !formData.password.trim() || 
      !formData.confirmPassword.trim()
    );
  };

  // Handle logo upload
  const handleLogoUpload = () => {
    // Placeholder for logo upload functionality
    alert('Logo upload functionality - to be implemented with backend');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Sign Up Page</h1>
        
        <div className="app-logo-section">
          <div className="app-logo-placeholder">
            App/Web Logo
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          <div className="company-name-section">
            <Input
              id="companyName"
              name="companyName"
              type="text"
              label="Company Name :-"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.companyName}
              required
            />
            <button
              type="button"
              className="upload-logo-button"
              onClick={handleLogoUpload}
            >
              📤 Upload Logo
            </button>
          </div>

          <Input
            id="name"
            name="name"
            type="text"
            label="Name :-"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.name}
            required
            autoComplete="name"
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email :-"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone :-"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.phone}
            required
            autoComplete="tel"
          />

          <div className="password-field-container">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password :-"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="password-field-container">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password :-"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitDisabled() ? 'disabled' : ''}`}
            disabled={isSubmitDisabled()}
          >
            Sign Up
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <button className="link-button" onClick={onSwitchToSignin}>Sign In</button></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;