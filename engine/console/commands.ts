import { ROBUSTNESS, UI } from '../config';
import { CrashTestLayer } from '../dev/CrashTest';
import type { Game } from '../Game';
import { fmt, t } from '../strings';
import { seasonOf, speedOf, yearOf } from '../time';
import type { DevConsole } from './DevConsole';

/** Step 1.1 commands: help, seed, stats, events, crashtest, clear. Later steps register more. */
export function registerCoreCommands(con: DevConsole, g: Game): void {
  con.register({
    name: 'help',
    usageKey: 'cmd.help.usage',
    descKey: 'cmd.help.desc',
    run(args, out) {
      const one = args[0] ? con.get(args[0].toLowerCase()) : undefined;
      const list = one ? [one] : con.list();
      if (!one) out.print(t('cmd.help.header'), 'muted');
      for (const c of list) out.print(t('cmd.help.line', { usage: t(c.usageKey), desc: t(c.descKey, c.descParams) }));
    },
  });

  con.register({
    name: 'seed',
    usageKey: 'cmd.seed.usage',
    descKey: 'cmd.seed.desc',
    run(args, out) {
      if (args.length > 0) {
        g.setSeed(args.join(' '));
        out.print(t('cmd.seed.set', { text: g.seed.text, value: g.seed.value }), 'success');
      } else {
        out.print(t('cmd.seed.show', { text: g.seed.text, value: g.seed.value }));
      }
    },
  });

  con.register({
    name: 'stats',
    usageKey: 'cmd.stats.usage',
    descKey: 'cmd.stats.desc',
    run(_args, out) {
      const fps = g.perf.fps({ avg: 0, low1: 0 });
      const loop = g.loop;
      out.print(
        t('cmd.stats.time', {
          tick: g.tick,
          season: t(`season.${seasonOf(g.tick)}`),
          year: yearOf(g.tick),
          set: fmt(speedOf(loop.paused ? loop.resumeSpeedIndex : loop.speedIndex)),
          actual: fmt(loop.effectiveSpeed, 1),
          paused: loop.paused ? t('cmd.stats.paused') : '',
        }),
      );
      out.print(t('cmd.stats.fps', { avg: fmt(fps.avg, 1), low: fmt(fps.low1, 1), frame: fmt(g.perf.lastFrameMs, 1) }));
      out.print(
        t('cmd.stats.cost', {
          sim: fmt(g.perf.simMs, 2),
          render: fmt(g.perf.renderMs, 2),
          bake: fmt(g.perf.bakeMs, 2),
          ticks: fmt(g.perf.ticksPerFrame, 2),
        }),
      );
      out.print(t('cmd.stats.quality', { level: t(`quality.${g.quality.level as 0 | 1 | 2}`) }));
      out.print(t('cmd.stats.systemsHeader'), 'muted');
      for (const s of g.scheduler.list()) {
        out.print(
          t('cmd.stats.system', {
            id: s.id,
            every: s.every,
            ms: fmt(s.avgMs, 3),
            status: s.suspended ? t('cmd.stats.statusSuspended') : t('cmd.stats.statusOk'),
          }),
          s.suspended ? 'error' : 'output',
        );
      }
      out.print(t('cmd.stats.layersHeader'), 'muted');
      for (const l of g.renderer.list()) {
        out.print(
          t('cmd.stats.layer', { id: l.id, ms: fmt(l.avgMs, 3), status: l.suspended ? t('cmd.stats.statusSuspended') : t('cmd.stats.statusOk') }),
          l.suspended ? 'error' : 'output',
        );
      }
      out.print(t('cmd.stats.events', { events: g.events.totalEmitted, errors: g.errors.totalReported }));
      out.print(t('cmd.stats.seed', { text: g.seed.text, value: g.seed.value }));
    },
  });

  con.register({
    name: 'events',
    usageKey: 'cmd.events.usage',
    descKey: 'cmd.events.desc',
    descParams: { n: UI.console.defaultEventCount },
    run(args, out) {
      const parsed = args[0] ? parseInt(args[0], 10) : UI.console.defaultEventCount;
      const n = Math.max(1, Math.min(UI.console.maxEventCount, ROBUSTNESS.eventHistory, Number.isFinite(parsed) ? parsed : UI.console.defaultEventCount));
      const list = g.events.recent(n);
      if (list.length === 0) {
        out.print(t('cmd.events.none'), 'muted');
        return;
      }
      for (const e of list) {
        const data = Object.entries(e.data)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(' ');
        out.print(t('cmd.events.line', { tick: e.tick, type: e.type, importance: e.importance, data }));
      }
    },
  });

  con.register({
    name: 'crashtest',
    usageKey: 'cmd.crashtest.usage',
    descKey: 'cmd.crashtest.desc',
    run(args, out) {
      const target = (args[0] ?? 'sim').toLowerCase();
      if (target === 'sim') {
        g.commands.push({ kind: 'injectFaultySystem' });
        out.print(t('cmd.crashtest.sim', { n: ROBUSTNESS.maxConsecutiveFailures }), 'success');
        if (g.loop.paused) out.print(t('cmd.crashtest.simPaused'), 'muted');
      } else if (target === 'render') {
        g.renderer.addLayer(new CrashTestLayer());
        out.print(t('cmd.crashtest.render', { n: ROBUSTNESS.maxConsecutiveFailures }), 'success');
      } else if (target === 'ui') {
        g.ui.patch({ crashUi: true });
        out.print(t('cmd.crashtest.ui'), 'success');
      } else {
        out.print(t('cmd.crashtest.bad', { target }), 'error');
      }
    },
  });

  con.register({
    name: 'clear',
    usageKey: 'cmd.clear.usage',
    descKey: 'cmd.clear.desc',
    run() {
      con.clear();
    },
  });
}
