export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[^s@]+@[^s@]+.[^s@]+$/;
  if (!re.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const re = /^[+]?[1-9][d]{0,15}$/;
  if (!re.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required) {
      const error = validateRequired(value, rule.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }
    
    if (rule.type === 'email' && value) {
      const error = validateEmail(value);
      if (error) errors[field] = error;
    }
    
    if (rule.type === 'password' && value) {
      const error = validatePassword(value);
      if (error) errors[field] = error;
    }
    
    if (rule.type === 'phone' && value) {
      const error = validatePhone(value);
      if (error) errors[field] = error;
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters long`;
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
    }
  });
  
  return errors;
};