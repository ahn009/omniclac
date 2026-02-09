import React, { useState } from 'react';
import { Scale, Ruler } from 'lucide-react';

// --- Card Component ---
interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, className = '', children }) => (
  <div className={`bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h2>
    )}
    {description && (
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
    )}
    {children}
  </div>
);

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    <div className="relative rounded-lg shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
      )}
      <input
        className={`block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 dark:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-slate-400 dark:focus:ring-slate-500 sm:text-sm sm:leading-6 transition duration-150 ${Icon ? 'pl-10' : 'pl-4 pr-4'}`}
        {...props}
      />
    </div>
  </div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const getButtonStyles = (variant: 'primary' | 'outline' | 'danger' | 'ghost', size: 'md' | 'lg'): string => {
  const base = 'rounded-lg font-semibold transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base';

  switch (variant) {
    case 'primary':
      return `${base} bg-blue-600 text-white hover:bg-blue-700 shadow-md ${sizeClasses}`;
    case 'outline':
      return `${base} bg-white text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 ${sizeClasses}`;
    case 'danger':
      return `${base} bg-red-600 text-white hover:bg-red-700 shadow-md ${sizeClasses}`;
    case 'ghost':
      return `${base} text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 ${sizeClasses}`;
    default:
      return `${base} bg-blue-600 text-white hover:bg-blue-700 shadow-md ${sizeClasses}`;
  }
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => (
  <button
    className={`${getButtonStyles(variant, size)} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- BMICalculator Component ---
interface BMICategory {
  text: string;
  color: string;
  bg: string;
}

export const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setBmi(null);
      return;
    }

    let calculatedBmi: number;
    if (unit === 'metric') {
      calculatedBmi = w / ((h / 100) ** 2);
    } else {
      calculatedBmi = (w / (h ** 2)) * 703;
    }

    setBmi(Number(calculatedBmi.toFixed(1)));
  };

  const getBMICategory = (bmiValue: number | null): BMICategory | null => {
    if (bmiValue === null) return null;
    if (bmiValue < 18.5) return { text: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmiValue < 25) return { text: 'Normal Weight', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmiValue < 30) return { text: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Obesity', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const category = getBMICategory(bmi);

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    setWeight('');
    setHeight('');
    setBmi(null);
  };

  return (
    <div className="flex justify-center p-4">
      <Card
        title="BMI Calculator"
        description="Calculate your Body Mass Index."
        className="max-w-lg w-full"
      >
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg shadow-sm bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => handleUnitChange('metric')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  unit === 'metric'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                onClick={() => handleUnitChange('imperial')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  unit === 'imperial'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                Imperial (lb, in)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Weight (${unit === 'metric' ? 'kg' : 'lb'})`}
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? '70' : '154'}
              icon={Scale}
            />
            <Input
              label={`Height (${unit === 'metric' ? 'cm' : 'in'})`}
              type="number"
              step="0.1"
              min="0"
              value={height}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? '175' : '69'}
              icon={Ruler}
            />
          </div>

          <Button
            onClick={calculateBMI}
            disabled={!weight || !height}
            className="w-full"
            size="lg"
          >
            Calculate BMI
          </Button>

          {bmi !== null && category && (
            <div className={`pt-6 border-t border-slate-200 dark:border-slate-700 text-center rounded-xl p-4 ${category.bg} border`}>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your BMI</div>
              <div className="text-6xl font-extralight text-slate-900 dark:text-slate-100 mb-2">{bmi}</div>
              <div className={`text-xl font-semibold ${category.color} mb-4`}>
                {category.text}
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-300">
                <p className="font-semibold mb-2">BMI Categories:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-blue-600">Underweight: &lt;18.5</div>
                  <div className="text-green-600">Normal: 18.5 - 24.9</div>
                  <div className="text-orange-600">Overweight: 25.0 - 29.9</div>
                  <div className="text-red-600">Obesity: &ge;30.0</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};