import classNames from 'classnames';
import { FC, ReactNode, useState } from 'react';
import {
  T_IDENTIFIER,
  T_LITERAL,
  Token,
  tokenize,
} from '../../expressions';
import { ExpressionProperty } from '../../state';
import { Children } from '../types';
import { Field } from './field';

export type ExpressionFieldProps = Children & {
  id?: string;
  state: ExpressionProperty;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  intro?: ReactNode;
  'data-tooltip'?: string;
};

export const ExpressionField: FC<ExpressionFieldProps> = ({ state, onChange, className, intro, children, ['data-tooltip']: tt, ...props }) => {
  const [focus, setFocus] = useState(false);
  const value = Number.isNaN(state.value) ? '?' : state.value.toFixed(2).replace(/\.?0+$/, '');
  const complex = !state.error && state.source !== value;

  return (
    <Field
      type="expression"
      className={classNames(className, complex && 'field-expression-complex')}
      error={state.error}
      intro={intro}
      addon={children}
      tooltip={complex && (focus ? value : highlight(state.source))}
      forceTooltip={focus && complex}
      data-tooltip={tt}>
      <div className="field-expression-editor">
        <input
          type="text"
          onChange={(evt) => onChange(evt.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={focus ? state.source : value}
          autoCapitalize="false"
          autoComplete="false"
          autoCorrect="false"
          {...props} />
      </div>
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
