import React from 'react';

const Input = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  label,
  required = false,
  autoComplete,
  ...rest
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;