import React from 'react';

interface ToolCardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  className = '', 
  children 
}) => (
  <div className={`bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h2>
    )}
    {description && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
    )}
    {children}
  </div>
);

interface ToolInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ToolInput: React.FC<ToolInputProps> = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition`}
      />
    </div>
  </div>
);

interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const ToolButton: React.FC<ToolButtonProps> = ({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  const variantClasses = variant === 'primary'
    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 focus:ring-slate-400"
    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-400";
  
  return (
    <button {...props} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

interface ToolSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const ToolSelect: React.FC<ToolSelectProps> = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <select
      {...props}
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
