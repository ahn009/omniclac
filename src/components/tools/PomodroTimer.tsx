import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Clock, Coffee, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { Card, Button } from '../common/CommonComponents';

// --- Timer Hook ---
interface UseCountdownTimerResult {
  remainingTime: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: (newDurationSeconds: number) => void;
}

const useAccurateCountdownTimer = (initialDurationSeconds: number): UseCountdownTimerResult => {
  const [remainingMs, setRemainingMs] = useState(initialDurationSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  // Mutable refs mirror the state so start/stop/reset always see fresh values,
  // even when called back-to-back (e.g. reset() immediately followed by start()).
  const remainingRef = useRef<number>(initialDurationSeconds * 1000);
  const endTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (intervalRef.current !== null) return; // already running
    if (remainingRef.current <= 0) return; // nothing left to count down
    endTimeRef.current = performance.now() + remainingRef.current;
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      const left = Math.max(0, endTimeRef.current - performance.now());
      remainingRef.current = left;
      setRemainingMs(left);
      if (left <= 0) {
        clearTimer();
        setIsRunning(false);
      }
    }, 100);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current === null) return;
    const left = Math.max(0, endTimeRef.current - performance.now());
    clearTimer();
    remainingRef.current = left;
    setRemainingMs(left);
    setIsRunning(false);
  }, []);

  const reset = useCallback((newDurationSeconds: number) => {
    clearTimer();
    const ms = newDurationSeconds * 1000;
    remainingRef.current = ms;
    setRemainingMs(ms);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    remainingTime: Math.ceil(remainingMs / 1000),
    isRunning,
    start,
    stop,
    reset,
  };
};

// --- PomodoroTimer Component ---
interface PomodoroMode {
  id: string;
  name: string;
  duration: number;
  /** Literal Tailwind classes — kept as static strings so Tailwind generates them. */
  ring: string;
  text: string;
  glow: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODES: PomodoroMode[] = [
  { id: 'work', name: 'Work', duration: 25 * 60, ring: 'text-blue-500', text: 'text-blue-600 dark:text-blue-400', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.45)]', icon: Clock },
  { id: 'shortBreak', name: 'Short Break', duration: 5 * 60, ring: 'text-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]', icon: Coffee },
  { id: 'longBreak', name: 'Long Break', duration: 15 * 60, ring: 'text-violet-500', text: 'text-violet-600 dark:text-violet-400', glow: 'drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]', icon: Zap }
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

  // Auto-advance: when a session completes, switch mode and auto-start the next one.
  useEffect(() => {
    if (!isRunning && remainingTime === 0) {
      if (mode.id === 'work') {
        setCompletedSessions(prev => prev + 1);
        setIsBreakScheduled(true);
      }

      let nextMode: PomodoroMode;
      if (mode.id === 'work') {
        nextMode = (completedSessions + 1) % 4 === 0
          ? MODES.find(m => m.id === 'longBreak') || MODES[0]
          : MODES.find(m => m.id === 'shortBreak') || MODES[0];
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
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="flex justify-center p-4">
      <Card
        title="Pomodoro Timer"
        description="A productivity technique using timed work and break intervals."
        className="max-w-md w-full"
      >
        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="flex justify-around bg-slate-200/60 dark:bg-slate-800/80 p-2 rounded-2xl gap-1 shadow-inset" role="tablist" aria-label="Timer modes">
            {MODES.map((modeOption) => (
              <button
                key={modeOption.id}
                role="tab"
                aria-selected={modeOption.id === mode.id}
                onClick={() => handleModeChange(modeOption)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${
                  modeOption.id === mode.id
                    ? `${modeOption.text} bg-white dark:bg-slate-700 shadow-elevation-2`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {modeOption.name}
              </button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative flex justify-center items-center">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256" role="img" aria-label={`${mode.name} timer`}>
              <circle
                className="text-slate-200 dark:text-slate-700/60"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="110"
                cx="128"
                cy="128"
              />
              <circle
                className={`${mode.ring} ${mode.glow}`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="110"
                cx="128"
                cy="128"
                style={{ transition: 'stroke-dashoffset 0.15s linear' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <mode.icon className={`w-8 h-8 ${mode.text}`} />
              <div className="font-display text-6xl sm:text-7xl font-bold font-mono tnum text-slate-900 dark:text-slate-100 leading-none mt-2" role="timer" aria-live="polite">
                {formatTime(remainingTime)}
              </div>
              <div className={`text-xl font-semibold mt-2 ${mode.text}`}>
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
              icon={isRunning ? Pause : Play}
            >
              {isRunning ? 'Pause' : remainingTime === mode.duration ? 'Start' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              size="lg"
              icon={RotateCcw}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Status/Summary */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Completed Work Sessions</span>
            <span className="font-display text-3xl font-bold gradient-text tnum">{completedSessions}</span>
          </div>

          {isBreakScheduled && mode.id !== 'work' && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-center font-medium animate-enter">
              Time for a {mode.name}!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
