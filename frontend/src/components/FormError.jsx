import React from 'react';

const FormError = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`form-error ${className}`}>
      <span className="error-icon">⚠</span>
      <span className="error-text">{error}</span>
    </div>
  );
};

export default FormError;
