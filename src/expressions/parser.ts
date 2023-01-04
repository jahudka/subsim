import { ArithmeticExpression, Expression, FunctionCall, Literal, Negation, Variable } from './ast';
import { ParseError } from './errors';
import {
  T_COMMA,
  T_IDENTIFIER,
  T_LITERAL,
  T_OPERATOR,
  T_PAREN,
  T_WHITESPACE,
  Token,
  TokenStream,
} from './tokenStream';

const EXPR_TOKENS = [
  T_IDENTIFIER,
  T_LITERAL,
  T_OPERATOR,
  T_PAREN,
];

const tokenNames = {
  [T_WHITESPACE]: 'whitespace',
  [T_LITERAL]: 'numeric literal',
  [T_IDENTIFIER]: 'identifier',
  [T_OPERATOR]: 'operator',
  [T_PAREN]: 'parenthesis',
  [T_COMMA]: 'comma',
};

const operatorPrecedence = [
  ['^'],
  ['*', '/'],
  ['+', '-'],
];

// noinspection JSAssignmentUsedAsCondition
export class Parser {
  parse(expression: string): Expression {
    const stream = new TokenStream(expression, [T_WHITESPACE]);
    const expr: Expression = this.parseExpr(stream, true);

    if (stream.isNext(...EXPR_TOKENS)) {
      throw this.parseError(stream, 'end of input');
    }

    return expr;
  }

  private parseExpr(stream: TokenStream, need?: true): Expression;
  private parseExpr(stream: TokenStream, need?: false): Expression | undefined;
  private parseExpr(stream: TokenStream, need: boolean = false): Expression | undefined {
    const buffer: any[] = [];
    let op: boolean | string | null = true;
    let n: number = 0;

    do {
      let token: any;
      let val: any = null;

      if (op) {
        val = this.parseNode(stream);
        op = null;
      } else if (token = stream.nextToken('+', '-', '*', '/', '^')) {
        val = token[1];
        op = token[1];
      }

      if (val) {
        buffer.push(val);
      } else {
        break;
      }

      ++n;
    } while (stream.isNext(...EXPR_TOKENS));

    if (!n) {
      if (need) {
        throw this.parseError(stream, 'an expression');
      } else {
        return undefined;
      }
    } else if (n % 2 === 0) {
      throw this.parseError(stream);
    }

    while (buffer.length > 1) {
      for (const operators of operatorPrecedence) {
        for (let i = 1; i < n; i += 2) {
          if (operators.includes(buffer[i])) {
            buffer.splice(i - 1, 3, new ArithmeticExpression(buffer[i - 1], buffer[i], buffer[i + 1]));
            i -= 2;
            n -= 2;
          }
        }
      }
    }

    return buffer[0];
  }

  private parseNode(stream: TokenStream, need: true): Expression;
  private parseNode(stream: TokenStream, need?: false): Expression | undefined;
  private parseNode(stream: TokenStream, need: boolean = false): Expression | undefined {
    let token: Token | undefined;

    if (stream.nextToken('(')) {
      const value = this.parseExpr(stream);
      this.consume(stream, true, ')');
      return value;
    } else if (token = stream.nextToken(T_LITERAL)) {
      return new Literal(token[2], parseFloat(token[1]));
    } else if (token = stream.nextToken(T_IDENTIFIER)) {
      if (stream.isNext('(')) {
        return this.parseFunctionCall(token[2], token[1], stream);
      } else {
        return new Variable(token[2], token[1]);
      }
    } else if (token = stream.nextToken('-')) {
      return new Negation(token[2], this.parseNode(stream, true));
    } else if (need) {
      throw this.parseError(stream, 'a statement');
    } else {
      return undefined;
    }
  }

  private parseExpressionList(stream: TokenStream, need: boolean = false): Expression[] {
    const expressions: Expression[] = [];
    let expr: Expression | undefined;

    while (expr = this.parseExpr(stream)) {
      expressions.push(expr);
      stream.nextToken(',');
    }

    if (need && !expressions.length) {
      throw this.parseError(stream, 'one or more expressions');
    }

    return expressions;
  }

  private parseFunctionCall(position: number, name: string, stream: TokenStream): FunctionCall {
    this.consume(stream, true, '(');
    const fc = new FunctionCall(position, name, this.parseExpressionList(stream));
    this.consume(stream, true, ')');
    return fc;
  }

  private consume(stream: TokenStream, need: boolean = true, ...tokens: string[]): boolean {
    for (const token of tokens) {
      if (!stream.nextToken(token)) {
        if (need) {
          throw this.parseError(stream, `"${token}"`);
        }

        return false;
      }
    }

    return true;
  }

  private parseError(stream: TokenStream, hint?: string) {
    const token = stream.nextToken(...EXPR_TOKENS);
    const message = token ? `${tokenNames[token[0]]} "${token[1]}" at offset ${token[2]}` : 'end of input';
    const suffix = hint ? `, expected ${hint}` : '';
    return new ParseError(`Unexpected ${message}${suffix}`);
  }
}
