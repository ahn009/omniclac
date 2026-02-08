import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAccurateTimerOptions {
  interval?: number;
  onTick?: (elapsed: number) => void;
  autoStart?: boolean;
}

export const useAccurateTimer = ({
  interval = 1000,
  onTick,
  autoStart = false
}: UseAccurateTimerOptions = {}) => {
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0); // ✅ Fixed: Added initial value

  const tick = useCallback(() => {
    if (!isRunning || startTimeRef.current === null) return;

    const currentTime = performance.now();
    const delta = currentTime - startTimeRef.current;
    
    if (delta >= interval) {
      const newElapsed = accumulatedTimeRef.current + delta;
      setElapsedTime(newElapsed);
      accumulatedTimeRef.current = newElapsed;
      startTimeRef.current = currentTime - (delta % interval);
      
      if (onTick) {
        onTick(newElapsed);
      }
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [isRunning, interval, onTick]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, tick]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = performance.now();
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current += performance.now() - startTimeRef.current;
      }
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  return {
    isRunning,
    elapsedTime,
    start,
    stop,
    reset,
    toggle,
    setElapsedTime
  };
};

export const useCountdownTimer = (initialTime: number) => {
  const [remainingTime, setRemainingTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const animationFrameRef = useRef<number>(0); // ✅ Fixed: Added initial value
  const lastUpdateRef = useRef<number>(0);

  const tick = useCallback((currentTime: number) => {
    if (!isRunning) return;

    if (lastUpdateRef.current === 0) {
      lastUpdateRef.current = currentTime;
    }

    const delta = currentTime - lastUpdateRef.current;
    
    if (delta >= 1000) {
      setRemainingTime(prev => {
        const newTime = prev - Math.floor(delta / 1000);
        
        if (newTime <= 0) {
          setIsRunning(false);
          return 0;
        }
        
        return newTime;
      });
      
      lastUpdateRef.current = currentTime - (delta % 1000);
    }

    if (remainingTime > 0) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning, remainingTime]);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      lastUpdateRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, remainingTime, tick]);

  const start = useCallback(() => {
    if (remainingTime > 0 && !isRunning) {
      setIsRunning(true);
    }
  }, [remainingTime, isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setRemainingTime(newTime ?? initialTime);
    lastUpdateRef.current = 0;
  }, [initialTime]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  return {
    remainingTime,
    isRunning,
    start,
    stop,
    reset,
    toggle,
    setRemainingTime
  };
};