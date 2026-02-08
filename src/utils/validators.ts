export const validateNumber = (value: string, min?: number, max?: number): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateMortgageInput = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (loanAmount <= 0) errors.push('Loan amount must be greater than 0');
  if (interestRate < 0) errors.push('Interest rate cannot be negative');
  if (interestRate > 100) errors.push('Interest rate cannot exceed 100%');
  if (loanTerm <= 0) errors.push('Loan term must be greater than 0');
  if (loanTerm > 50) errors.push('Loan term cannot exceed 50 years');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBMIInput = (
  weight: number,
  height: number,
  unit: 'metric' | 'imperial'
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const minWeight = unit === 'metric' ? 10 : 22;
  const maxWeight = unit === 'metric' ? 300 : 660;
  const minHeight = unit === 'metric' ? 50 : 20;
  const maxHeight = unit === 'metric' ? 300 : 120;
  
  if (weight < minWeight || weight > maxWeight) {
    errors.push(`Weight must be between ${minWeight} and ${maxWeight} ${unit === 'metric' ? 'kg' : 'lb'}`);
  }
  
  if (height < minHeight || height > maxHeight) {
    errors.push(`Height must be between ${minHeight} and ${maxHeight} ${unit === 'metric' ? 'cm' : 'in'}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCountdownInput = (
  hours: number,
  minutes: number,
  seconds: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (hours < 0 || hours > 99) errors.push('Hours must be between 0 and 99');
  if (minutes < 0 || minutes > 59) errors.push('Minutes must be between 0 and 59');
  if (seconds < 0 || seconds > 59) errors.push('Seconds must be between 0 and 59');
  if (hours === 0 && minutes === 0 && seconds === 0) {
    errors.push('Timer must be set to at least 1 second');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};