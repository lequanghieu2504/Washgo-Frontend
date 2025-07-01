import React from "react";

// Card Component
export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Export components
export default Card;
