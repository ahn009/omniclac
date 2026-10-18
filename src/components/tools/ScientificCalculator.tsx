import React, { useState, useCallback } from 'react';
import { Divide, X, Minus, Plus, Percent } from 'lucide-react';
import { Card, CalcKey } from '../common/CommonComponents';

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

  /** Push a computed value to the display, or show "Error" for non-finite results. */
  const showResult = (value: number, historyEntry?: string): number | null => {
    if (!isFinite(value)) {
      setDisplay('Error');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      if (historyEntry) {
        setHistory(prev => [`${historyEntry}Error`, ...prev.slice(0, 4)]);
      }
      return null;
    }
    const resultString = formatResult(value);
    setDisplay(resultString);
    if (historyEntry) {
      setHistory(prev => [`${historyEntry}${resultString}`, ...prev.slice(0, 4)]);
    }
    return value;
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

  /**
   * Evaluates the pending binary operation.
   * Returns the computed value, or null when nothing was computed
   * (no pending operation, or a math error occurred).
   */
  const calculate = useCallback((): number | null => {
    const inputValue = parseFloat(display);
    if (prevValue === null || operator === null || waitingForOperand) {
      return null;
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
            return null;
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
          return null;
      }

      const result = showResult(newValue, equation);
      if (result === null) return null;
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return result;

    } catch (e) {
      setDisplay('Error');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return null;
    }
  }, [display, prevValue, operator, waitingForOperand]);

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      // First operator pressed: store the current entry as the running value.
      setPrevValue(inputValue);
    } else if (operator && !waitingForOperand) {
      // Chained operation (e.g. 5 + 8 × ...): fold the pending operation into
      // the running value using the freshly computed result — not the stale display.
      const result = calculate();
      if (result !== null) {
        setPrevValue(result);
      }
      // On error (result === null) calculate() already reset the state.
    }
    // Otherwise an operator was pressed twice in a row: just replace it,
    // keeping the existing running value.

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }, [display, prevValue, operator, waitingForOperand, calculate]);

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
      const result = showResult(newValue, funcDisplay);
      if (result === null) return;
      setWaitingForOperand(true);
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
        <div className="display-well px-5 py-4">
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold tracking-wider">{isDeg ? 'DEG' : 'RAD'}</span>
            {history.length > 0 && (
              <span className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis tnum">
                {history[0]}
              </span>
            )}
          </div>

          <div
            className="font-display text-4xl font-semibold text-slate-900 dark:text-slate-100 overflow-x-auto whitespace-nowrap text-right tnum"
            style={{ minHeight: '48px' }}
            role="log"
            aria-live="polite"
          >
            {display}
          </div>
          {operator && prevValue !== null && (
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-right tnum">
              {prevValue} {operator}
            </div>
          )}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-6 gap-2">
          <CalcKey onClick={() => setIsDeg(prev => !prev)}
            variant={isDeg ? "action" : "digit"}
           
            title="Toggle Degrees/Radians"
            aria-label="Toggle degrees or radians"
          >
            {isDeg ? 'DEG' : 'RAD'}
          </CalcKey>
          <CalcKey onClick={() => performFunction('x^2')} title="Square" aria-label="Square">
            x²
          </CalcKey>
          <CalcKey onClick={() => performFunction('1/x')} title="Inverse" aria-label="Reciprocal">
            1/x
          </CalcKey>
          <CalcKey onClick={() => performFunction('sqrt')} title="Square Root" aria-label="Square root">
            √
          </CalcKey>
          <CalcKey variant="danger" className="col-span-2" onClick={clearAll}>
            AC
          </CalcKey>

          <CalcKey onClick={() => performFunction('sin')} title="Sine" aria-label="Sine">
            sin
          </CalcKey>
          <CalcKey onClick={() => performFunction('cos')} title="Cosine" aria-label="Cosine">
            cos
          </CalcKey>
          <CalcKey onClick={() => performFunction('tan')} title="Tangent" aria-label="Tangent">
            tan
          </CalcKey>
          <CalcKey onClick={() => performFunction('log')} title="Log Base 10" aria-label="Logarithm base 10">
            log
          </CalcKey>
          <CalcKey onClick={() => performFunction('ln')} title="Natural Log" aria-label="Natural logarithm">
            ln
          </CalcKey>
          <CalcKey onClick={toggleSign} title="Change Sign" aria-label="Change sign">
            +/-
          </CalcKey>

          <CalcKey onClick={() => inputConstant('Pi')} title="Pi" aria-label="Pi constant">
            π
          </CalcKey>
          <CalcKey onClick={() => inputConstant('e')} title="Euler's Number" aria-label="Euler's number">
            e
          </CalcKey>
          <CalcKey onClick={() => performFunction('e^x')} title="e to the power of x" aria-label="E to the power of x">
            e^x
          </CalcKey>
          <CalcKey onClick={() => performOperation('y^x')} title="Power" aria-label="Raise to power">
            xʸ
          </CalcKey>
          <CalcKey onClick={() => performOperation('y√x')} title="Nth Root" aria-label="Nth root">
            y√x
          </CalcKey>
          <CalcKey onClick={inputPercent} title="Percent" aria-label="Percent">
            <Percent size={20} className="mx-auto" />
          </CalcKey>

          <CalcKey onClick={() => inputDigit('7')}>7</CalcKey>
          <CalcKey onClick={() => inputDigit('8')}>8</CalcKey>
          <CalcKey onClick={() => inputDigit('9')}>9</CalcKey>
          <CalcKey onClick={() => performOperation('÷')}
            variant="operator"
           
            title="Divide"
            aria-label="Divide"
          >
            <Divide size={20} className="mx-auto" />
          </CalcKey>
          <CalcKey onClick={() => performOperation('×')}
            variant="operator"
           
            title="Multiply"
            aria-label="Multiply"
          >
            <X size={20} className="mx-auto" />
          </CalcKey>
          <CalcKey onClick={() => performOperation('−')}
            variant="operator"
           
            title="Subtract"
            aria-label="Subtract"
          >
            <Minus size={20} className="mx-auto" />
          </CalcKey>

          <CalcKey onClick={() => inputDigit('4')}>4</CalcKey>
          <CalcKey onClick={() => inputDigit('5')}>5</CalcKey>
          <CalcKey onClick={() => inputDigit('6')}>6</CalcKey>
          <CalcKey onClick={() => performOperation('+')}
            variant="operator"
           
            title="Add"
            aria-label="Add"
          >
            <Plus size={20} className="mx-auto" />
          </CalcKey>
          <CalcKey onClick={inputDecimal} title="Decimal Point" aria-label="Decimal point">.</CalcKey>
          <CalcKey variant="equals" onClick={calculate} title="Equals" aria-label="Equals">
            =
          </CalcKey>

          <CalcKey onClick={() => inputDigit('1')}>1</CalcKey>
          <CalcKey onClick={() => inputDigit('2')}>2</CalcKey>
          <CalcKey onClick={() => inputDigit('3')}>3</CalcKey>
          <CalcKey onClick={() => inputDigit('0')}
           
            className="col-span-3"
          >
            0
          </CalcKey>
        </div>
      </Card>
    </div>
  );
};
