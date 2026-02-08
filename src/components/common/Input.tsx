import React, { forwardRef } from 'react';
// Update the import or define the correct type for IconComponent
// Assuming the import 'lucide-react' brings in the Icon component
interface IconProps {
  className?: string;
}

type IconComponent = React.FC<IconProps> | React.ComponentType<{ className?: string }>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  // Change type from LucideIcon to a proper React Component Type
  icon?: IconComponent; 
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-${Icon ? '10' : '4'} py-2.5 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
              ${error ? 'border-red-500' : 'border-slate-300'}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';