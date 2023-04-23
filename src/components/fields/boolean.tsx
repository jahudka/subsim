import { FC } from 'react';
import { BaseFieldProps, Field } from './field';

export type BooleanFieldProps = BaseFieldProps<boolean>;

export const BooleanField: FC<BooleanFieldProps> = ({ value, onChange, className, children, ...props }) => {
  return (
    <Field type="boolean" className={className}>
      <label>
        <input {...props} type="checkbox" checked={value} onChange={(evt) => onChange && onChange(evt.target.checked)} />
        {children}
      </label>
    </Field>
  );
};
