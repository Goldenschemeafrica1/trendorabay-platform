import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  fullWidth = false,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const loadingClass = loading ? 'loading' : '';
  const disabledClass = disabled ? 'disabled' : '';
  const fullWidthClass = fullWidth ? 'full-width' : '';

  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    disabledClass,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner">
          <span className="spinner"></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
