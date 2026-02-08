// Define types inline since @/types is not available
interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  icon: any; // Using 'any' for Lucide icons since we can't import the specific type
  description: string;
}

type Category = 'Time' | 'Finance' | 'Health' | 'Math';

import {
  Clock, Coffee, Bell, Home, DollarSign,
  Activity, Calculator, ArrowLeftRight
} from 'lucide-react';

export const TOOLS: Record<string, ToolDefinition> = {
  stopwatch: {
    id: 'stopwatch',
    name: 'Stopwatch',
    category: 'Time',
    icon: Clock,
    description: 'Precise stopwatch with lap functionality'
  },
  pomodoro: {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    category: 'Time',
    icon: Coffee,
    description: 'Focus timer with work/break intervals'
  },
  countdown: {
    id: 'countdown',
    name: 'Countdown Timer',
    category: 'Time',
    icon: Bell,
    description: 'Custom countdown timer with alarms'
  },
  mortgage: {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    category: 'Finance',
    icon: Home,
    description: 'Calculate monthly mortgage payments'
  },
  tip: {
    id: 'tip',
    name: 'Tip Calculator',
    category: 'Finance',
    icon: DollarSign,
    description: 'Calculate tips and split bills'
  },
  bmi: {
    id: 'bmi',
    name: 'BMI Calculator',
    category: 'Health',
    icon: Activity,
    description: 'Calculate Body Mass Index'
  },
  calculator: {
    id: 'calculator',
    name: 'Standard Calculator',
    category: 'Math',
    icon: Calculator,
    description: 'Basic arithmetic calculator'
  },
  unitconverter: {
    id: 'unitconverter',
    name: 'Unit Converter',
    category: 'Math',
    icon: ArrowLeftRight,
    description: 'Convert between different units'
  }
} as const;

export const CATEGORIES: Category[] = ['Time', 'Finance', 'Health', 'Math'];

export const UNIT_CONVERSIONS = {
  length: {
    meters: 1,
    feet: 3.28084,
    inches: 39.3701,
    kilometers: 0.001,
    miles: 0.000621371,
    centimeters: 100,
    millimeters: 1000,
    yards: 1.09361
  },
  weight: {
    kilograms: 1,
    pounds: 2.20462,
    ounces: 35.274,
    grams: 1000,
    stones: 0.157473
  },
  temperature: {
    celsius: (v: number) => v,
    fahrenheit: (v: number) => (v * 9/5) + 32,
    kelvin: (v: number) => v + 273.15
  },
  volume: {
    liters: 1,
    milliliters: 1000,
    gallons: 0.264172,
    quarts: 1.05669,
    pints: 2.11338,
    cups: 4.22675
  }
} as const;

export const BMI_CATEGORIES = [
  { max: 16, label: 'Severe Thinness', color: 'text-red-600' },
  { max: 17, label: 'Moderate Thinness', color: 'text-orange-600' },
  { max: 18.5, label: 'Mild Thinness', color: 'text-yellow-600' },
  { max: 25, label: 'Normal', color: 'text-green-600' },
  { max: 30, label: 'Overweight', color: 'text-yellow-600' },
  { max: 35, label: 'Obese Class I', color: 'text-orange-600' },
  { max: 40, label: 'Obese Class II', color: 'text-red-600' },
  { max: Infinity, label: 'Obese Class III', color: 'text-red-700' }
] as const;