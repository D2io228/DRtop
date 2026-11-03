import './theme.css';
import './styles/layout.css';
import './styles/controls.css';
import './styles/panels.css';
import './styles/console.css';
import { useEffect, useRef } from 'react';
import { t } from '../engine/strings';
import { CrashProbe } from './CrashProbe';
import { DevConsole } from './DevConsole';
import { getGame } from './engineHost';
import { PanelBoundary } from './ErrorBoundary';
import { GameProvider, useGame, useStore } from './GameContext';
import { PerfOverlay } from './PerfOverlay';
import { SettingsPanel } from './SettingsPanel';
import { Toasts } from './Toasts';
import { TooltipProvider } from './Tooltip';
import { TopBar } from './TopBar';

/** Root component: mounts the single engine onto the canvas and lays out the HUD. */
export function App() {
  const game = getGame();
  return (
    <GameProvider game={game}>
      <Shell />
    </GameProvider>
  );
}

function Shell() {
  const game = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const settings = useStore(game.settings.store);
  const ui = useStore(game.ui);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return undefined;
    game.mount(canvas, root);
    return () => game.unmount();
  }, [game]);

  return (
    <div ref={rootRef} className={ui.fullscreen === 'maximized' ? 'app is-maximized' : 'app'} data-reduce-motion={settings.reduceMotion ? 'true' : 'false'}>
      <TooltipProvider>
        <canvas ref={canvasRef} className="world-canvas" aria-label={t('app.canvasLabel')} />
        <PanelBoundary name="topbar">
          <TopBar />
        </PanelBoundary>
        <div className="hud">
          {settings.perfOverlay && (
            <PanelBoundary name="perf">
              <PerfOverlay />
            </PanelBoundary>
          )}
          <PanelBoundary name="settings">
            <SettingsPanel />
          </PanelBoundary>
          <PanelBoundary name="console">
            <DevConsole />
          </PanelBoundary>
          <PanelBoundary name="toasts">
            <Toasts />
          </PanelBoundary>
          <PanelBoundary name="probe" onRetry={game.cmd.resetCrashProbe}>
            <CrashProbe />
          </PanelBoundary>
        </div>
      </TooltipProvider>
    </div>
  );
}
