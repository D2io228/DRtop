import './ui/theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { RootBoundary } from './ui/ErrorBoundary';
import { getGame } from './ui/engineHost';

const container = document.getElementById('root');
if (container) {
  createRoot(container, {
    // Panel boundaries report caught errors to the Dev Console themselves (with a component stack).
    onCaughtError: () => undefined,
    onUncaughtError: (error, info) => getGame().reportError('ui:root', error, info.componentStack ?? undefined),
    onRecoverableError: (error, info) => getGame().reportError('ui:recoverable', error, info.componentStack ?? undefined),
  }).render(
    <StrictMode>
      <RootBoundary>
        <App />
      </RootBoundary>
    </StrictMode>,
  );
}
