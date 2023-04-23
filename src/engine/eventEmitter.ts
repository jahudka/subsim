export type AnyEventHandler = (...args: any) => Promise<void> | void;

export class EventEmitter {
  private readonly events: Map<string, Set<AnyEventHandler>> = new Map();

  on(event: string, handler: AnyEventHandler): void {
    this.events.has(event) || this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
  }

  once(event: string, handler: AnyEventHandler): void {
    const wrapper = (...args: any) => {
      this.off(event, wrapper);
      return handler(...args);
    };

    this.on(event, wrapper);
  }

  off(event?: string, handler?: AnyEventHandler): void {
    if (event) {
      handler ? this.events.get(event)?.delete(handler) : this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  emit(event: string, ...args: any): void {
    const handlers = this.events.get(event);

    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }
}
