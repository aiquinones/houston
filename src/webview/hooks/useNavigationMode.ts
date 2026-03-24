import { useState, useEffect, useCallback } from 'react';

export type NavigationMode = 'select' | 'hand' | 'zoom';

export const useNavigationMode = () => {
  const [mode, setMode] = useState<NavigationMode>('select');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'v':
          setMode('select');
          break;
        case 'h':
          setMode('hand');
          break;
        case 'z':
          setMode('zoom');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cycleMode = useCallback(() => {
    setMode((prev) => {
      if (prev === 'select') return 'hand';
      if (prev === 'hand') return 'zoom';
      return 'select';
    });
  }, []);

  return { mode, setMode, cycleMode };
};
