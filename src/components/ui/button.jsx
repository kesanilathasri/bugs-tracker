import React from 'react';

export function Button({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'md',
  disabled = false,
  ...props 
}) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";
  
  const variants = {
  // Leave text color to CSS (.btn-modern) so we can switch per light/dark mode
  default: "btn-modern hover:scale-105",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:scale-105 bg-transparent dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105",
    glass: "glass-card text-gray-800 dark:text-white hover:bg-white/30 dark:hover:bg-black/30 hover:scale-105",
    neon: "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:from-neon-purple hover:to-neon-pink shadow-neon hover:shadow-neon-pink hover:scale-105",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 