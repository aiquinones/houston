import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { darkColors, lightColors, type ColorTheme, type ThemeMode } from './colors.js';

type ThemeContextValue = ColorTheme & {
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getInitialMode = (): ThemeMode => {
  const attr = document.body.dataset.vscodeTheme;
  // VSCode ColorThemeKind: 1=Light, 2=Dark, 3=HighContrast, 4=HighContrastLight
  if (attr === '1' || attr === '4') return 'light';
  return 'dark';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [detectedMode, setDetectedMode] = useState<ThemeMode>(getInitialMode);
  const [manualOverride, setManualOverride] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (msg?.type === 'themeChanged' && typeof msg.kind === 'number') {
        const newMode: ThemeMode = (msg.kind === 1 || msg.kind === 4) ? 'light' : 'dark';
        setDetectedMode(newMode);
        setManualOverride(null);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const mode = manualOverride ?? detectedMode;
  const palette = mode === 'dark' ? darkColors : lightColors;

  const toggleTheme = useCallback(() => {
    setManualOverride((prev) => {
      const current = prev ?? detectedMode;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [detectedMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ ...palette, mode, toggleTheme }),
    [palette, mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
