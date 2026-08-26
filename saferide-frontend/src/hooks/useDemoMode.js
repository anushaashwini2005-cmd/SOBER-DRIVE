import { useSafety } from '../context/SafetyContext';
import { DEMO_TIMER_SECONDS, DEMO_RESPONSE_WINDOW_SECONDS, CHECK_IN_RESPONSE_WINDOW_SECONDS } from '../utils/constants';

/**
 * Central place to resolve timing values based on demo mode, so
 * every page reads consistent numbers.
 */
export function useDemoMode() {
  const { demoMode, setDemoMode } = useSafety();

  const timerSeconds = (minutes) => (demoMode ? DEMO_TIMER_SECONDS : minutes * 60);
  const responseWindowSeconds = demoMode ? DEMO_RESPONSE_WINDOW_SECONDS : CHECK_IN_RESPONSE_WINDOW_SECONDS;

  return { demoMode, setDemoMode, timerSeconds, responseWindowSeconds };
}
