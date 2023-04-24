import { FC } from 'react';
import { BaseFieldProps, Field } from './field';

export type BooleanFieldProps = BaseFieldProps<boolean>;

export const BooleanField: FC<BooleanFieldProps> = ({ value, onChange, className, children, ['data-tooltip']: tt, ...props }) => {
  return (
    <Field type="boolean" className={className}>
      <label data-tooltip={tt}>
        <input {...props} type="checkbox" checked={value} onChange={(evt) => onChange && onChange(evt.target.checked)} />
        {children}
      </label>
    </Field>
  );
};
