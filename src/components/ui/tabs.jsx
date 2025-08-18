import React from "react";

export function Tabs({ value, onValueChange, children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value: triggerValue, children, className = "" }) {
  const { value, onValueChange } = React.useContext(TabsContext);

  const isActive = value === triggerValue;

  return (
    <button
      onClick={() => onValueChange(triggerValue)}
      className={`px-4 py-2 border rounded transition-all ${
        isActive
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-gray-100 hover:bg-gray-200 text-black"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: contentValue, children }) {
  const { value } = React.useContext(TabsContext);
  if (value !== contentValue) return null;
  return <div className="mt-4">{children}</div>;
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
