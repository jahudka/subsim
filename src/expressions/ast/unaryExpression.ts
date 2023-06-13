import { Context } from '../context';
import { Expression } from './expression';
import { Node } from './node';

export class UnaryExpression extends Node {
  public readonly operator: string;
  public readonly value: Expression;

  constructor(position: number, operator: string, value: Expression) {
    super(position);
    this.operator = operator;
    this.value = value;
  }

  evaluate(context: Context): number {
    switch (this.operator) {
      case '-': return -this.value.evaluate(context);
      case '!': return this.value.evaluate(context) ? 0 : 1;
      default: throw new Error(`Unknown operator: '${this.operator}'`);
    }
  }
}
