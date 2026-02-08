import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Clock, Coffee, Zap } from 'lucide-react';

// --- Card Component ---
interface CardProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, className = '', children }) => (
  <div className={`bg-white shadow-xl rounded-xl p-6 ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold text-slate-900 mb-1">{title}</h2>
    )}
    {description && (
      <p className="text-sm text-slate-500 mb-4">{description}</p>
    )}
    {children}
  </div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const getButtonStyles = (variant: 'primary' | 'outline' | 'danger' | 'ghost', size: 'md' | 'lg'): string => {
  const base = 'rounded-lg font-semibold transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base';

  switch (variant) {
    case 'primary':
      return `${base} bg-blue-600 text-white hover:bg-blue-700 shadow-md ${sizeClasses}`;
    case 'outline':
      return `${base} bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 ${sizeClasses}`;
    case 'danger':
      return `${base} bg-red-600 text-white hover:bg-red-700 shadow-md ${sizeClasses}`;
    case 'ghost':
      return `${base} text-slate-700 hover:bg-slate-100 ${sizeClasses}`;
    default:
      return `${base} bg-blue-600 text-white hover:bg-blue-700 shadow-md ${sizeClasses}`;
  }
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => (
  <button
    className={`${getButtonStyles(variant, size)} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Timer Hook ---
interface TimerState {
  remainingTime: number;
  isRunning: boolean;
  totalDuration: number;
}

interface UseCountdownTimerResult {
  remainingTime: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: (newDurationSeconds: number) => void;
}

const useAccurateCountdownTimer = (initialDurationSeconds: number): UseCountdownTimerResult => {
  const [state, setState] = useState<TimerState>({
    remainingTime: initialDurationSeconds * 1000,
    isRunning: false,
    totalDuration: initialDurationSeconds * 1000,
  });
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (state.isRunning || state.remainingTime <= 0) return;
    
    const newTotalDuration = state.remainingTime;
    startTimeRef.current = performance.now();
    
    intervalRef.current = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      
      const newRemainingTime = newTotalDuration - elapsed;

      if (newRemainingTime <= 0) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setState(s => ({ ...s, remainingTime: 0, isRunning: false }));
      } else {
        setState(s => ({ ...s, remainingTime: newRemainingTime, isRunning: true }));
      }
    }, 50);

    setState(s => ({ ...s, isRunning: true, totalDuration: newTotalDuration }));

  }, [state.isRunning, state.remainingTime]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      
      const elapsed = performance.now() - startTimeRef.current;
      const finalRemainingTime = Math.max(0, state.totalDuration - elapsed);

      setState(s => ({ 
        ...s, 
        isRunning: false, 
        remainingTime: finalRemainingTime 
      }));
    }
  }, [state.totalDuration]);

  const reset = useCallback((newDurationSeconds: number) => {
    const newDurationMs = newDurationSeconds * 1000;
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      remainingTime: newDurationMs,
      isRunning: false,
      totalDuration: newDurationMs,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!state.isRunning && state.totalDuration !== initialDurationSeconds * 1000) {
      reset(initialDurationSeconds);
    }
  }, [initialDurationSeconds, state.isRunning, reset]);

  const remainingTimeSeconds = Math.ceil(state.remainingTime / 1000);

  return { 
    remainingTime: remainingTimeSeconds, 
    isRunning: state.isRunning, 
    start, 
    stop, 
    reset 
  };
};

// --- PomodoroTimer Component ---
interface PomodoroMode {
  id: string;
  name: string;
  duration: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODES: PomodoroMode[] = [
  { id: 'work', name: 'Work', duration: 25 * 60, color: 'bg-blue-600', icon: Clock },
  { id: 'shortBreak', name: 'Short Break', duration: 5 * 60, color: 'bg-green-600', icon: Coffee },
  { id: 'longBreak', name: 'Long Break', duration: 15 * 60, color: 'bg-purple-600', icon: Zap }
];

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>(MODES[0]);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isBreakScheduled, setIsBreakScheduled] = useState(false);
  
  const {
    remainingTime,
    isRunning,
    start,
    stop,
    reset
  } = useAccurateCountdownTimer(mode.duration);

  // Auto-advance logic
  useEffect(() => {
    if (!isRunning && remainingTime === 0) {
      if (mode.id === 'work') {
        setCompletedSessions(prev => prev + 1);
        setIsBreakScheduled(true);
      }
      
      let nextMode: PomodoroMode;
      if (mode.id === 'work') {
        if ((completedSessions + 1) % 4 === 0) {
          nextMode = MODES.find(m => m.id === 'longBreak') || MODES[0];
        } else {
          nextMode = MODES.find(m => m.id === 'shortBreak') || MODES[0];
        }
      } else {
        nextMode = MODES.find(m => m.id === 'work') || MODES[0];
      }
      
      setMode(nextMode);
      reset(nextMode.duration);
      start();
    }
  }, [isRunning, remainingTime, mode.id, completedSessions, start, reset]);

  const handleModeChange = useCallback((newMode: PomodoroMode) => {
    if (isRunning) stop();
    setMode(newMode);
    reset(newMode.duration);
    setIsBreakScheduled(false);
  }, [isRunning, stop, reset]);

  const handleStartStop = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  const handleReset = useCallback(() => {
    stop();
    reset(MODES[0].duration);
    setMode(MODES[0]);
    setCompletedSessions(0);
    setIsBreakScheduled(false);
  }, [stop, reset]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (mode.duration - remainingTime) / mode.duration;

  return (
    <div className="flex justify-center p-4">
      <Card 
        title="Pomodoro Timer" 
        description="A productivity technique using timed work and break intervals."
        className="max-w-md w-full"
      >
        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="flex justify-around bg-slate-100 p-2 rounded-xl">
            {MODES.map((modeOption) => (
              <button
                key={modeOption.id}
                onClick={() => handleModeChange(modeOption)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition duration-150 ${
                  modeOption.id === mode.id
                    ? `${modeOption.color.replace('bg-', 'text-')} bg-white shadow`
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {modeOption.name}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative flex justify-center items-center">
            <svg className="w-64 h-64 transform -rotate-90">
                <circle 
                    className="text-slate-200"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="110"
                    cx="128"
                    cy="128"
                />
                <circle 
                    className={`${mode.color.replace('bg-', 'text-')}`}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={2 * Math.PI * 110 * (1 - progress)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="110"
                    cx="128"
                    cy="128"
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <mode.icon className={`w-8 h-8 ${mode.color.replace('bg-', 'text-')}`} />
              <div className="text-8xl font-light font-mono text-slate-900 leading-none mt-2">
                {formatTime(remainingTime)}
              </div>
              <div className={`text-xl font-semibold mt-2 ${mode.color.replace('bg-', 'text-')}`}>
                {mode.name}
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              variant={isRunning ? 'danger' : 'primary'}
              onClick={handleStartStop}
              size="lg"
            >
              {isRunning ? 'Pause' : remainingTime === mode.duration ? 'Start' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              size="lg"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Status/Summary */}
        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-700 font-medium">Completed Work Sessions:</span>
            <span className="text-3xl font-bold text-blue-600">{completedSessions}</span>
          </div>
          
          {isBreakScheduled && mode.id !== 'work' && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium">
                Time for a {mode.name}!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};