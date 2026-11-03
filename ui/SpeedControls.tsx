import { bindingFor, TIME, type HotkeyAction } from '../engine/config';
import { fmt, keycap, t } from '../engine/strings';
import { speedOf } from '../engine/time';
import { Button } from './Button';
import { useGame, useSlice } from './GameContext';
import { useTooltip } from './Tooltip';

const SPEED_ACTIONS: readonly HotkeyAction[] = ['speed1', 'speed2', 'speed3', 'speed4', 'speed5'];

function keysFor(action: HotkeyAction): readonly string[] | undefined {
  const b = bindingFor(action);
  return b ? [keycap(b.code, b.shift)] : undefined;
}

/** Pause + 1×/2×/5×/10×/25×, with the effective speed when ticks are being dropped. */
export function SpeedControls() {
  const game = useGame();
  const s = useSlice((snap) => ({
    speedIndex: snap.time.speedIndex,
    resume: snap.time.resumeSpeedIndex,
    dropping: snap.time.dropping,
    actual: Math.round(snap.time.effectiveSpeed * 10) / 10,
  }));
  const paused = s.speedIndex === 0;
  const resumeSpeed = speedOf(s.resume);
  const setSpeed = speedOf(paused ? s.resume : s.speedIndex);
  const pauseTitle = paused ? t('speed.resume') : t('speed.pause');
  const pauseDesc = paused ? t('speed.resumeDesc', { speed: resumeSpeed }) : t('speed.pauseDesc');
  const actualText = s.actual >= 10 ? fmt(s.actual) : fmt(s.actual, 1);
  const effTip = useTooltip({ title: t('speed.effectiveTitle'), desc: t('speed.effectiveDesc', { set: setSpeed, actual: actualText }) });
  return (
    <div className="speed" role="group" aria-label={t('speed.groupLabel')}>
      <Button
        icon="pause"
        onClick={game.cmd.togglePause}
        ariaLabel={pauseTitle}
        selected={paused}
        pressed={paused}
        tip={{ title: pauseTitle, desc: pauseDesc, keys: keysFor('togglePause') }}
      />
      {SPEED_ACTIONS.map((action, i) => {
        const index = i + 1;
        const speed = speedOf(index);
        const seconds = TIME.yearSeconds / speed;
        const desc = speed === 1 ? t('speed.desc1') : t('speed.descN', { speed, seconds: seconds >= 10 ? fmt(seconds) : fmt(seconds, 1) });
        const classes = paused && index === s.resume ? 'is-resume' : undefined;
        return (
          <Button
            key={action}
            variant="speed"
            className={classes}
            onClick={() => game.cmd.setSpeed(index)}
            ariaLabel={t('speed.title', { speed })}
            selected={s.speedIndex === index}
            pressed={s.speedIndex === index}
            tip={{ title: t('speed.title', { speed }), desc, keys: keysFor(action) }}
          >
            <span className="num">{t('speed.label', { speed })}</span>
          </Button>
        );
      })}
      {s.dropping && !paused && (
        <span className="speed__effective num" role="status" tabIndex={0} {...effTip}>
          {t('speed.effective', { set: setSpeed, actual: actualText })}
        </span>
      )}
    </div>
  );
}
