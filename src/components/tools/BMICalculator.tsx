import React, { useState } from 'react';
import { Scale, Ruler } from 'lucide-react';
import { Card, Input, Button, ToggleGroup } from '../common/CommonComponents';

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
          <div className="flex justify-center">
            <ToggleGroup
              options={[
                { value: 'metric', label: 'Metric (kg, cm)' },
                { value: 'imperial', label: 'Imperial (lb, in)' }
              ]}
              value={unit}
              onChange={(val) => handleUnitChange(val as 'metric' | 'imperial')}
            />
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
            fullWidth
            size="lg"
          >
            Calculate BMI
          </Button>

          {bmi !== null && category && (
            <div className={`pt-6 border-t border-slate-200 dark:border-slate-700 text-center rounded-xl p-6 ${category.bg} dark:${category.bg.replace('50', '900/20')} border`}>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your BMI</div>
              <div className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">{bmi}</div>
              <div className={`text-xl font-semibold ${category.color} dark:${category.color.replace('600', '400')} mb-4`}>
                {category.text}
              </div>
              
              <div className="text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-300 dark:border-slate-600">
                <p className="font-semibold mb-2">BMI Categories:</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-blue-600 dark:text-blue-400">Underweight: &lt;18.5</div>
                  <div className="text-green-600 dark:text-green-400">Normal: 18.5 - 24.9</div>
                  <div className="text-orange-600 dark:text-orange-400">Overweight: 25.0 - 29.9</div>
                  <div className="text-red-600 dark:text-red-400">Obesity: &ge;30.0</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};