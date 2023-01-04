import { Context } from '../context';
import { Expression } from './expression';
import { Node } from './node';

export class Negation extends Node {
  private readonly value: Expression;

  constructor(position: number, value: Expression) {
    super(position);
    this.value = value;
  }

  evaluate(context: Context): number {
    return -this.value.evaluate(context);
  }
}
