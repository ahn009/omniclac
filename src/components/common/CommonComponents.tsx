import React, { useId } from 'react';

// --- Card Component ---
interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, className = '', children }) => (
  <div className={`panel-3d p-6 md:p-8 animate-enter ${className}`}>
    {title && (
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">{title}</h2>
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

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', id, ...props }) => {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
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
          id={inputId}
          className={`block w-full rounded-xl border-0 py-2.5 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm shadow-elevation-1 ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', id, ...props }) => {
  const generatedId = useId();
  const selectId = id ?? `select-${generatedId}`;
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm shadow-elevation-1 ${className}`}
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
};

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning' | 'ghost';
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
  const baseStyles = 'rounded-xl font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

  const variants = {
    primary: 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white hover:from-indigo-400 hover:to-indigo-600 shadow-elevation-2',
    secondary: 'bg-gradient-to-b from-slate-500 to-slate-600 text-white hover:from-slate-400 hover:to-slate-600 shadow-elevation-2',
    outline: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-elevation-1',
    danger: 'bg-gradient-to-b from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-600 shadow-elevation-2',
    warning: 'bg-gradient-to-b from-orange-400 to-orange-500 text-white hover:from-orange-300 hover:to-orange-500 shadow-elevation-2',
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

// --- CalcKey: tactile 3D calculator key ---
interface CalcKeyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'digit' | 'operator' | 'action' | 'equals' | 'danger';
}

export const CalcKey: React.FC<CalcKeyProps> = ({
  variant = 'digit',
  className = '',
  children,
  ...props
}) => {
  const variantClass = {
    digit: '',
    operator: 'key-3d-operator',
    action: 'key-3d-action',
    equals: 'key-3d-equals',
    danger: 'key-3d-danger',
  }[variant];

  return (
    <button
      className={`key-3d ${variantClass} px-2 py-4 text-2xl text-slate-800 dark:text-slate-100 flex items-center justify-center ${className}`}
      {...props}
    >
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
  id,
  ...props
}) => {
  const generatedId = useId();
  const sliderId = id ?? `range-${generatedId}`;
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label htmlFor={sliderId} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tnum">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        value={value}
        className={`slider-3d w-full cursor-pointer ${className}`}
        {...props}
      />
    </div>
  );
};

// --- ResultDisplay Component ---
interface ResultDisplayProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  label,
  value,
  subtext,
  variant = 'default'
}) => {
  const variants = {
    default: 'from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700',
    success: 'from-emerald-50 to-emerald-100/60 dark:from-emerald-950/60 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800',
    warning: 'from-orange-50 to-orange-100/60 dark:from-orange-950/60 dark:to-orange-900/30 border-orange-200 dark:border-orange-800',
    danger: 'from-red-50 to-red-100/60 dark:from-red-950/60 dark:to-red-900/30 border-red-200 dark:border-red-800',
    info: 'from-indigo-50 to-violet-100/60 dark:from-indigo-950/60 dark:to-violet-900/30 border-indigo-200 dark:border-indigo-800',
  };

  return (
    <div className={`rounded-2xl p-6 border bg-gradient-to-b ${variants[variant]} text-center shadow-elevation-1`}>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{label}</div>
      <div className="font-display text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1 tnum">{value}</div>
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
  <div className={`inline-flex rounded-2xl shadow-inset bg-slate-200/70 dark:bg-slate-800 p-1.5 ${className}`} role="group">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        aria-pressed={value === option.value}
        className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
          value === option.value
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-elevation-1'
            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300'
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
