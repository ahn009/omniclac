import React, { useState, useCallback } from 'react';
import { DollarSign, Percent, Clock } from 'lucide-react';

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

// --- Financial Types ---
interface PaymentInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// --- Financial Utilities ---
const calculateMortgagePayment = ({ loanAmount, interestRate, loanTerm }: PaymentInputs): number => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  if (monthlyRate === 0) {
    return loanAmount / numberOfPayments;
  }

  const powerTerm = (1 + monthlyRate) ** numberOfPayments;
  return loanAmount * (monthlyRate * powerTerm) / (powerTerm - 1);
};

const calculateAmortizationSchedule = ({ loanAmount, interestRate, loanTerm }: PaymentInputs): AmortizationEntry[] => {
  const monthlyPayment = calculateMortgagePayment({ loanAmount, interestRate, loanTerm });
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let balance = loanAmount;
  const schedule: AmortizationEntry[] = [];

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = monthlyPayment - interestPaid;
    balance = balance - principalPaid;

    schedule.push({
      month,
      principal: Math.max(0, principalPaid),
      interest: Math.max(0, interestPaid),
      remainingBalance: Math.max(0, balance),
    });
  }

  return schedule;
};

const validateMortgageInput = (loanAmount: number, interestRate: number, loanTerm: number): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (loanAmount <= 0) {
    errors.push('Loan Amount must be greater than 0.');
  }
  if (interestRate < 0) {
    errors.push('Interest Rate cannot be negative.');
  }
  if (loanTerm <= 0 || loanTerm > 60) {
    errors.push('Loan Term must be between 1 and 60 years.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// --- MortgageCalculator Component ---
interface MortgageFormData {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
}

interface CalculationResults {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortization: AmortizationEntry[];
}

export const MortgageCalculator: React.FC = () => {
  const [formData, setFormData] = useState<MortgageFormData>({
    loanAmount: '250000',
    interestRate: '3.5',
    loanTerm: '30'
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const calculateMortgage = useCallback(() => {
    const loanAmount = parseFloat(formData.loanAmount);
    const interestRate = parseFloat(formData.interestRate);
    const loanTerm = parseFloat(formData.loanTerm);

    const validation = validateMortgageInput(loanAmount, interestRate, loanTerm);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setResults(null);
      return;
    }

    const monthlyPayment = calculateMortgagePayment({
      loanAmount,
      interestRate,
      loanTerm
    });
    
    const amortization = calculateAmortizationSchedule({
      loanAmount,
      interestRate,
      loanTerm
    });

    const totalCost = amortization.reduce((sum, entry) => sum + entry.principal + entry.interest, 0);
    const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0);
    
    setResults({
      monthlyPayment,
      totalCost,
      totalInterest,
      amortization,
    });
  }, [formData]);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Loan Details" description="Enter the parameters for your mortgage.">
          <div className="space-y-6">
            <Input
              label="Loan Amount ($)"
              name="loanAmount"
              type="number"
              min="1"
              step="1000"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="250000"
              icon={DollarSign}
            />
            <Input
              label="Annual Interest Rate (%)"
              name="interestRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.interestRate}
              onChange={handleChange}
              placeholder="3.5"
              icon={Percent}
            />
            <Input
              label="Loan Term (Years)"
              name="loanTerm"
              type="number"
              min="1"
              max="60"
              step="1"
              value={formData.loanTerm}
              onChange={handleChange}
              placeholder="30"
              icon={Clock}
            />

            <Button onClick={calculateMortgage} className="w-full" size="lg">
              Calculate Mortgage
            </Button>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <ul className="list-disc list-inside text-sm">
                  {errors.map((error, index) => <li key={index}>{error}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {results && (
          <Card title="Payment Results" description="Summary of your monthly payments and total cost.">
            <div className="space-y-6">
              <div className="text-center py-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estimated Monthly Payment</div>
                <div className="text-5xl font-extralight text-slate-900">
                  {formatCurrency(results.monthlyPayment)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Principal</div>
                  <div className="text-xl font-medium text-slate-900">
                    {formatCurrency(parseFloat(formData.loanAmount))}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Interest Paid</div>
                  <div className="text-xl font-medium text-slate-900">
                    {formatCurrency(results.totalInterest)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Total Cost</div>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(results.totalCost)}
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Amortization Snapshot (First 5 Months)</h4>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {results.amortization.slice(0, 5).map((month) => (
                    <div
                      key={month.month}
                      className="flex justify-between items-center text-sm py-1 border-b border-dashed border-slate-100 last:border-b-0"
                    >
                      <span className="text-slate-600 dark:text-slate-400 font-mono w-10">M{month.month}</span>
                      <div className="flex gap-4">
                        <span className="text-slate-900">
                          P: {formatCurrency(month.principal)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                          I: {formatCurrency(month.interest)}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Bal: {formatCurrency(month.remainingBalance)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {results.amortization.length > 5 && (
                    <div className="text-center text-slate-500 dark:text-slate-400 text-xs pt-2">
                      ... {results.amortization.length - 5} more payments
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};