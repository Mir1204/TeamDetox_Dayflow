import React, { useState } from 'react';
import Input from '../components/Input';
import { validateField, isValidEmail, isRequired } from '../utils/validation';
import '../styles/SigninPage.css';

const SigninPage = ({ onSwitchToSignup, onLoginSuccess }) => {
  // Form state management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') {
      if (!isRequired(value)) {
        error = 'Email is required';
      } else if (!isValidEmail(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'password') {
      if (!isRequired(value)) {
        error = 'Password is required';
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = {};
    
    if (!isRequired(formData.email)) {
      formErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
    }
    
    if (!isRequired(formData.password)) {
      formErrors.password = 'Password is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Form is valid - would submit to backend here
    console.log('Sign in form submitted with data:', formData);
    
    // Simulate successful login and navigate to dashboard
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      alert('Sign in successful! Redirecting to dashboard...');
    }
  };

  // Check if submit should be disabled
  const isSubmitDisabled = () => {
    return (
      !formData.email.trim() || 
      !formData.password.trim() ||
      errors.email ||
      errors.password
    );
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Sign in Page</h1>
        
        <div className="app-logo-section">
          <div className="app-logo-placeholder">
            App/Web Logo
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            label="Login Id/Email :-"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password :-"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className={`signin-submit-button ${isSubmitDisabled() ? 'disabled' : ''}`}
            disabled={isSubmitDisabled()}
          >
            SIGN IN
          </button>
        </form>

        <div className="signin-footer">
          <p>Don't have an Account? <button className="link-button" onClick={onSwitchToSignup}>Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;