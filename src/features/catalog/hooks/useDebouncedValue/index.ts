import { useEffect, useState } from 'react';
import { SEARCH } from '@/constants';

export function useDebouncedValue<T>(value: T, delay: number = SEARCH.DEFAULT_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    if (Object.is(value, debounced)) return;
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay, debounced]);
  return debounced;
}
