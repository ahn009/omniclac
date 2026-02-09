import React, { useState, useCallback } from 'react';
import { Divide, X, Minus, Plus, Percent, Play, Maximize2 } from 'lucide-react';
import { Card, Button } from '../common/CommonComponents';

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
          <Button 
            onClick={() => setIsDeg(prev => !prev)}
            variant={isDeg ? "primary" : "outline"}
            className="p-4 text-xl font-light"
            title="Toggle Degrees/Radians"
          >
            {isDeg ? 'DEG' : 'RAD'}
          </Button>
          <Button onClick={() => performFunction('x^2')} variant="outline" className="p-4 text-xl font-light" title="Square">
            x²
          </Button>
          <Button onClick={() => performFunction('1/x')} variant="outline" className="p-4 text-xl font-light" title="Inverse">
            1/x
          </Button>
          <Button 
            onClick={clearAll}
            variant="danger"
            className="col-span-2 p-4 text-xl font-light"
          >
            AC
          </Button>

          {/* Row 2: Trig and Advanced Ops */}
          <Button onClick={() => performFunction('sin')} variant="outline" className="p-4 text-xl font-light" title="Sine">
            sin
          </Button>
          <Button onClick={() => performFunction('cos')} variant="outline" className="p-4 text-xl font-light" title="Cosine">
            cos
          </Button>
          <Button onClick={() => performFunction('tan')} variant="outline" className="p-4 text-xl font-light" title="Tangent">
            tan
          </Button>
          <Button onClick={toggleSign} variant="outline" className="p-4 text-xl font-light" title="Change Sign">
            +/-
          </Button>
          <Button 
            onClick={() => performOperation('÷')}
            variant="primary"
            className="p-4 text-xl font-light bg-orange-400 hover:bg-orange-500"
            title="Divide"
          >
            <Divide size={20} className="mx-auto" />
          </Button>

          {/* Row 3: Log, Constants, and Numbers 7, 8, 9 */}
          <Button onClick={() => performFunction('log')} variant="outline" className="p-4 text-xl font-light" title="Log Base 10">
            log
          </Button>
          <Button onClick={() => performFunction('ln')} variant="outline" className="p-4 text-xl font-light" title="Natural Log">
            ln
          </Button>
          <Button onClick={() => inputConstant('Pi')} variant="outline" className="p-4 text-xl font-light" title="Pi">
            <Play size={20} className="mx-auto" />
          </Button>
          <Button onClick={() => inputDigit('7')} variant="outline" className="p-4 text-xl font-light">7</Button>
          <Button onClick={() => inputDigit('8')} variant="outline" className="p-4 text-xl font-light">8</Button>
          <Button onClick={() => inputDigit('9')} variant="outline" className="p-4 text-xl font-light">9</Button>
          <Button 
            onClick={() => performOperation('×')}
            variant="primary"
            className="p-4 text-xl font-light bg-orange-400 hover:bg-orange-500"
            title="Multiply"
          >
            <X size={20} className="mx-auto" />
          </Button>

          {/* Row 4: Power, Root, and Numbers 4, 5, 6 */}
          <Button onClick={() => performOperation('y^x')} variant="outline" className="p-4 text-xl font-light" title="Power">
            <Maximize2 size={16} className="inline mr-1" />
            <span className='text-base'>^</span>
          </Button>
          <Button onClick={() => performOperation('y√x')} variant="outline" className="p-4 text-xl font-light" title="Nth Root">
            y√x
          </Button>
          <Button onClick={() => performFunction('e^x')} variant="outline" className="p-4 text-xl font-light" title="e to the power of x">
            e^x
          </Button>
          <Button onClick={() => inputDigit('4')} variant="outline" className="p-4 text-xl font-light">4</Button>
          <Button onClick={() => inputDigit('5')} variant="outline" className="p-4 text-xl font-light">5</Button>
          <Button onClick={() => inputDigit('6')} variant="outline" className="p-4 text-xl font-light">6</Button>
          <Button 
            onClick={() => performOperation('-')}
            variant="primary"
            className="p-4 text-xl font-light bg-orange-400 hover:bg-orange-500"
            title="Subtract"
          >
            <Minus size={20} className="mx-auto" />
          </Button>

          {/* Row 5: Remaining numbers and Equals */}
          <Button onClick={inputPercent} variant="outline" className="p-4 text-xl font-light" title="Percent">
            <Percent size={20} className="mx-auto" />
          </Button>
          <Button onClick={() => performFunction('sqrt')} variant="outline" className="p-4 text-xl font-light" title="Square Root">
            √
          </Button>
          <Button onClick={() => inputConstant('e')} variant="outline" className="p-4 text-xl font-light" title="Euler's Number">
            e
          </Button>
          <Button onClick={() => inputDigit('1')} variant="outline" className="p-4 text-xl font-light">1</Button>
          <Button onClick={() => inputDigit('2')} variant="outline" className="p-4 text-xl font-light">2</Button>
          <Button onClick={() => inputDigit('3')} variant="outline" className="p-4 text-xl font-light">3</Button>
          <Button 
            onClick={() => performOperation('+')}
            variant="primary"
            className="p-4 text-xl font-light bg-orange-400 hover:bg-orange-500"
            title="Add"
          >
            <Plus size={20} className="mx-auto" />
          </Button>

          {/* Row 6: 0 and Decimal */}
          <Button 
            onClick={() => inputDigit('0')}
            variant="outline"
            className="col-span-3 p-4 text-xl font-light"
          >
            0
          </Button>
          <Button onClick={inputDecimal} variant="outline" className="p-4 text-xl font-light" title="Decimal Point">.</Button>
          <Button
            onClick={calculate}
            variant="secondary"
            className="p-4 text-xl font-light"
            title="Equals"
          >
            =
          </Button>
        </div>
      </Card>
    </div>
  );
};