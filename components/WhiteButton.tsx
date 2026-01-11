import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface WhiteButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const WhiteButton: React.FC<WhiteButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-12 px-6 text-sm",
  };

  const baseStyles = "rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200";
  
  const variants = {
    primary: "bg-primary text-white border-transparent hover:bg-black",
    secondary: "bg-white text-primary border-border hover:bg-accent hover:border-gray-300",
    danger: "bg-white text-red-500 border-red-100 hover:bg-red-50",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default WhiteButton;