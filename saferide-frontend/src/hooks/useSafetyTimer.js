import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Countdown timer hook. Pass totalSeconds and it counts down,
 * calling onComplete once when it reaches zero. `running` controls
 * play/pause; `reset` restarts from totalSeconds.
 */
export function useSafetyTimer(totalSeconds, { onComplete, autoStart = true } = {}) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);
  const reset = useCallback((newTotal = totalSeconds) => {
    clearInterval(intervalRef.current);
    setSecondsLeft(newTotal);
  }, [totalSeconds]);

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  return { secondsLeft, running, pause, resume, reset, progress, setRunning };
}

export function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
