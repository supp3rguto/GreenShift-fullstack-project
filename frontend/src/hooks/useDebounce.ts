import { useState, useEffect } from 'react';

// este hook vai receber um valor (no caso, o texto que o usuário digita) e um delay
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // cria um timer que só vai atualizar o valor "debounced" após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // roda de novo só se o valor ou o delay mudarem

  return debouncedValue;
}