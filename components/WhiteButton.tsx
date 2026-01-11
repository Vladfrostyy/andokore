import React from 'react';
import { motion } from 'framer-motion';

interface WhiteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "h-12 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200";
  
  const variants = {
    primary: "bg-primary text-white border-transparent hover:bg-black",
    secondary: "bg-white text-primary border-border hover:bg-accent hover:border-gray-300",
    danger: "bg-white text-red-500 border-red-100 hover:bg-red-50",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default WhiteButton;