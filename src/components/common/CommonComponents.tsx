import React from 'react';

// --- Card Component ---
interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, className = '', children }) => (
  <div className={`bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h2>
    )}
    {description && (
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{description}</p>
    )}
    {children}
  </div>
);

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        className={`block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500/20 dark:focus:ring-blue-400/20 sm:text-sm transition ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'ring-red-500' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
  </div>
);

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
    )}
    <select
      className={`block w-full rounded-lg border-0 py-2.5 px-4 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-blue-500/20 sm:text-sm transition ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  icon: Icon,
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = 'rounded-lg font-semibold transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700 shadow-md',
    outline: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </button>
  );
};

// --- RangeSlider Component ---
interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showValue?: boolean;
  unit?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ 
  label, 
  showValue = true, 
  unit = '', 
  value,
  className = '',
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {value}{unit}
          </span>
        )}
      </div>
    )}
    <input
      type="range"
      value={value}
      className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 ${className}`}
      {...props}
    />
  </div>
);

// --- ResultDisplay Component ---
interface ResultDisplayProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  label, 
  value, 
  subtext,
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
  };

  return (
    <div className={`rounded-xl p-6 border ${variants[variant]} text-center`}>
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{label}</div>
      <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</div>
      {subtext && <div className="text-sm text-slate-600 dark:text-slate-400">{subtext}</div>}
    </div>
  );
};

// --- ToggleGroup Component ---
interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({ 
  options, 
  value, 
  onChange,
  className = '' 
}) => (
  <div className={`inline-flex rounded-lg shadow-sm bg-slate-100 dark:bg-slate-800 p-1 ${className}`}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
          value === option.value
            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

// --- CardGrid Component ---
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({ 
  children, 
  columns = 2,
  className = '' 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
};
