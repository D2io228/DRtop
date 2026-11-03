import { Component, type ContextType, type ErrorInfo, type ReactNode } from 'react';
import { t } from '../engine/strings';
import { GameContext } from './GameContext';

interface PanelProps {
  /** Identifies the panel in error reports ("ui:console"). */
  readonly name: string;
  readonly children: ReactNode;
  /** Called before the boundary resets (clear whatever made the panel crash). */
  readonly onRetry?: () => void;
}

interface State {
  readonly failed: boolean;
}

/** Isolates one panel: a crash shows a small card and is logged; the game keeps running. */
export class PanelBoundary extends Component<PanelProps, State> {
  static override contextType = GameContext;
  declare context: ContextType<typeof GameContext>;
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo): void {
    this.context?.reportError(`ui:${this.props.name}`, error, info.componentStack ?? undefined);
  }

  private readonly retry = (): void => {
    this.props.onRetry?.();
    this.setState({ failed: false });
  };

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <div className={`crash-card panel crash-card--${this.props.name}`} role="alert">
        <p className="crash-card__title">{t('panel.crashed')}</p>
        <p className="crash-card__desc">{t('panel.crashedDesc')}</p>
        <button type="button" className="btn btn--text" onClick={this.retry}>
          {t('panel.retry')}
        </button>
      </div>
    );
  }
}

/** Last line of defense: never a white screen, even if the whole tree fails. */
export class RootBoundary extends Component<{ readonly children: ReactNode }, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="root-crash" role="alert">
        <div className="panel panel--major root-crash__card">
          <h1 className="root-crash__title">{t('app.crashTitle')}</h1>
          <p>{t('app.crashBody')}</p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            {t('app.reload')}
          </button>
        </div>
      </div>
    );
  }
}
