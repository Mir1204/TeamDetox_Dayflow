import React, { useState } from 'react';
import Input from '../components/Input';
import { validateField, validateForm, hasFormErrors } from '../utils/validation';
import '../styles/SignupPage.css';

const SignupPage = ({ onSwitchToSignin, onSignupSuccess, apiBaseUrl }) => {
  // Form state management
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'employee' // default to employee
  });

  const [errors, setErrors] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');



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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate entire form
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Since backend is removed, simulate success
    setIsLoading(true);
    setSubmitError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data locally (since no backend)
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        role: formData.role,
        id: Date.now() // Simple ID generation
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      if (onSignupSuccess) {
        onSignupSuccess(userData);
      } else {
        alert(`Sign up successful! Welcome to TeamDetox as ${formData.role}!`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      !formData.confirmPassword.trim() ||
      isLoading
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
          <div className="role-selection-section">
            <label className="role-label">Select Role:</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-button ${formData.role === 'admin' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
              >
                👨‍💼 Admin
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'employee' ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, role: 'employee' }))}
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