import { t } from '../engine/strings';
import type { ToastView } from '../engine/Toasts';
import { Button } from './Button';
import { useGame, useStore } from './GameContext';
import { Icon } from './Icon';

/** Top-right notifications: max 4, 6 s, hover pauses, similar ones merge. */
export function Toasts() {
  const game = useGame();
  const toasts = useStore(game.toasts.store);
  return (
    <section className="toasts" aria-label={t('toast.regionLabel')} aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </section>
  );
}

function ToastItem({ toast }: { toast: ToastView }) {
  const game = useGame();
  return (
    <div
      className={`toast panel toast--${toast.kind}${toast.leaving ? ' is-leaving' : ''}`}
      role={toast.kind === 'danger' ? 'alert' : 'status'}
      onPointerEnter={() => game.cmd.pauseToast(toast.id, true)}
      onPointerLeave={() => game.cmd.pauseToast(toast.id, false)}
    >
      <Icon id={toast.icon} className="toast__icon" />
      <p className="toast__text">{toast.text}</p>
      <Button variant="icon" className="toast__close" icon="close" iconScale={1} ariaLabel={t('toast.dismiss')} tip={{ title: t('toast.dismiss') }} onClick={() => game.cmd.dismissToast(toast.id)} />
    </div>
  );
}
