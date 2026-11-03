import { UI } from '../config';
import { Store } from '../Store';
import { t, type StrKey, type StrParams } from '../strings';
import { describeError } from '../ErrorLog';

export type LineKind = 'input' | 'output' | 'error' | 'success' | 'muted';

export interface ConsoleLine {
  readonly id: number;
  readonly kind: LineKind;
  readonly text: string;
}

export interface ConsoleOut {
  print(text: string, kind?: LineKind): void;
}

export interface DevCommand {
  readonly name: string;
  readonly usageKey: StrKey;
  readonly descKey: StrKey;
  readonly descParams?: StrParams;
  run(args: readonly string[], out: ConsoleOut): void;
}

/** Command registry, history and output log of the Dev Console (the React panel only renders it). */
export class DevConsole implements ConsoleOut {
  readonly lines = new Store<readonly ConsoleLine[]>([]);
  private readonly commands = new Map<string, DevCommand>();
  private readonly hist: string[] = [];
  private nextId = 1;

  constructor(private readonly onError: (command: string, err: unknown) => void) {
    this.print(t('console.welcome'), 'muted');
  }

  register(cmd: DevCommand): void {
    this.commands.set(cmd.name, cmd);
  }

  get(name: string): DevCommand | undefined {
    return this.commands.get(name);
  }

  list(): DevCommand[] {
    return [...this.commands.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Entered commands, oldest first. */
  get history(): readonly string[] {
    return this.hist;
  }

  /** Completes a command name from its prefix (unique match or longest common prefix). */
  complete(prefix: string): string {
    const p = prefix.trimStart().toLowerCase();
    if (p.length === 0 || p.includes(' ')) return prefix;
    const matches = this.list()
      .map((c) => c.name)
      .filter((n) => n.startsWith(p));
    if (matches.length === 0) return prefix;
    if (matches.length === 1) return `${matches[0]} `;
    let common = matches[0];
    for (const m of matches) {
      let i = 0;
      while (i < common.length && i < m.length && common[i] === m[i]) i++;
      common = common.slice(0, i);
    }
    return common.length > p.length ? common : prefix;
  }

  exec(line: string): void {
    const text = line.trim();
    if (text.length === 0) return;
    if (this.hist[this.hist.length - 1] !== text) {
      this.hist.push(text);
      if (this.hist.length > UI.console.historyMax) this.hist.shift();
    }
    this.print(`> ${text}`, 'input');
    const parts = text.split(/\s+/);
    const name = parts[0].toLowerCase();
    const cmd = this.commands.get(name);
    if (!cmd) {
      this.print(t('console.unknown', { name }), 'error');
      return;
    }
    try {
      cmd.run(parts.slice(1), this);
    } catch (err) {
      this.print(t('console.failed', { name, message: describeError(err).message }), 'error');
      this.onError(name, err);
    }
  }

  print(text: string, kind: LineKind = 'output'): void {
    const cur = this.lines.get();
    const next = cur.length >= UI.console.maxLines ? cur.slice(cur.length - UI.console.maxLines + 1) : cur.slice();
    next.push({ id: this.nextId++, kind, text });
    this.lines.set(next);
  }

  clear(): void {
    this.lines.set([]);
  }
}
