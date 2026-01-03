import React, { useState } from 'react';
import Input from '../components/Input';
import { authService } from '../services/authService';
import { validateField, validateForm, hasFormErrors } from '../utils/validation';
import '../styles/SignupPage.css';

const SignupPage = ({ onSwitchToSignin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Employee'
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
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSubmitError('');
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate entire form
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // Call backend API
      const response = await authService.signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        companyName: formData.companyName
      });

      // Store user data
      const userData = {
        ...response.user,
        name: formData.name,
        companyName: formData.companyName
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      if (onSignupSuccess) {
        onSignupSuccess(userData);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    return (
      hasFormErrors(errors) || 
      !formData.companyName.trim() || 
      !formData.name.trim() || 
      !formData.email.trim() || 
      !formData.phone.trim() || 
      !formData.password.trim() || 
      !formData.confirmPassword.trim() ||
      isLoading
    );
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
          <div className="role-selection-section">
            <label className="role-label">Select Role:</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${formData.role === 'Admin' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'Admin' }))}
              >
                👨‍💼 Admin
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'Employee' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'Employee' }))}
              >
                👤 Employee
              </button>
            </div>
          </div>

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

          {submitError && (
            <div className="error-message" style={{ color: '#ff6b6b', marginBottom: '16px', textAlign: 'center' }}>
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className={`submit-button ${isSubmitDisabled() ? 'disabled' : ''}`}
            disabled={isSubmitDisabled()}
          >
            {isLoading ? 'SIGNING UP...' : 'Sign Up'}
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