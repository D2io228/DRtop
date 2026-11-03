import type { IconId } from '../render/icons/iconArt';
import { useGame } from './GameContext';

interface IconProps {
  readonly id: IconId;
  /** CSS pixels per art pixel: 2 for buttons (32 px), 1 for inline glyphs (16 px). */
  readonly scale?: 1 | 2;
  readonly className?: string;
}

/** A pixel-art icon from the engine's baked icon set (never emoji or icon fonts). */
export function Icon({ id, scale = 2, className }: IconProps) {
  const game = useGame();
  const size = 16 * scale;
  return (
    <img
      className={className ? `icon ${className}` : 'icon'}
      src={game.icons.url(id, scale, window.devicePixelRatio || 1)}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
