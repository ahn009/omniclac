import React, { useState, useCallback } from 'react';
import { DollarSign } from 'lucide-react';

// --- Internal Common Components ---
interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-6 md:p-8 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h2>
    )}
    {description && (
      <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>
    )}
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, icon: Icon, className, ...props }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id || label.toLowerCase().replace(/\s/g, '-')} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
        )}
        <input
          {...props}
          id={props.id || label.toLowerCase().replace(/\s/g, '-')}
          className={`block w-full rounded-lg border-slate-300 dark:border-slate-600 border py-2 px-3 focus:border-blue-500 focus:ring-blue-500 text-base placeholder-slate-400 text-slate-900 dark:text-slate-100 transition duration-150 ${Icon ? 'pl-10' : 'pl-3'} ${className}`}
        />
      </div>
    </div>
  );
};

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: 'primary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}

const getVariantClasses = (variant: ButtonProps['variant']): string => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/50';
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-500/50';
    case 'outline':
      return 'bg-white text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 active:bg-slate-200';
    case 'ghost':
      return 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 active:bg-slate-200';
    default:
      return '';
  }
};

const Button: React.FC<ButtonProps> = ({ onClick, children, variant, disabled, className = '' }) => {
  const baseClasses = 'font-semibold rounded-xl transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = getVariantClasses(variant);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} px-4 py-2 ${className}`}
    >
      {children}
    </button>
  );
};

// --- Tip Calculator Component ---
export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = (bill * tipPercentage) / 100;
  const totalAmount = bill + tipAmount;
  const perPerson = numberOfPeople > 0 ? totalAmount / numberOfPeople : 0;

  const tipPresets = [10, 15, 18, 20, 25];

  const handleNumberOfPeopleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '' || /^\d+$/.test(value)) {
      let num = parseInt(value, 10) || 1;
      
      if (num < 1) {
        num = 1;
      }
      
      if (num > 100) {
        num = 100;
      }

      setNumberOfPeople(num);
    }
  }, []);
  
  const handleTipPercentageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const num = parseInt(rawValue, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setTipPercentage(num);
    }
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <Card title="Tip Calculator" description="Calculate tips and split bills">
        <div className="space-y-6">
          <div>
            <Input
              label="Bill Amount"
              type="number"
              min="0"
              step="0.01"
              value={billAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBillAmount(e.target.value)}
              placeholder="100.00"
              icon={DollarSign}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Tip Percentage: <span className="font-bold text-slate-900">{tipPercentage}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={tipPercentage}
              onChange={handleTipPercentageChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-lg"
            />
            
            <div className="flex justify-between gap-2 mt-4">
              {tipPresets.map((preset) => (
                <Button
                  key={preset}
                  variant={tipPercentage === preset ? 'primary' : 'outline'}
                  onClick={() => setTipPercentage(preset)}
                  className="flex-1 py-1"
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Input
              label="Number of People"
              type="number"
              min="1"
              step="1"
              value={numberOfPeople.toString()}
              onChange={handleNumberOfPeopleChange} 
              onBlur={() => {
                if (!numberOfPeople || numberOfPeople < 1) {
                  setNumberOfPeople(1);
                }
              }}
              placeholder="1"
            />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Bill Amount</span>
              <span className="text-lg font-medium text-slate-900">
                ${bill.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tip Percentage</span>
              <span className="text-lg font-medium text-slate-900">
                {tipPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Tip Amount</span>
              <span className="text-lg font-medium text-slate-900">
                ${tipAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-lg font-medium text-slate-900">Total Bill</span>
              <span className="text-2xl font-bold text-slate-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            {numberOfPeople > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <span className="text-slate-600">Each Person Pays ({numberOfPeople} people)</span>
                <span className="text-xl font-semibold text-slate-900">
                  ${perPerson.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};