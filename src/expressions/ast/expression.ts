import { ArithmeticExpression } from './arithmeticExpression';
import { FunctionCall } from './functionCall';
import { Literal } from './literal';
import { Negation } from './negation';
import { Variable } from './variable';

export type Expression = Literal | Variable | Negation | ArithmeticExpression | FunctionCall;
