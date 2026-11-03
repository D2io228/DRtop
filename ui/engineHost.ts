import { Game } from '../engine/Game';

/**
 * The one engine per page (rule 4). React components mount/unmount it; they never construct it.
 * On hot reload of this module the previous engine is destroyed before a new one is created.
 */
let instance: Game | null = null;

export function getGame(): Game {
  if (!instance) instance = new Game();
  return instance;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    instance?.destroy();
    instance = null;
  });
}
