import React, { useState, useCallback, useEffect } from 'react';
import { Card, CalcKey } from '../common/CommonComponents';

// --- Standard Calculator Logic ---
export const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const formatDisplay = (value: number): string => {
    if (!isFinite(value)) return 'Error';
    const s = value.toString();
    if (s.length > 12) {
      return value.toPrecision(10).replace(/\.?0+e/, 'e');
    }
    return s;
  };

  const isErrorDisplay = (d: string): boolean => d.startsWith('Error');

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand || isErrorDisplay(display)) {
      // Fresh entry after an operator, or after an error.
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      if (display === '0' && digit === '0') return;
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand || isErrorDisplay(display)) {
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
    if (!isNaN(value) && value !== 0) {
      setDisplay(formatDisplay(-value));
    }
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    if (isNaN(value)) return;
    setDisplay(formatDisplay(value / 100));
    setWaitingForOperand(true);
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
            setDisplay('Error');
            setPrevValue(null);
            setOperator(null);
            setWaitingForOperand(true);
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
      setWaitingForOperand(true);
    }
  }, [display, prevValue, operator]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (operator && waitingForOperand) {
      // Operator pressed twice in a row (e.g. 5 + −): replace it instead of computing.
      setOperator(nextOperator);
      return;
    }

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      calculate();
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }, [display, prevValue, operator, waitingForOperand, calculate]);

  // Handle keyboard input — ignored when the user is typing in a form field
  // (e.g. the sidebar search box) so the calculator never hijacks typing.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      )) {
        return;
      }

      if (['/', '*', '-', '+', '='].includes(event.key) || event.key === 'Enter') {
        event.preventDefault();
      }

      if (/[0-9]/.test(event.key)) {
        inputDigit(event.key);
      } else if (event.key === '.') {
        inputDecimal();
      } else if (event.key === '%') {
        inputPercent();
      } else if (event.key === 'Escape') {
        clearAll();
      } else if (event.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 && prev !== '0' && !isErrorDisplay(prev) ? prev.slice(0, -1) : '0');
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
  }, [inputDigit, inputDecimal, inputPercent, clearAll, performOperation, calculate]);

  return (
    <div className="max-w-sm mx-auto p-4 md:p-6">
      <Card className="p-0 overflow-hidden">
        <div className="p-6">
          <div className="display-well px-5 py-4 mb-5">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 h-5 mb-1 tnum">
              {prevValue !== null && operator ? `${formatDisplay(prevValue)} ${operator}` : '\u00A0'}
            </div>
            <div className="font-display text-5xl font-semibold text-slate-900 dark:text-slate-100 text-right overflow-x-auto whitespace-nowrap min-h-[60px] flex items-center justify-end tnum" role="log" aria-live="assertive">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            <CalcKey variant="danger" onClick={clearAll} aria-label="Clear all">AC</CalcKey>
            <CalcKey variant="action" onClick={toggleSign} aria-label="Toggle sign">±</CalcKey>
            <CalcKey variant="action" onClick={inputPercent} aria-label="Percent">%</CalcKey>
            <CalcKey variant="operator" onClick={() => performOperation('÷')} aria-label="Divide">÷</CalcKey>

            {[7, 8, 9].map((num) => (
              <CalcKey key={num} onClick={() => inputDigit(num.toString())} aria-label={num.toString()}>
                {num}
              </CalcKey>
            ))}
            <CalcKey variant="operator" onClick={() => performOperation('×')} aria-label="Multiply">×</CalcKey>

            {[4, 5, 6].map((num) => (
              <CalcKey key={num} onClick={() => inputDigit(num.toString())} aria-label={num.toString()}>
                {num}
              </CalcKey>
            ))}
            <CalcKey variant="operator" onClick={() => performOperation('-')} aria-label="Subtract">−</CalcKey>

            {[1, 2, 3].map((num) => (
              <CalcKey key={num} onClick={() => inputDigit(num.toString())} aria-label={num.toString()}>
                {num}
              </CalcKey>
            ))}
            <CalcKey variant="operator" onClick={() => performOperation('+')} aria-label="Add">+</CalcKey>

            <CalcKey onClick={() => inputDigit('0')} className="col-span-2" aria-label="0">
              0
            </CalcKey>
            <CalcKey onClick={inputDecimal} aria-label="Decimal point">.</CalcKey>
            <CalcKey variant="equals" onClick={calculate} aria-label="Equals">=</CalcKey>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
            <p>Keyboard: 0-9 · + − * / · % · Enter (=) · Esc (AC) · ⌫</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
