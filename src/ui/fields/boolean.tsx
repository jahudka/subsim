import { FC } from 'react';
import { Children } from '../../types';
import { Field } from './field';

export type BooleanFieldProps = Children & {
  id?: string;
  value: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
};

export const BooleanField: FC<BooleanFieldProps> = ({ value, onChange, className, children, ...props }) => {
  return (
    <Field type="boolean" className={className} addon={children}>
      <input type="checkbox" checked={value} onChange={(evt) => onChange && onChange(evt.target.checked)} {...props} />
    </Field>
  );
};
