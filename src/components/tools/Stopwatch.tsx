import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, Button } from '../common/CommonComponents';

// --- Internal Utility Functions ---
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor(ms % 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  const pad = (num: number, length: number = 2): string => String(num).padStart(length, '0');

  const formattedHours = pad(hours);
  const formattedMinutes = pad(displayMinutes);
  const formattedSeconds = pad(seconds);
  const formattedMilliseconds = pad(milliseconds, 3).slice(0, 2);

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  }
  return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
};

// --- Internal Hook: useAccurateTimer ---
interface UseTimerConfig {
  interval: number;
  autoStart: boolean;
}

interface UseTimerResult {
  isRunning: boolean;
  elapsedTime: number;
  toggle: () => void;
  reset: () => void;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
}

const useAccurateTimer = (config: UseTimerConfig): UseTimerResult => {
  const { interval = 10, autoStart = false } = config;

  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const tick = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp - elapsedTime;
    }

    const newElapsedTime = timestamp - startTimeRef.current;
    
    if (newElapsedTime - elapsedTime >= interval) {
      setElapsedTime(newElapsedTime);
    }
    
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [elapsedTime, interval]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, tick]);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  return { isRunning, elapsedTime, toggle, reset, setElapsedTime };
};

// --- Stopwatch Component ---
interface LapRecord {
  id: number;
  time: number;
  lapTime: number;
  label: string;
}

export const Stopwatch: React.FC = () => {
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const lapIdRef = useRef(1);
  const lastLapTimeRef = useRef(0);

  const {
    isRunning,
    elapsedTime,
    toggle,
    reset
  } = useAccurateTimer({
    interval: 10,
    autoStart: false
  });

  const handleLap = useCallback(() => {
    if (isRunning) {
      const currentTime = elapsedTime;
      const lapTime = currentTime - lastLapTimeRef.current;
      
      const newLap: LapRecord = {
        id: lapIdRef.current++,
        time: currentTime,
        lapTime: lapTime,
        label: `Lap ${lapIdRef.current - 1}`
      };
      
      setLaps(prev => [newLap, ...prev]); 
      lastLapTimeRef.current = currentTime;
    }
  }, [isRunning, elapsedTime]);

  const handleReset = useCallback(() => {
    reset();
    setLaps([]);
    lapIdRef.current = 1;
    lastLapTimeRef.current = 0;
  }, [reset]);

  const timeSinceLastLap = elapsedTime - lastLapTimeRef.current;

  return (
    <div className="max-w-xl mx-auto">
      <Card title="Stopwatch" description="Measure elapsed time with lap recording.">
        <div className="text-center mb-8">
          <div 
            className="text-6xl font-light font-mono text-slate-900 dark:text-slate-100 mb-2"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(elapsedTime)}
          </div>
          {laps.length > 0 && (
            <div className="text-xl font-light font-mono text-slate-600">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2">Lap Time:</span> 
              {formatTime(timeSinceLastLap)}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant={isRunning ? 'danger' : 'primary'}
            onClick={toggle}
            size="lg"
          >
            {isRunning ? 'Stop' : (elapsedTime > 0 ? 'Resume' : 'Start')}
          </Button>
          <Button
            variant="outline"
            onClick={handleLap}
            disabled={!isRunning}
            size="lg"
          >
            Lap
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={elapsedTime === 0 && laps.length === 0}
            size="lg"
          >
            Reset
          </Button>
        </div>
      </Card>

      {laps.length > 0 && (
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Lap Records</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {laps.map((lap, index) => (
              <div
                key={lap.id}
                className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-full text-sm font-medium">
                    {laps.length - index}
                  </span>
                  <span className="text-slate-700">{lap.label}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-mono font-medium text-slate-900">
                    Total: {formatTime(lap.time)}
                  </span>
                  <span className="font-mono font-medium text-blue-600">
                    Lap: {formatTime(lap.lapTime)} 
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};