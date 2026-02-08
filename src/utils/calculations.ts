// Define types inline since @/types is not available
interface MortgageInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

interface BMIData {
  weight: number;
  height: number;
  unit: 'metric' | 'imperial';
}

interface UnitConversion {
  category: 'length' | 'weight' | 'temperature' | 'volume';
}

export const calculateMortgagePayment = (input: MortgageInput): number => {
  const { loanAmount, interestRate, loanTerm } = input;
  
  if (interestRate === 0) {
    return loanAmount / (loanTerm * 12);
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const compoundedRate = Math.pow(1 + monthlyRate, numberOfPayments);
  
  return (loanAmount * compoundedRate * monthlyRate) / (compoundedRate - 1);
};

export const calculateTotalMortgageCost = (monthlyPayment: number, loanTerm: number): number => {
  return monthlyPayment * loanTerm * 12;
};

export const calculateBMI = (data: BMIData): number => {
  const { weight, height, unit } = data;
  
  if (unit === 'metric') {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  } else {
    // Imperial: weight in lb, height in inches
    return (weight / (height * height)) * 703;
  }
};

export const calculateTip = (
  billAmount: number,
  tipPercentage: number,
  numberOfPeople: number
): {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
} => {
  const tipAmount = (billAmount * tipPercentage) / 100;
  const totalAmount = billAmount + tipAmount;
  const perPerson = totalAmount / numberOfPeople;
  
  return {
    tipAmount,
    totalAmount,
    perPerson
  };
};

export const convertUnits = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: UnitConversion['category']
): number => {
  const conversions = {
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

  if (category === 'temperature') {
    // Convert to Celsius first
    let celsius = value;
    if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
    if (fromUnit === 'kelvin') celsius = value - 273.15;
    
    // Convert from Celsius to target
    const converter = conversions.temperature[toUnit as keyof typeof conversions.temperature];
    return converter(celsius);
  }

  const categoryConversions = conversions[category];
  const fromFactor = categoryConversions[fromUnit as keyof typeof categoryConversions];
  const toFactor = categoryConversions[toUnit as keyof typeof categoryConversions];
  
  if (!fromFactor || !toFactor) {
    throw new Error(`Invalid units for ${category} conversion`);
  }
  
  return (value / fromFactor) * toFactor;
};

export const calculateAmortizationSchedule = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> => {
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = calculateMortgagePayment({ loanAmount, interestRate, loanTerm });
  
  const schedule = [];
  let balance = loanAmount;
  
  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance)
    });
  }
  
  return schedule;
};