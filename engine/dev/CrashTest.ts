import type { RenderContext, RenderLayer } from '../../render/Renderer';
import type { Game } from '../Game';
import type { System } from '../Scheduler';
import { t } from '../strings';

export const CRASH_SYSTEM_ID = 'crashtest';
export const CRASH_LAYER_ID = 'crashtest';

/** A system that always throws: proves the scheduler isolates and suspends failing systems. */
export class CrashTestSystem implements System {
  readonly id = CRASH_SYSTEM_ID;
  readonly every = 1;

  init(): void {
    // Nothing to prepare: the failure happens in tick().
  }

  tick(_g: Game): void {
    throw new Error(t('cmd.crashtest.simError', { id: this.id }));
  }
}

/** A render layer that always throws: proves render isolation. */
export class CrashTestLayer implements RenderLayer {
  readonly id = CRASH_LAYER_ID;

  draw(rc: RenderContext): void {
    // Touch the context first so a half-drawn layer is also covered by save()/restore().
    rc.ctx.globalAlpha = 0.5;
    throw new Error(t('cmd.crashtest.renderError', { id: this.id }));
  }
}
