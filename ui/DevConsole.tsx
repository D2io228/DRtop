import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { formatErrorReport } from '../engine/CommandApi';
import { bindingFor } from '../engine/config';
import type { ErrorEntry } from '../engine/ErrorLog';
import { keycap, t } from '../engine/strings';
import { Button } from './Button';
import { useGame, useStore } from './GameContext';

type Tab = 'output' | 'errors';

/** Backquote drawer: command input with history and completion, output log, error list. */
export function DevConsole() {
  const game = useGame();
  const open = useStore(game.ui).consoleOpen;
  const lines = useStore(game.console.lines);
  const errors = useStore(game.errors.store);
  const [tab, setTab] = useState<Tab>('output');
  const [value, setValue] = useState('');
  const historyPos = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else if (document.activeElement instanceof HTMLElement && document.activeElement.closest('.console')) {
      // Return focus to the page so game hotkeys work again.
      document.activeElement.blur();
    }
  }, [open]);

  useLayoutEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, tab]);

  const close = () => game.cmd.setConsoleOpen(false);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const hist = game.console.history;
    switch (e.code) {
      case 'Enter':
      case 'NumpadEnter':
        e.preventDefault();
        game.cmd.runConsole(value);
        setValue('');
        historyPos.current = -1;
        setTab('output');
        break;
      case 'ArrowUp':
        if (hist.length > 0) {
          e.preventDefault();
          historyPos.current = historyPos.current < 0 ? hist.length - 1 : Math.max(0, historyPos.current - 1);
          setValue(hist[historyPos.current]);
        }
        break;
      case 'ArrowDown':
        if (historyPos.current >= 0) {
          e.preventDefault();
          historyPos.current++;
          if (historyPos.current >= hist.length) {
            historyPos.current = -1;
            setValue('');
          } else {
            setValue(hist[historyPos.current]);
          }
        }
        break;
      case 'Tab':
        e.preventDefault();
        setValue(game.console.complete(value));
        break;
      case 'Backquote':
      case 'Escape':
        e.preventDefault();
        close();
        break;
    }
  };

  const consoleKey = bindingFor('toggleConsole');
  return (
    <section className="console drawer drawer--top panel panel--major" data-open={open} inert={!open} aria-hidden={!open} aria-label={t('console.title')}>
      <header className="console__header">
        <h2 className="drawer__title">{t('console.title')}</h2>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'output'} className={tab === 'output' ? 'tab is-selected' : 'tab'} onClick={() => setTab('output')}>
            {t('console.tabOutput')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'errors'} className={tab === 'errors' ? 'tab is-selected' : 'tab'} onClick={() => setTab('errors')}>
            {t('console.tabErrors')}
            {errors.length > 0 && <span className="badge badge--danger num">{errors.length}</span>}
          </button>
        </div>
        <div className="console__actions">
          {tab === 'errors' && errors.length > 0 && (
            <>
              <Button variant="text" ariaLabel={t('console.copyAll')} onClick={() => game.cmd.copyText(errors.map((e) => report(game, e)).join('\n\n———\n\n'), 'toast.errorCopied')}>
                {t('console.copyAll')}
              </Button>
              <Button variant="text" ariaLabel={t('console.clearErrors')} onClick={game.cmd.clearErrors}>
                {t('console.clearErrors')}
              </Button>
            </>
          )}
          <Button icon="close" iconScale={1} className="btn--small" ariaLabel={t('common.close')} onClick={close} tip={{ title: t('common.close'), keys: consoleKey ? [keycap(consoleKey.code), 'Esc'] : ['Esc'] }} />
        </div>
      </header>
      {tab === 'output' ? (
        <div ref={outputRef} className="console__output" role="log" aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} className={`console__line console__line--${l.kind}`}>
              {l.text}
            </div>
          ))}
        </div>
      ) : (
        <div className="console__output console__errors">
          {errors.length === 0 ? <p className="console__empty">{t('console.noErrors')}</p> : [...errors].reverse().map((e) => <ErrorRow key={e.id} entry={e} />)}
        </div>
      )}
      <label className="console__prompt">
        <span className="console__caret" aria-hidden="true">
          {'>'}
        </span>
        <input
          ref={inputRef}
          className="console__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('console.placeholder')}
          aria-label={t('console.inputLabel')}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </label>
    </section>
  );
}

function report(game: ReturnType<typeof useGame>, e: ErrorEntry): string {
  return formatErrorReport(game, e.source, e.message, e.stack, e.count, e.tick);
}

function ErrorRow({ entry }: { entry: ErrorEntry }) {
  const game = useGame();
  const time = new Date(entry.lastAt).toLocaleTimeString();
  return (
    <article className="error-row">
      <div className="error-row__main">
        <p className="error-row__message">
          {entry.message}
          {entry.count > 1 && <span className="badge num">{t('console.errorCount', { n: entry.count })}</span>}
        </p>
        <p className="error-row__meta">{t('console.errorMeta', { source: entry.source, tick: entry.tick, time })}</p>
        {entry.stack && <pre className="error-row__stack">{entry.stack}</pre>}
      </div>
      <Button variant="text" icon="copy" iconScale={1} ariaLabel={t('console.copyError')} onClick={() => game.cmd.copyText(report(game, entry), 'toast.errorCopied')}>
        {t('console.copyError')}
      </Button>
    </article>
  );
}
