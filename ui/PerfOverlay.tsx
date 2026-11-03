import { useEffect, useRef } from 'react';
import { PERF } from '../engine/config';
import { fmt, t } from '../engine/strings';
import { speedOf } from '../engine/time';
import { useGame, useSlice } from './GameContext';

const SPARK_W = 240;
const SPARK_H = 40;
/** The sparkline's vertical scale tops out at this frame time (ms). */
const SPARK_MAX_MS = 50;

/** F3 overlay: FPS, 1% low, frame-time sparkline, sim/render/bake cost, speed, quality. */
export function PerfOverlay() {
  const game = useGame();
  const p = useSlice((s) => s.perf);
  const time = useSlice((s) => ({ speedIndex: s.time.speedIndex, resume: s.time.resumeSpeedIndex, actual: s.time.effectiveSpeed }));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(SPARK_W * dpr);
    const h = Math.round(SPARK_H * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const pal = game.palette;
    ctx.clearRect(0, 0, w, h);
    const hist = game.perf.history;
    const n = game.perf.count;
    const len = hist.length;
    const barW = w / len;
    const ok = pal.base('success').css;
    const warn = pal.base('gold').css;
    const bad = pal.base('danger').css;
    for (let i = 0; i < n; i++) {
      const ms = hist[(game.perf.head - n + i + len) % len];
      const bh = Math.max(1, Math.round((Math.min(ms, SPARK_MAX_MS) / SPARK_MAX_MS) * h));
      ctx.fillStyle = ms <= PERF.budget.frameMs * 1.1 ? ok : ms <= PERF.budget.frameMs * 2 ? warn : bad;
      ctx.fillRect(Math.floor((len - n + i) * barW), h - bh, Math.max(1, Math.ceil(barW)), bh);
    }
    const y = Math.round(h - (PERF.budget.frameMs / SPARK_MAX_MS) * h) + 0.5;
    ctx.fillStyle = pal.highlight.css;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(0, y, w, Math.max(1, Math.round(dpr)));
    ctx.globalAlpha = 1;
  }, [game, p.historyRev]);

  const setSpeed = speedOf(time.speedIndex === 0 ? time.resume : time.speedIndex);
  const ms = (v: number) => t('perf.ms', { value: fmt(v, 2) });
  return (
    <section className="perf panel" aria-label={t('perf.title')}>
      <h2 className="perf__title">{t('perf.title')}</h2>
      <dl className="perf__grid">
        <dt>{t('perf.fps')}</dt>
        <dd className={p.fpsAvg < 55 ? 'is-warn' : undefined}>{t('perf.fpsValue', { avg: fmt(p.fpsAvg), low: fmt(p.fpsLow) })}</dd>
        <dt>{t('perf.frame')}</dt>
        <dd>{t('perf.ms', { value: fmt(p.frameMs, 1) })}</dd>
        <dt>{t('perf.sim')}</dt>
        <dd>{ms(p.simMs)}</dd>
        <dt>{t('perf.render')}</dt>
        <dd>{ms(p.renderMs)}</dd>
        <dt>{t('perf.bake')}</dt>
        <dd>{ms(p.bakeMs)}</dd>
        <dt>{t('perf.ticks')}</dt>
        <dd>{fmt(p.ticksPerFrame, 2)}</dd>
        <dt>{t('perf.speed')}</dt>
        <dd>{t('perf.speedValue', { set: setSpeed, actual: fmt(time.actual, 1) })}</dd>
        <dt>{t('perf.quality')}</dt>
        <dd>{t(`quality.${Math.min(p.quality, 2) as 0 | 1 | 2}`)}</dd>
        <dt>{t('perf.systems')}</dt>
        <dd className={p.systemsSuspended > 0 ? 'is-bad' : undefined}>{t('perf.systemsValue', { active: p.systemsActive, suspended: p.systemsSuspended })}</dd>
      </dl>
      <canvas ref={canvasRef} className="perf__spark" style={{ width: SPARK_W, height: SPARK_H }} role="img" aria-label={t('perf.sparkLabel', { n: PERF.historyFrames })} />
    </section>
  );
}
