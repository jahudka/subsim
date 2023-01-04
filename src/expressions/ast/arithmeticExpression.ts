import { Context } from '../context';
import { Expression } from './expression';
import { Node } from './node';

export class ArithmeticExpression extends Node {
  public readonly left: Expression;
  public readonly operator: string;
  public readonly right: Expression;

  constructor(
    left: Expression,
    operator: string,
    right: Expression
  ) {
    super(left.position);
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  evaluate(context: Context): number {
    const left = this.left.evaluate(context);
    const right = this.right.evaluate(context);

    switch (this.operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '^': return left ** right;
      default: throw new Error(`Unknown operator: '${this.operator}'`);
    }
  }
}
