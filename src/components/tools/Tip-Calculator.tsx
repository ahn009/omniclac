import React, { useState, useCallback } from 'react';
import { DollarSign } from 'lucide-react';
import { Card, Input, Button, ResultDisplay, CardGrid } from '../common/CommonComponents';

// --- Tip Calculator Component ---
export const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);

  const rawBill = parseFloat(billAmount) || 0;
  // Bill amounts are never negative — clamp rather than showing negative tips.
  const bill = Math.max(0, rawBill);
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBillAmount(e.target.value.replace(/^-/, ''))}
              placeholder="100.00"
              icon={DollarSign}
            />
          </div>

          <div>
            <label htmlFor="tip-percentage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Tip Percentage: <span className="font-bold text-slate-900 dark:text-slate-100 tnum">{tipPercentage}%</span>
            </label>
            <input
              id="tip-percentage"
              type="range"
              min="0"
              max="100"
              step="1"
              value={tipPercentage}
              onChange={handleTipPercentageChange}
              className="slider-3d w-full cursor-pointer"
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

          <Input
            label="Number of People"
            type="number"
            min="1"
            value={numberOfPeople.toString()}
            onChange={handleNumberOfPeopleChange} 
            onBlur={() => {
              if (!numberOfPeople || numberOfPeople < 1) {
                setNumberOfPeople(1);
              }
            }}
            placeholder="1"
          />

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <CardGrid columns={2}>
              <ResultDisplay label="Tip Amount" value={`$${tipAmount.toFixed(2)}`} />
              <ResultDisplay label="Total Bill" value={`$${totalAmount.toFixed(2)}`} variant="success" />
            </CardGrid>
            {numberOfPeople > 1 && (
              <div className="mt-4">
                <ResultDisplay 
                  label={`Per Person (${numberOfPeople} people)`} 
                  value={`$${perPerson.toFixed(2)}`}
                  variant="default"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};