import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { ThemeProvider } from './theme/ThemeContext.js';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
