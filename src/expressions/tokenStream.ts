import { ParseError } from './errors';

export const T_WHITESPACE = 0;
export const T_LITERAL = 1;
export const T_IDENTIFIER = 2;
export const T_OPERATOR = 3;
export const T_PAREN = 4;
export const T_COMMA = 5;

export type Token = [number, string, number];

export class TokenStream {
  private readonly tokens: Token[];
  private readonly ignored: number[];
  private position: number = -1;

  constructor(str: string, ignored: number[] = []) {
    this.tokens = tokenize(str);
    this.ignored = ignored;
  }

  nextToken(...wanted: (number | string)[]): Token | undefined {
    return this.scan(wanted, true, true);
  }

  isNext(...wanted: (number | string)[]): boolean {
    return !!this.scan(wanted, true, false);
  }

  protected scan(wanted: (number | string)[], onlyFirst: boolean, advance: boolean, strings: boolean = false, until: boolean = false, prev: boolean = false): any {
    let res: any = onlyFirst ? undefined : strings ? '' : [];
    let pos = this.position + (prev ? -1 : 1);

    do {
      if (pos < 0 || pos >= this.tokens.length) {
        if (!wanted.length && advance && !prev && pos <= this.tokens.length) {
          this.next();
        }

        return res;
      }

      let token = this.tokens[pos];

      if (!wanted.length || wanted.some((w) => w === token[0] || w === token[1]) !== until) {
        while (advance && !prev && pos > this.position) {
          this.next();
        }

        if (onlyFirst) {
          return strings ? token[1] : token;
        } else if (strings) {
          res += token[1];
        } else {
          res.push(token);
        }
      } else if (until || !this.ignored.includes(token[0])) {
        return res;
      }

      pos += prev ? -1 : 1;
    } while (true);
  }

  protected reset(): void {
    this.position = -1;
  }

  protected next(): void {
    ++this.position;
  }
}

export function tokenize(str: string, need: boolean = true): Token[] {
  const pattern: RegExp = /((?=[\d.])(?:0|[1-9]\d*)?(?:\.\d*)?)|([a-z$][a-z0-9_]*)|([-+*/^])|([()])|(,)|\s+/iy;
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;
  let lastPos: number = 0;

  do {
    match = pattern.exec(str);

    if (!match) {
      if (!need) {
        tokens.push([T_WHITESPACE, str.slice(lastPos), lastPos]);
        return tokens;
      }

      throw new ParseError(`Parse error at or near character ${lastPos + 1} ("${str.charAt(lastPos)}")`);
    }

    tokens.push(matchToToken(match));
    lastPos = pattern.lastIndex;
  } while (match.index + match[0].length < str.length);

  return tokens;
}

function matchToToken(match: RegExpExecArray): Token {
  for (let i = T_LITERAL; i <= T_COMMA; ++i) {
    if (match[i] !== undefined) {
      return [i, match[i], match.index];
    }
  }

  return [T_WHITESPACE, match[0], match.index];
}
