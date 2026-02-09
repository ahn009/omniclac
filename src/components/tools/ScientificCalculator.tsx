import React, { useState, useCallback } from 'react';
import { Divide, X, Minus, Plus, Percent, Play, Maximize2 } from 'lucide-react';

// --- START: Inlined Common Components/Utilities for runnability ---

// Stand-in for common/Card
interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 ${className}`}>
    {title && <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h2>}
    {description && <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>}
    {children}
  </div>
);

// Custom button specifically for the calculator grid
interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  title?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  title 
}) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-4 text-xl font-light bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-200 transition duration-100 active:bg-slate-300 ${className}`}
  >
    {children}
  </button>
);

// --- END: Inlined Common Components/Utilities for runnability ---

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isDeg, setIsDeg] = useState<boolean>(true); // For Degrees vs Radians

  const formatResult = (value: number): string => {
    // Return to fixed if floating point errors are present, then convert to string
    return parseFloat(value.toFixed(10)).toString();
  };

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      if (display.length < 15) {
        setDisplay(display === '0' || display === 'Error' ? digit : display + digit);
      }
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHistory([]);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(prev => {
      const value = parseFloat(prev);
      if (isNaN(value)) return prev;
      return formatResult(-value);
    });
  }, []);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    if (isNaN(value)) return;
    setDisplay(formatResult(value / 100));
  }, [display]);

  const calculate = useCallback(() => {
    const inputValue = parseFloat(display);
    if (prevValue === null || operator === null || waitingForOperand) {
      return;
    }

    let newValue: number;
    const equation = `${prevValue} ${operator} ${inputValue} = `;

    try {
      switch (operator) {
        case '+':
          newValue = prevValue + inputValue;
          break;
        case '-':
          newValue = prevValue - inputValue;
          break;
        case '×':
          newValue = prevValue * inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            setDisplay('Error');
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(true);
            return;
          }
          newValue = prevValue / inputValue;
          break;
        case 'y√x': // Root
          newValue = Math.pow(inputValue, 1 / prevValue); // prevValue is y
          break;
        case 'y^x': // Exponent
          newValue = Math.pow(prevValue, inputValue);
          break;
        default:
          return;
      }

      const resultString = formatResult(newValue);
      setDisplay(resultString);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      setHistory(prev => [`${equation}${resultString}`, ...prev.slice(0, 4)]);

    } catch (e) {
      setDisplay('Error');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  }, [display, prevValue, operator, waitingForOperand]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      calculate();
      setPrevValue(parseFloat(display));
    }
    
    setOperator(nextOperator);
    setWaitingForOperand(true);
    if (prevValue !== null && operator) {
      setPrevValue(parseFloat(display));
    } else {
      setPrevValue(inputValue);
    }

  }, [display, prevValue, operator, calculate]);

  const performFunction = useCallback((func: string) => {
    const value = parseFloat(display);
    if (isNaN(value)) return;

    let newValue: number;
    let funcDisplay: string = '';
    const angle = isDeg ? value * (Math.PI / 180) : value; // Convert to radians if necessary

    try {
      switch (func) {
        case 'sqrt':
          newValue = Math.sqrt(value);
          funcDisplay = `sqrt(${value}) = `;
          break;
        case 'sin':
          newValue = Math.sin(angle);
          funcDisplay = `sin(${value}${isDeg ? '°' : ''}) = `;
          break;
        case 'cos':
          newValue = Math.cos(angle);
          funcDisplay = `cos(${value}${isDeg ? '°' : ''}) = `;
          break;
        case 'tan':
          newValue = Math.tan(angle);
          funcDisplay = `tan(${value}${isDeg ? '°' : ''}) = `;
          break;
        case 'log':
          newValue = Math.log10(value);
          funcDisplay = `log(${value}) = `;
          break;
        case 'ln':
          newValue = Math.log(value);
          funcDisplay = `ln(${value}) = `;
          break;
        case 'e^x':
          newValue = Math.exp(value);
          funcDisplay = `e^(${value}) = `;
          break;
        case 'x^2':
          newValue = value * value;
          funcDisplay = `${value}^2 = `;
          break;
        case '1/x':
          newValue = 1 / value;
          funcDisplay = `1/(${value}) = `;
          break;
        default:
          return;
      }
      const resultString = formatResult(newValue);
      setDisplay(resultString);
      setWaitingForOperand(true);
      setHistory(prev => [`${funcDisplay}${resultString}`, ...prev.slice(0, 4)]);
    } catch (e) {
      setDisplay('Error');
      setWaitingForOperand(true);
    }
  }, [display, isDeg]);

  const inputConstant = useCallback((constant: string) => {
    let value: number;
    let constDisplay: string = '';

    switch(constant) {
      case 'Pi':
        value = Math.PI;
        constDisplay = 'π = ';
        break;
      case 'e':
        value = Math.E;
        constDisplay = 'e = ';
        break;
      default:
        return;
    }
    const resultString = formatResult(value);
    setDisplay(resultString);
    setWaitingForOperand(true);
    setHistory(prev => [`${constDisplay}${resultString}`, ...prev.slice(0, 4)]);
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-4 sm:p-6 space-y-4">
        {/* Display and History */}
        <div className="text-right">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{isDeg ? 'DEG' : 'RAD'}</span>
            {history.length > 0 && (
              <span className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                {history[0]}
              </span>
            )}
          </div>
          
          <div 
            className="text-4xl font-light text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-nowrap [direction:rtl]"
            style={{ minHeight: '48px' }}
          >
            {display}
          </div>
          {operator && prevValue !== null && (
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              {prevValue} {operator}
            </div>
          )}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1: Functions */}
          <CalculatorButton 
            onClick={() => setIsDeg(prev => !prev)}
            className={isDeg ? "bg-blue-200 text-blue-800" : "bg-slate-200 text-slate-800"}
            title="Toggle Degrees/Radians"
          >
            {isDeg ? 'DEG' : 'RAD'}
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('x^2')} title="Square">
            x²
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('1/x')} title="Inverse">
            1/x
          </CalculatorButton>
          <CalculatorButton 
            onClick={clearAll}
            className="bg-red-200 text-red-800 hover:bg-red-300 col-span-2"
          >
            AC
          </CalculatorButton>

          {/* Row 2: Trig and Advanced Ops */}
          <CalculatorButton onClick={() => performFunction('sin')} title="Sine">
            sin
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('cos')} title="Cosine">
            cos
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('tan')} title="Tangent">
            tan
          </CalculatorButton>
          <CalculatorButton onClick={toggleSign} title="Change Sign">
            +/-
          </CalculatorButton>
          <CalculatorButton 
            onClick={() => performOperation('÷')}
            className="bg-orange-400 text-white hover:bg-orange-500"
            title="Divide"
          >
            <Divide size={20} className="mx-auto" />
          </CalculatorButton>

          {/* Row 3: Log, Constants, and Numbers 7, 8, 9 */}
          <CalculatorButton onClick={() => performFunction('log')} title="Log Base 10">
            log
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('ln')} title="Natural Log">
            ln
          </CalculatorButton>
          <CalculatorButton onClick={() => inputConstant('Pi')} title="Pi">
            <Play size={20} className="mx-auto" />
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('9')}>9</CalculatorButton>
          <CalculatorButton 
            onClick={() => performOperation('×')}
            className="bg-orange-400 text-white hover:bg-orange-500"
            title="Multiply"
          >
            <X size={20} className="mx-auto" />
          </CalculatorButton>

          {/* Row 4: Power, Root, and Numbers 4, 5, 6 */}
          <CalculatorButton onClick={() => performOperation('y^x')} title="Power">
            <Maximize2 size={16} className="inline mr-1" />
            <span className='text-base'>^</span>
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('y√x')} title="Nth Root">
            y√x
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('e^x')} title="e to the power of x">
            e^x
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('6')}>6</CalculatorButton>
          <CalculatorButton 
            onClick={() => performOperation('-')}
            className="bg-orange-400 text-white hover:bg-orange-500"
            title="Subtract"
          >
            <Minus size={20} className="mx-auto" />
          </CalculatorButton>

          {/* Row 5: Remaining numbers and Equals */}
          <CalculatorButton onClick={inputPercent} title="Percent">
            <Percent size={20} className="mx-auto" />
          </CalculatorButton>
          <CalculatorButton onClick={() => performFunction('sqrt')} title="Square Root">
            √
          </CalculatorButton>
          <CalculatorButton onClick={() => inputConstant('e')} title="Euler's Number">
            e
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit('3')}>3</CalculatorButton>
          <CalculatorButton 
            onClick={() => performOperation('+')}
            className="bg-orange-400 text-white hover:bg-orange-500"
            title="Add"
          >
            <Plus size={20} className="mx-auto" />
          </CalculatorButton>

          {/* Row 6: 0 and Decimal */}
          <CalculatorButton 
            onClick={() => inputDigit('0')}
            className="col-span-3"
          >
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDecimal} title="Decimal Point">.</CalculatorButton>
          <CalculatorButton
            onClick={calculate}
            className="bg-slate-900 text-white hover:bg-slate-800"
            title="Equals"
          >
            =
          </CalculatorButton>
        </div>
      </Card>
    </div>
  );
};