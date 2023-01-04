import { Context } from '../context';
import { Node } from './node';

export class Variable extends Node {
  readonly name: string;

  constructor(position: number, name: string) {
    super(position);
    this.name = name;
  }

  evaluate(context: Context): number {
    return context.get(this.name);
  }
}
