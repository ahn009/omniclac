import React, { useState, useCallback, useEffect } from 'react';

// --- Internal Common Components ---
interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '' }) => (
  <div className={`bg-white shadow-xl rounded-2xl p-6 md:p-8 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
    )}
    {description && (
      <p className="text-slate-600 mb-6">{description}</p>
    )}
    {children}
  </div>
);

interface CalculatorButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, children, className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-4 text-2xl font-semibold rounded-xl transition duration-150 ease-in-out bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 shadow-md ${className}`}
  >
    {children}
  </button>
);

// --- Standard Calculator Logic ---
export const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const formatDisplay = (value: number): string => {
    const s = value.toString();
    if (s.length > 12) {
      return value.toPrecision(10).replace(/\.?0+e/, 'e');
    }
    return s;
  };

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      if (display === '0' && digit === '0') return;
      setDisplay(display === '0' ? digit : display + digit);
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
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(formatDisplay(-value));
    }
  }, [display]);

  const calculate = useCallback(() => {
    const inputValue = parseFloat(display);

    if (prevValue === null || operator === null) {
      return;
    }

    const currentValue = prevValue;
    let newValue: number;

    try {
      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            setDisplay('Error: Div by 0');
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(false);
            return;
          }
          newValue = currentValue / inputValue;
          break;
        default:
          return;
      }
      setPrevValue(newValue);
      setDisplay(formatDisplay(newValue));
      setOperator(null);
      setWaitingForOperand(true);
    } catch {
      setDisplay('Error');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
  }, [display, prevValue, operator]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      calculate();
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }, [display, prevValue, operator, calculate]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['/', '*', '-', '+', '='].includes(event.key) || event.key === 'Enter') {
        event.preventDefault();
      }

      if (/[0-9]/.test(event.key)) {
        inputDigit(event.key);
      } else if (event.key === '.') {
        inputDecimal();
      } else if (event.key === 'Escape') {
        clearAll();
      } else if (event.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 && prev !== '0' && prev !== 'Error' ? prev.slice(0, -1) : '0');
        setWaitingForOperand(false);
      } else if (['+', '-', '*', '/'].includes(event.key)) {
        const op = event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key;
        performOperation(op);
      } else if (event.key === '=' || event.key === 'Enter') {
        calculate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputDigit, inputDecimal, clearAll, performOperation, calculate]);

  return (
    <div className="max-w-sm mx-auto p-4 md:p-6">
      <Card className="p-0 overflow-hidden shadow-2xl">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <div className="text-sm font-medium text-slate-500 h-5 mb-1">
            {prevValue !== null && operator ? `${formatDisplay(prevValue)} ${operator}` : ''}
          </div>
          <div className="text-5xl font-light text-slate-900 text-right overflow-x-auto whitespace-nowrap min-h-[60px] flex items-center justify-end" role="log" aria-live="assertive">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4">
          {/* Top row - AC, +/-, %, ÷ */}
          <CalculatorButton onClick={clearAll} className="bg-slate-300 hover:bg-slate-400">
            AC
          </CalculatorButton>
          <CalculatorButton onClick={toggleSign} className="bg-slate-300 hover:bg-slate-400">
            ±
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('%')} className="bg-slate-300 hover:bg-slate-400" disabled>
            %
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('÷')} className="bg-orange-500 text-white hover:bg-orange-600">
            ÷
          </CalculatorButton>

          {/* 7, 8, 9, × */}
          {[7, 8, 9].map((num) => (
            <CalculatorButton key={num} onClick={() => inputDigit(num.toString())}>
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton onClick={() => performOperation('×')} className="bg-orange-500 text-white hover:bg-orange-600">
            ×
          </CalculatorButton>

          {/* 4, 5, 6, - */}
          {[4, 5, 6].map((num) => (
            <CalculatorButton key={num} onClick={() => inputDigit(num.toString())}>
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton onClick={() => performOperation('-')} className="bg-orange-500 text-white hover:bg-orange-600">
            -
          </CalculatorButton>

          {/* 1, 2, 3, + */}
          {[1, 2, 3].map((num) => (
            <CalculatorButton key={num} onClick={() => inputDigit(num.toString())}>
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton onClick={() => performOperation('+')} className="bg-orange-500 text-white hover:bg-orange-600">
            +
          </CalculatorButton>

          {/* 0, ., = */}
          <CalculatorButton
            onClick={() => inputDigit('0')}
            className="col-span-2"
          >
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>

          <CalculatorButton
            onClick={calculate}
            className="bg-slate-900 text-white hover:bg-slate-800"
          >
            =
          </CalculatorButton>
        </div>

        <div className="mt-2 text-xs text-slate-500 text-center pb-4 px-4">
          <p>Keyboard support: 0-9, +, -, *, /, Enter(=), Escape(AC), Backspace</p>
        </div>
      </Card>
    </div>
  );
};