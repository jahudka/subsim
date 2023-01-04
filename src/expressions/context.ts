export type ContextFunction = (this: Context, ...args: number[]) => number;

export class Context {
  readonly variables: Map<string, number> = new Map();
  readonly functions: Map<string, ContextFunction> = new Map();
  private readonly parent?: Context;

  constructor(parent?: Context) {
    this.parent = parent;
  }

  get(variable: string): number {
    const value = this.variables.get(variable);
    return value ?? this.parent?.get(variable) ?? 0;
  }

  has(variable: string): boolean {
    return this.variables.has(variable) || this.parent?.has(variable) || false;
  }

  call(func: string, ...args: number[]): number {
    if (!this.functions.has(func)) {
      if (this.parent) {
        return this.parent.call(func, ...args);
      }

      throw new Error(`Unknown function '${func}'`)
    }

    return this.functions.get(func)!.apply(this, args);
  }
}
