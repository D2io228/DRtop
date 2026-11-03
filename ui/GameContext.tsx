import { createContext, useContext, useRef, useSyncExternalStore, type ReactNode } from 'react';
import type { Game } from '../engine/Game';
import type { UiSnapshot } from '../engine/Snapshot';
import { shallowEqual, type Store } from '../engine/Store';

export const GameContext = createContext<Game | null>(null);

export function GameProvider({ game, children }: { game: Game; children: ReactNode }) {
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const g = useContext(GameContext);
  if (!g) throw new Error('useGame() outside <GameProvider>');
  return g;
}

/** Subscribes to an engine store (toasts, settings, panel state, console lines). */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/**
 * Subscribes to a slice of the UI snapshot. The component re-renders only when the selected
 * slice changes by shallow comparison (rule 3), even though the snapshot itself changes 5×/s.
 */
export function useSlice<T>(select: (s: UiSnapshot) => T, isEqual: (a: T, b: T) => boolean = shallowEqual): T {
  const game = useGame();
  const cache = useRef<{ snap: UiSnapshot; value: T } | null>(null);
  const getSnapshot = (): T => {
    const snap = game.store.get();
    const c = cache.current;
    if (c && c.snap === snap) return c.value;
    const value = select(snap);
    if (c && isEqual(c.value, value)) {
      c.snap = snap;
      return c.value;
    }
    cache.current = { snap, value };
    return value;
  };
  return useSyncExternalStore(game.store.subscribe, getSnapshot, getSnapshot);
}
