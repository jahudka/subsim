import { FC, ReactNode } from 'react';
import { Children } from '../types';
import { Field } from './field';
import { formatNumber } from './utils';

export type StaticFieldProps = Children & {
  className?: string;
  value?: ReactNode;
  intro?: ReactNode;
  'data-tooltip'?: string;
};

export const StaticField: FC<StaticFieldProps> = ({ value, children, ...props }) => (
  <Field type="static" {...props} addon={children}>
    <span className="field-input">{typeof value === 'number' ? <code>{formatNumber(value)}</code> : value}</span>
  </Field>
);
