import { Context } from '../context';
import { Expression } from './expression';
import { Node } from './node';

export class FunctionCall extends Node {
  readonly name: string;
  readonly args: Expression[];

  constructor(position: number, name: string, args: Expression[]) {
    super(position);
    this.name = name;
    this.args = args;
  }

  evaluate(context: Context): number {
    return context.call(this.name, ...this.args.map((arg) => arg.evaluate(context)));
  }
}
