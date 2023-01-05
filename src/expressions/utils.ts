import { ArithmeticExpression, Expression, FunctionCall, Negation, Variable } from './ast';

export function extractVariables(expression: Expression): string[] {
  const variables: Set<string> = new Set();
  const queue: Expression[] = [expression];
  let expr: Expression | undefined;

  while (expr = queue.shift()) {
    if (expr instanceof Variable) {
      variables.add(expr.name);
    } else if (expr instanceof ArithmeticExpression) {
      queue.push(expr.left, expr.right);
    } else if (expr instanceof FunctionCall) {
      queue.push(...expr.args);
    } else if (expr instanceof Negation) {
      queue.push(expr.value);
    }
  }

  return [...variables];
}
