import { Context } from '../context';

export abstract class Node {
  readonly position: number;

  constructor(position: number) {
    this.position = position;
  }

  abstract evaluate(context: Context): number;
}
