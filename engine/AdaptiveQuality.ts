import { PERF } from './config';

/**
 * Steps decorative quality down when the smoothed frame work exceeds the frame budget for
 * PERF.adaptive.overBudgetMs, and back up after PERF.adaptive.headroomMs of headroom.
 * Level 0 is full quality. Never affects the simulation (rule 6).
 */
export class AdaptiveQuality {
  level = 0;
  private smoothed = 0;
  private overMs = 0;
  private underMs = 0;

  /** Returns +1 / −1 when the level changed this frame, 0 otherwise. */
  update(workMs: number, dtMs: number): number {
    const a = PERF.adaptive;
    this.smoothed += (workMs - this.smoothed) * a.workEma;
    const budget = PERF.budget.frameMs;
    if (this.smoothed > budget) {
      this.overMs += dtMs;
      this.underMs = 0;
    } else if (this.smoothed < budget * a.headroomRatio) {
      this.underMs += dtMs;
      this.overMs = 0;
    } else {
      this.overMs = 0;
      this.underMs = 0;
    }
    if (this.overMs >= a.overBudgetMs && this.level < a.levels - 1) {
      this.level++;
      this.overMs = 0;
      return 1;
    }
    if (this.underMs >= a.headroomMs && this.level > 0) {
      this.level--;
      this.underMs = 0;
      return -1;
    }
    return 0;
  }

  get particleScale(): number {
    return PERF.adaptive.particleScale[this.level] ?? 1;
  }

  get decorScale(): number {
    return PERF.adaptive.decorScale[this.level] ?? 1;
  }

  get smoothedWorkMs(): number {
    return this.smoothed;
  }
}
