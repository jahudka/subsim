import { Node } from './node';

export class Literal extends Node {
  readonly value: number;

  constructor(position: number, value: number) {
    super(position);
    this.value = value;
  }

  evaluate(): number {
    return this.value;
  }
}
