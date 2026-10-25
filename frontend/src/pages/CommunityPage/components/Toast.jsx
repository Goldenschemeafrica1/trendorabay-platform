import React from 'react';

const Toast = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="toast show">
      {message}
    </div>
  );
};

export default Toast;
