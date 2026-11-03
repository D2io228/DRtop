import { PERF } from './config';

export interface FpsStats {
  avg: number;
  low1: number;
}

/**
 * Frame-time history (ring buffer of rAF intervals) plus smoothed per-frame costs.
 * Statistics are computed on demand (≈5×/s) with a preallocated scratch buffer.
 */
export class PerfMonitor {
  readonly history = new Float32Array(PERF.historyFrames);
  head = 0;
  count = 0;
  /** Increments whenever history changes (the sparkline redraws on change). */
  rev = 0;
  simMs = 0;
  renderMs = 0;
  bakeMs = 0;
  workMs = 0;
  ticksPerFrame = 0;
  private readonly scratch = new Float32Array(PERF.historyFrames);

  record(intervalMs: number, simMs: number, renderMs: number, bakeMs: number, ticks: number): void {
    if (intervalMs > 0) {
      this.history[this.head] = intervalMs;
      this.head = (this.head + 1) % this.history.length;
      if (this.count < this.history.length) this.count++;
      this.rev++;
    }
    const k = PERF.timingEma;
    this.simMs += (simMs - this.simMs) * k;
    this.renderMs += (renderMs - this.renderMs) * k;
    this.bakeMs += (bakeMs - this.bakeMs) * k;
    this.workMs = simMs + renderMs + bakeMs;
    this.ticksPerFrame += (ticks - this.ticksPerFrame) * k;
  }

  /** Average FPS over the recent frames and the "1% low" (FPS of the slowest 1% of frames). */
  fps(out: FpsStats): FpsStats {
    const n = this.count;
    if (n === 0) {
      out.avg = 0;
      out.low1 = 0;
      return out;
    }
    const len = this.history.length;
    const avgN = Math.min(n, PERF.fpsAverageFrames);
    let sum = 0;
    for (let i = 1; i <= avgN; i++) sum += this.history[(this.head - i + len) % len];
    out.avg = sum > 0 ? (avgN * 1000) / sum : 0;
    const s = this.scratch.subarray(0, n);
    for (let i = 0; i < n; i++) s[i] = this.history[(this.head - 1 - i + len) % len];
    s.sort();
    const worst = Math.max(1, Math.floor(n * 0.01));
    let wsum = 0;
    for (let i = n - worst; i < n; i++) wsum += s[i];
    out.low1 = wsum > 0 ? (worst * 1000) / wsum : 0;
    return out;
  }

  /** Most recent frame interval in ms. */
  get lastFrameMs(): number {
    if (this.count === 0) return 0;
    return this.history[(this.head - 1 + this.history.length) % this.history.length];
  }
}
