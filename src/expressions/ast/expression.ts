import { BinaryExpression } from './binaryExpression';
import { FunctionCall } from './functionCall';
import { Literal } from './literal';
import { UnaryExpression } from './unaryExpression';
import { Variable } from './variable';

export type Expression = Literal | Variable | UnaryExpression | BinaryExpression | FunctionCall;
