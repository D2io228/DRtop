import { bindingFor } from '../engine/config';
import { keycap, t } from '../engine/strings';
import { Button, Toggle } from './Button';
import { useGame, useStore } from './GameContext';

/** Settings drawer. Options appear here as their features land (rule 15). */
export function SettingsPanel() {
  const game = useGame();
  const open = useStore(game.ui).settingsOpen;
  const s = useStore(game.settings.store);
  const perfKey = bindingFor('togglePerf');
  const consoleKey = bindingFor('toggleConsole');
  return (
    <aside className="drawer drawer--right panel panel--major" data-open={open} inert={!open} aria-hidden={!open} aria-label={t('settings.title')}>
      <header className="drawer__header">
        <h2 className="drawer__title">{t('settings.title')}</h2>
        <Button icon="close" iconScale={1} className="btn--small" ariaLabel={t('common.close')} onClick={() => game.cmd.setSettingsOpen(false)} tip={{ title: t('common.close'), keys: ['Esc'] }} />
      </header>
      <div className="drawer__body">
        <section className="settings-section">
          <h3 className="settings-section__title">{t('settings.section.display')}</h3>
          <Toggle label={t('settings.reduceMotion')} desc={t('settings.reduceMotionDesc')} checked={s.reduceMotion} onChange={(v) => game.cmd.setSetting('reduceMotion', v)} />
        </section>
        <section className="settings-section">
          <h3 className="settings-section__title">{t('settings.section.developer')}</h3>
          <Toggle
            label={t('settings.perfOverlay')}
            desc={t('settings.perfOverlayDesc')}
            checked={s.perfOverlay}
            onChange={(v) => game.cmd.setSetting('perfOverlay', v)}
            keys={perfKey ? [keycap(perfKey.code)] : undefined}
          />
          <div className="setting">
            <div className="setting__text">
              <span className="setting__label">
                {t('settings.consoleHint')}
                {consoleKey && <kbd className="keycap keycap--inline">{keycap(consoleKey.code)}</kbd>}
              </span>
              <span className="setting__desc">{t('settings.consoleHintDesc')}</span>
            </div>
            <Button variant="text" ariaLabel={t('settings.consoleHint')} onClick={() => game.cmd.setConsoleOpen(true)}>
              {t('settings.openConsole')}
            </Button>
          </div>
        </section>
      </div>
    </aside>
  );
}
