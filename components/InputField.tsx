import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-xs font-medium text-secondary ml-1">{label}</label>}
      <div className="relative">
        <input
          {...props}
          className="w-full py-3 px-4 bg-accent rounded-xl border border-transparent text-primary placeholder-gray-400 focus:outline-none transition-all duration-200"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        <div 
          className={`absolute bottom-0 left-4 right-4 h-[1px] bg-primary transition-transform duration-300 origin-center ${isFocused ? 'scale-x-100' : 'scale-x-0'}`} 
        />
      </div>
    </div>
  );
};

export default InputField;