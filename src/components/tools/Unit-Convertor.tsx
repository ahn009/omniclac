import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Ruler, Scale, Thermometer, Box } from 'lucide-react';
import { Card, Input, Button, Select } from '../common/CommonComponents';

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
          <div className="flex justify-around bg-slate-100 dark:bg-slate-800 p-2 rounded-xl gap-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    cat.id === category
                      ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700 shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
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
            
            <Select
              label="From Unit"
              value={fromUnit}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFromUnit(e.target.value)}
              options={unitsByCategory[category].map(unit => ({
                value: unit,
                label: unit.charAt(0).toUpperCase() + unit.slice(1)
              }))}
            />
          </div>
          
          <Button
            onClick={swapUnits}
            variant="outline"
            icon={ArrowLeftRight}
            fullWidth
          >
            Swap Units
          </Button>

          {/* Converted Value Display */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Result in {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}</div>
              <div className="text-5xl font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
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