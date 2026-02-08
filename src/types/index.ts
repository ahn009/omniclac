import { ComponentType } from 'react';

export type Category = 'Time' | 'Finance' | 'Health' | 'Math';

export interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  icon: ComponentType<{ className?: string }>;
  description?: string;
}

export interface Lap {
  id: number;
  time: number;
  label?: string;
}

export interface TimerState {
  isRunning: boolean;
  time: number;
  startTime: number | null;
}

export interface MortgageInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export interface BMIData {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

export interface UnitConversion {
  category: 'length' | 'weight' | 'temperature' | 'volume';
  fromUnit: string;
  toUnit: string;
  value: number;
}

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForOperand: boolean;
}

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}