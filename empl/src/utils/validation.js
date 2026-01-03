/**
 * Validation helper functions for form fields
 */

// Email validation using regex
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - minimum 8 characters
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

// Check if passwords match
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Check if field is not empty
export const isRequired = (value) => {
  return value && value.trim().length > 0;
};

// Phone validation - basic format check
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Main validation function for all form fields
export const validateField = (fieldName, value, allValues = {}) => {
  const trimmedValue = value ? value.trim() : '';
  
  switch (fieldName) {
    case 'companyName':
      if (!isRequired(trimmedValue)) {
        return 'Company name is required';
      }
      if (trimmedValue.length < 2) {
        return 'Company name must be at least 2 characters';
      }
      return '';

    case 'name':
      if (!isRequired(trimmedValue)) {
        return 'Name is required';
      }
      if (trimmedValue.length < 2) {
        return 'Name must be at least 2 characters';
      }
      return '';

    case 'email':
      if (!isRequired(trimmedValue)) {
        return 'Email is required';
      }
      if (!isValidEmail(trimmedValue)) {
        return 'Please enter a valid email address';
      }
      return '';

    case 'phone':
      if (!isRequired(trimmedValue)) {
        return 'Phone number is required';
      }
      if (!isValidPhone(trimmedValue)) {
        return 'Please enter a valid phone number';
      }
      return '';

    case 'password':
      if (!isRequired(trimmedValue)) {
        return 'Password is required';
      }
      if (!isValidPassword(trimmedValue)) {
        return 'Password must be at least 8 characters long';
      }
      return '';

    case 'confirmPassword':
      if (!isRequired(trimmedValue)) {
        return 'Please confirm your password';
      }
      if (!doPasswordsMatch(allValues.password, trimmedValue)) {
        return 'Passwords do not match';
      }
      return '';

    default:
      return '';
  }
};

// Validate all form fields at once
export const validateForm = (formData) => {
  const errors = {};
  
  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Check if form has any errors
export const hasFormErrors = (errors) => {
  return Object.values(errors).some(error => error && error.length > 0);
};