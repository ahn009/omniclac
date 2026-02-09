import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button } from '../common/CommonComponents';

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
        <div className="p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 h-5 mb-1">
            {prevValue !== null && operator ? `${formatDisplay(prevValue)} ${operator}` : ''}
          </div>
          <div className="text-5xl font-light text-slate-900 dark:text-slate-100 text-right overflow-x-auto whitespace-nowrap min-h-[60px] flex items-center justify-end" role="log" aria-live="assertive">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 p-4">
          {/* Top row - AC, +/-, %, ÷ */}
          <Button onClick={clearAll} variant="danger" className="p-4 text-2xl">
            AC
          </Button>
          <Button onClick={toggleSign} variant="outline" className="p-4 text-2xl">
            ±
          </Button>
          <Button onClick={() => performOperation('%')} variant="outline" className="p-4 text-2xl" disabled>
            %
          </Button>
          <Button onClick={() => performOperation('÷')} variant="outline" className="p-4 text-2xl">
            ÷
          </Button>

          {/* 7, 8, 9, × */}
          {[7, 8, 9].map((num) => (
            <Button key={num} onClick={() => inputDigit(num.toString())} variant="primary" className="p-4 text-2xl">
              {num}
            </Button>
          ))}
          <Button onClick={() => performOperation('×')} variant="outline" className="p-4 text-2xl">
            ×
          </Button>

          {/* 4, 5, 6, - */}
          {[4, 5, 6].map((num) => (
            <Button key={num} onClick={() => inputDigit(num.toString())} variant="primary" className="p-4 text-2xl">
              {num}
            </Button>
          ))}
          <Button onClick={() => performOperation('-')} variant="outline" className="p-4 text-2xl">
            -
          </Button>

          {/* 1, 2, 3, + */}
          {[1, 2, 3].map((num) => (
            <Button key={num} onClick={() => inputDigit(num.toString())} variant="primary" className="p-4 text-2xl">
              {num}
            </Button>
          ))}
          <Button onClick={() => performOperation('+')} variant="outline" className="p-4 text-2xl">
            +
          </Button>

          {/* 0, ., = */}
          <Button
            onClick={() => inputDigit('0')}
            variant="primary"
            className="col-span-2 p-4 text-2xl"
          >
            0
          </Button>
          <Button onClick={inputDecimal} variant="primary" className="p-4 text-2xl">.</Button>

          <Button
            onClick={calculate}
            variant="secondary"
            className="p-4 text-2xl"
          >
            =
          </Button>
        </div>

        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center pb-4 px-4">
          <p>Keyboard support: 0-9, +, -, *, /, Enter(=), Escape(AC), Backspace</p>
        </div>
      </Card>
    </div>
  );
};