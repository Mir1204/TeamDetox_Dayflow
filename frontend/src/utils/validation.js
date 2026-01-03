// Validation utility functions

export const isRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateField = (name, value, allValues = {}) => {
  let error = '';

  switch (name) {
    case 'email':
      if (!isRequired(value)) {
        error = 'Email is required';
      } else if (!isValidEmail(value)) {
        error = 'Please enter a valid email address';
      }
      break;

    case 'password':
      if (!isRequired(value)) {
        error = 'Password is required';
      } else if (!isValidPassword(value)) {
        error = 'Password must be at least 6 characters long';
      }
      break;

    case 'confirmPassword':
      if (!isRequired(value)) {
        error = 'Please confirm your password';
      } else if (!passwordsMatch(allValues.password, value)) {
        error = 'Passwords do not match';
      }
      break;

    case 'name':
    case 'companyName':
      if (!isRequired(value)) {
        error = `${name === 'companyName' ? 'Company name' : 'Name'} is required`;
      } else if (value.trim().length < 2) {
        error = `${name === 'companyName' ? 'Company name' : 'Name'} must be at least 2 characters long`;
      }
      break;

    case 'phone':
      if (!isRequired(value)) {
        error = 'Phone number is required';
      } else if (!isValidPhone(value)) {
        error = 'Please enter a valid phone number';
      }
      break;

    default:
      if (!isRequired(value)) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
      break;
  }

  return error;
};

export const validateForm = (formData) => {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return {
    isValid,
    errors
  };
};

export const hasFormErrors = (errors) => {
  return Object.values(errors).some(error => error && error.length > 0);
};