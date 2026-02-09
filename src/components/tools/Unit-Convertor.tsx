import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Ruler, Scale, Thermometer, Box } from 'lucide-react';

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

// --- Unit Converter Component ---
type Category = 'length' | 'weight' | 'temperature' | 'volume';

interface CategoryConfig {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const UnitConverter: React.FC = () => {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('feet');
  const [category, setCategory] = useState<Category>('length');

  const categories: CategoryConfig[] = [
    { id: 'length', label: 'Length', icon: Ruler },
    { id: 'weight', label: 'Weight', icon: Scale },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'volume', label: 'Volume', icon: Box },
  ];

  const unitsByCategory = useMemo(() => ({
    length: ['meters', 'feet', 'inches', 'kilometers', 'miles', 'centimeters', 'millimeters', 'yards'],
    weight: ['kilograms', 'pounds', 'ounces', 'grams', 'stones'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    volume: ['liters', 'milliliters', 'gallons', 'quarts', 'pints', 'cups']
  }), []);

  const conversionFactors = useMemo(() => ({
    length: { 
      meters: 1, feet: 3.28084, inches: 39.3701, kilometers: 0.001, miles: 0.000621371,
      centimeters: 100, millimeters: 1000, yards: 1.09361
    },
    weight: { 
      kilograms: 1, pounds: 2.20462, ounces: 35.274, grams: 1000, stones: 0.157473
    },
    volume: { 
      liters: 1, milliliters: 1000, gallons: 0.264172, quarts: 1.05669, pints: 2.11338, cups: 4.22675 
    }
  }), []);

  const convertValue = useMemo(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (category === 'temperature') {
      const CtoK = (c: number): number => c + 273.15;
      const KtoC = (k: number): number => k - 273.15;
      const CtoF = (c: number): number => c * 9/5 + 32;
      const FtoC = (f: number): number => (f - 32) * 5/9;
      
      let baseCelsius: number;

      if (fromUnit === 'celsius') baseCelsius = numValue;
      else if (fromUnit === 'fahrenheit') baseCelsius = FtoC(numValue);
      else if (fromUnit === 'kelvin') baseCelsius = KtoC(numValue);
      else return 'Error';

      let result: number;
      if (toUnit === 'celsius') result = baseCelsius;
      else if (toUnit === 'fahrenheit') result = CtoF(baseCelsius);
      else if (toUnit === 'kelvin') result = CtoK(baseCelsius);
      else return 'Error';

      return result.toFixed(2);
    }
    
    const factors = conversionFactors[category as keyof Omit<typeof conversionFactors, 'temperature'>];

    if (!factors || !(fromUnit in factors) || !(toUnit in factors)) {
      return 'N/A';
    }

    const fromFactor = factors[fromUnit as keyof typeof factors];
    const toFactor = factors[toUnit as keyof typeof factors];
    
    const baseValue = numValue / fromFactor;
    const result = baseValue * toFactor;

    let precision = 2;
    if (result < 1 && result > 0) {
      precision = 4;
    }
    
    return result.toFixed(precision);

  }, [value, fromUnit, toUnit, category, conversionFactors]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setValue('1');
    const newUnits = unitsByCategory[newCategory];
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1] || newUnits[0]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="flex justify-center p-4">
      <Card 
        title="Unit Converter" 
        description="Convert between different units of measurement."
        className="max-w-xl w-full"
      >
        <div className="space-y-6">
          {/* Category Selection */}
          <div className="flex justify-around bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150 ${
                    cat.id === category
                      ? 'text-blue-600 bg-white dark:bg-slate-900 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Input and Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Value to Convert"
              type="number"
              min="0"
              step="any"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              placeholder="1"
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                From Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFromUnit(e.target.value)}
                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-slate-100 ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-slate-400 dark:focus:ring-slate-500 sm:text-sm sm:leading-6 transition duration-150"
              >
                {unitsByCategory[category].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button
            onClick={swapUnits}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            size="md"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Swap Units
          </Button>

          {/* Converted Value Display */}
          <div className="pt-6 border-t border-slate-200">
            <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Result in {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}</div>
              <div className="text-5xl font-extralight font-mono text-slate-900 dark:text-slate-100 mb-2">
                {convertValue}
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
              <p>
                {value || '0'} {fromUnit} = {convertValue || '0'} {toUnit}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};