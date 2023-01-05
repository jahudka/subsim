import { FC, ReactNode } from 'react';
import Editor from 'react-simple-code-editor';
import {
  T_IDENTIFIER,
  T_LITERAL,
  Token,
  tokenize,
} from '../../expressions';
import { ExpressionProperty } from '../../state';
import { Children } from '../../types';
import { Field } from './field';

export type ExpressionFieldProps = Children & {
  id?: string;
  state: ExpressionProperty;
  onChange: (value: string) => void;
  className?: string;
};

export const ExpressionField: FC<ExpressionFieldProps> = ({ id, state, onChange, className, children }) => {
  const value = Number.isNaN(state.value) ? '?' : state.value.toFixed(2).replace(/\.?0+$/, '');

  return (
    <Field type="expression" className={className} error={state.error} addon={children}>
      <Editor textareaId={id} onValueChange={onChange} highlight={highlight} value={state.source} ignoreTabKey />
      <span className="field-tooltip field-expression-source">{highlight(state.source)}</span>
      <span className="field-tooltip field-expression-value">{value}</span>
    </Field>
  );
};

function highlight(source: string): ReactNode {
  return tokenize(source, false).map((token, i) => {
    const className = getTokenClass(token);
    return className ? <span key={i} className={className}>{token[1]}</span> : token[1];
  });
}

function getTokenClass(token: Token): string | undefined {
  switch (token[0]) {
    case T_LITERAL: return 'hl-literal';
    case T_IDENTIFIER: return 'hl-identifier';
    default: return undefined;
  }
}
