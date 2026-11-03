import type { Game } from '../engine/Game';
import type { System } from '../engine/Scheduler';
import { seasonOf, yearOf } from '../engine/time';

/** Emits seasonChanged / yearChanged events as the clock crosses boundaries. */
export class CalendarSystem implements System {
  readonly id = 'calendar';
  readonly every = 1;
  private season = -1;
  private year = -1;

  init(g: Game): void {
    this.season = seasonOf(g.tick);
    this.year = yearOf(g.tick);
  }

  tick(g: Game): void {
    const year = yearOf(g.tick);
    const season = seasonOf(g.tick);
    if (year !== this.year) {
      this.year = year;
      g.events.emit('yearChanged', g.tick, 1, { year });
    }
    if (season !== this.season) {
      this.season = season;
      g.events.emit('seasonChanged', g.tick, 0, { year, season });
    }
  }
}
