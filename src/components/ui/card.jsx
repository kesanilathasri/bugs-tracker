export function Card({ children, className = "", variant = "default", ...props }) {
  const baseClasses = "rounded-2xl transition-all duration-300 ease-out transform";
  
  const variants = {
    default: "bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-2xl border border-white/20 dark:border-gray-700/50",
    glass: "glass-card shadow-glass dark:shadow-glass-dark",
    "3d": "card-3d bg-white dark:bg-gray-800 shadow-3d dark:shadow-3d-dark border border-gray-200/50 dark:border-gray-700/50",
    gradient: "gradient-border shadow-lg hover:shadow-2xl bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70",
    neon: "bg-gray-900 border-2 border-neon-blue shadow-neon hover:shadow-neon-pink transition-all duration-300"
  };
  
  const variantClasses = variants[variant] || variants.default;
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-6 pb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-xl font-bold text-gradient ${className}`}>
      {children}
    </h3>
  );
}
