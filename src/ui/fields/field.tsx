import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { Children } from '../../types';

export type FieldProps = Children & {
  type?: string;
  className?: string;
  error?: string;
  addon?: ReactNode;
};

export const Field: FC<FieldProps> = ({ type, className, error, addon, children }) => (
  <div className={classNames('field', type && `field-${type}`, error && 'field-invalid', className)}>
    {children}
    {addon && <span className="field-addon">{addon}</span>}
    {error && <span className="field-tooltip field-error">{error}</span>}
  </div>
);
