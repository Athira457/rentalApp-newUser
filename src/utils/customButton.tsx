import React from 'react';

interface CustomButtonProps {
  type: "button" | "submit" | "reset";
  children: React.ReactNode;
  className?: string; 
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ type, children, className, onClick }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
