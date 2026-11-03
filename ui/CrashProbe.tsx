import { t } from '../engine/strings';
import { useGame, useStore } from './GameContext';

/** Renders nothing; throws when "crashtest ui" asks, to prove panel error boundaries work. */
export function CrashProbe() {
  const game = useGame();
  const crash = useStore(game.ui).crashUi;
  if (crash) throw new Error(t('cmd.crashtest.uiError'));
  return null;
}
