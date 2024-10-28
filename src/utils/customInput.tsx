import React from 'react';

interface CustomInputProps {
  type: string;
  placeholder?: string;
  value: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; 
}

const CustomInput: React.FC<CustomInputProps> = ({ type, placeholder, value, name, onChange, className }) => {
  return (
    <div className="custom-input-container">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        className={className} 
      />
    </div>
  );
};

export default CustomInput;
