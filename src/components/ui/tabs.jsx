import React from "react";

export function Tabs({ value, onValueChange, children, className = "" }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

export function TabsList({ children, className = "" }) {
  return (
    <div className={`inline-flex glass-card p-2 gap-2 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value: triggerValue, children, className = "" }) {
  const { value, onValueChange } = React.useContext(TabsContext);

  const isActive = value === triggerValue;

  return (
    <button
      onClick={() => onValueChange(triggerValue)}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out transform relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
          : "bg-transparent hover:bg-white/20 dark:hover:bg-black/20 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:scale-105"
      } ${className}`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 animate-shimmer"></div>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value: contentValue, children }) {
  const { value } = React.useContext(TabsContext);
  if (value !== contentValue) return null;
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}

// ------------------ TabsContext ------------------

const TabsContext = React.createContext({
  value: "",
  onValueChange: (_val) => {},
});

// Wrapper to provide context to all children
export function TabsWrapper({ value, onValueChange, children, className = "" }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}
