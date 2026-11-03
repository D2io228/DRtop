import type { MouseEvent, ReactNode } from 'react';
import type { IconId } from '../render/icons/iconArt';
import { Icon } from './Icon';
import { useTooltip, type TipContent } from './Tooltip';

interface ButtonProps {
  readonly onClick: () => void;
  readonly ariaLabel: string;
  readonly tip?: TipContent;
  readonly icon?: IconId;
  readonly iconScale?: 1 | 2;
  readonly children?: ReactNode;
  readonly variant?: 'icon' | 'text' | 'chip' | 'speed' | 'primary';
  readonly selected?: boolean;
  /** For toggle buttons: exposes aria-pressed. */
  readonly pressed?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Mouse clicks must not move keyboard focus off the game (Space would re-trigger the button). */
function keepFocus(e: MouseEvent<HTMLButtonElement>): void {
  e.preventDefault();
}

/** The one button: hover / pressed / selected / disabled / focus-visible states and a tooltip. */
export function Button({ onClick, ariaLabel, tip, icon, iconScale = 2, children, variant = 'icon', selected, pressed, disabled, className }: ButtonProps) {
  const tipHandlers = useTooltip(tip ?? null);
  const classes = ['btn', `btn--${variant}`];
  if (selected) classes.push('is-selected');
  if (className) classes.push(className);
  return (
    <button
      type="button"
      className={classes.join(' ')}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={keepFocus}
      onClick={onClick}
      {...tipHandlers}
    >
      {icon && <Icon id={icon} scale={iconScale} />}
      {children}
    </button>
  );
}

interface ToggleProps {
  readonly label: string;
  readonly desc?: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly keys?: readonly string[];
}

/** A settings switch row (role="switch"). */
export function Toggle({ label, desc, checked, onChange, keys }: ToggleProps) {
  return (
    <div className="setting">
      <div className="setting__text">
        <span className="setting__label">
          {label}
          {keys?.map((k) => (
            <kbd key={k} className="keycap keycap--inline">
              {k}
            </kbd>
          ))}
        </span>
        {desc && <span className="setting__desc">{desc}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} className={checked ? 'switch is-on' : 'switch'} onMouseDown={keepFocus} onClick={() => onChange(!checked)}>
        <span className="switch__knob" />
      </button>
    </div>
  );
}
