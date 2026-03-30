import React from 'react';
import type { NavigationMode } from '../hooks/useNavigationMode.js';
import { useTheme } from '../theme/ThemeContext.js';

type Props = {
  mode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
};

const modes: Array<{ key: NavigationMode; label: string; shortcut: string; icon: string }> = [
  { key: 'select', label: 'Select', shortcut: 'V', icon: '↖' },
  { key: 'hand', label: 'Hand', shortcut: 'H', icon: '✋' },
  { key: 'zoom', label: 'Zoom', shortcut: 'Z', icon: '🔍' },
];

// marker:start NavigationToolbar
export const NavigationToolbar = ({ mode, onModeChange }: Props) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: 1,
        background: theme.bgSurface,
        border: `1px solid ${theme.border}`,
        borderRadius: 8,
        padding: 3,
        fontFamily: 'monospace',
      }}
    >
      {modes.map((m) => {
        const isActive = mode === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onModeChange(m.key)}
            title={`${m.label} (${m.shortcut})`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'monospace',
              background: isActive ? theme.bgHover : 'transparent',
              color: isActive ? theme.textPrimary : theme.textMuted,
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: 13 }}>{m.icon}</span>
            <span
              style={{
                fontSize: 10,
                opacity: 0.6,
                padding: '1px 4px',
                borderRadius: 3,
                background: isActive ? theme.border : 'transparent',
              }}
            >
              {m.shortcut}
            </span>
          </button>
        );
      })}
    </div>
  );
};
// marker:end NavigationToolbar
