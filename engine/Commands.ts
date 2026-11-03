/**
 * Commands that change simulation state are queued and applied at the start of the next tick
 * (section 3.3), so they happen at deterministic tick boundaries. Powers join this union in 1.8.
 */
export type SimCommand = { readonly kind: 'injectFaultySystem' };

export class CommandQueue {
  private queue: SimCommand[] = [];
  private draining: SimCommand[] = [];

  push(cmd: SimCommand): void {
    this.queue.push(cmd);
  }

  get size(): number {
    return this.queue.length;
  }

  drain(apply: (cmd: SimCommand) => void): void {
    if (this.queue.length === 0) return;
    const batch = this.queue;
    this.queue = this.draining;
    this.draining = batch;
    for (let i = 0; i < batch.length; i++) apply(batch[i]);
    batch.length = 0;
  }
}
