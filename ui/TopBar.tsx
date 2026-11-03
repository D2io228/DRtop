import { bindingFor } from '../engine/config';
import { keycap, t } from '../engine/strings';
import type { IconId } from '../render/icons/iconArt';
import { Button } from './Button';
import { useGame, useSlice, useStore } from './GameContext';
import { Icon } from './Icon';
import { SpeedControls } from './SpeedControls';
import { useTooltip } from './Tooltip';

const SEASON_ICONS: readonly IconId[] = ['spring', 'summer', 'autumn', 'winter'];

/** Top bar (44 px): identity and seed · date and speed · settings and fullscreen. */
export function TopBar() {
  return (
    <header className="topbar panel" aria-label={t('app.hudLabel')}>
      <div className="topbar__left">
        <span className="wordmark" aria-label={t('app.title')}>
          {t('app.title')}
        </span>
        <SeedChip />
      </div>
      <div className="topbar__center">
        <DateDisplay />
        <SpeedControls />
      </div>
      <div className="topbar__right">
        <SettingsButton />
        <FullscreenButton />
      </div>
    </header>
  );
}

function SeedChip() {
  const game = useGame();
  const seed = useSlice((s) => s.seed);
  return (
    <Button
      variant="chip"
      className="seed-chip"
      onClick={game.cmd.copySeed}
      ariaLabel={`${t('topbar.seedTitle')}: ${seed.text}`}
      tip={{ title: t('topbar.seedTitle'), desc: t('topbar.seedDesc') }}
      icon="copy"
      iconScale={1}
    >
      <span className="seed-chip__label">{t('topbar.seed')}</span>
      <span className="seed-chip__value num">{seed.text}</span>
    </Button>
  );
}

function DateDisplay() {
  const date = useSlice((s) => ({ year: s.time.year, season: s.time.season }));
  const season = t(`season.${date.season}`);
  const tip = useTooltip({ title: t('topbar.dateTitle', { season, year: date.year }), desc: t('topbar.dateDesc') });
  return (
    <div className="date" tabIndex={0} aria-label={t('topbar.dateTitle', { season, year: date.year })} {...tip}>
      <Icon id={SEASON_ICONS[date.season]} />
      <span className="date__text">
        <span className="date__year-label">{t('topbar.year')} </span>
        <span className="num">{date.year}</span>
        <span className="date__season">
          {' '}
          {t('topbar.dateSeparator')} {season}
        </span>
      </span>
    </div>
  );
}

function SettingsButton() {
  const game = useGame();
  const open = useStore(game.ui).settingsOpen;
  return (
    <Button
      icon="gear"
      onClick={game.cmd.toggleSettings}
      ariaLabel={t('settings.open')}
      selected={open}
      pressed={open}
      tip={{ title: t('settings.open'), desc: t('settings.openDesc') }}
    />
  );
}

function FullscreenButton() {
  const game = useGame();
  const mode = useStore(game.ui).fullscreen;
  const active = mode !== 'none';
  const title = mode === 'fullscreen' ? t('fullscreen.exit') : mode === 'maximized' ? t('fullscreen.exitMaximized') : t('fullscreen.enter');
  const desc = mode === 'fullscreen' ? t('fullscreen.exitDesc') : mode === 'maximized' ? t('fullscreen.exitMaximizedDesc') : t('fullscreen.enterDesc');
  const esc = bindingFor('escape');
  return (
    <Button
      icon={active ? 'collapse' : 'expand'}
      onClick={game.cmd.toggleFullscreen}
      ariaLabel={title}
      pressed={active}
      tip={{ title, desc, keys: active && esc ? [keycap(esc.code)] : undefined }}
    />
  );
}
