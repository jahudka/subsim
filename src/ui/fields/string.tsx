import { FC, useMemo } from 'react';
import { Children } from '../../types';
import { Field } from './field';
import { FieldValidator, useField } from './utils';

export type StringFieldProps = Children & {
  id?: string;
  value: string;
  validate?: (value: string) => string;
  onChange?: (value: string) => void;
  className?: string;
};

export const StringField: FC<StringFieldProps> = ({ value, validate: validateFn, onChange, className, children, ...props }) => {
  const validate: FieldValidator<string> | undefined = useMemo(() => validateFn && ((el) => validateFn(el.value)), [validateFn]);
  const [state, handleChange] = useField(value, onChange, { validate });

  return (
    <Field type="string" className={className} error={state.error} addon={children}>
      <input type="text" value={state.value} onChange={handleChange} {...props} />
    </Field>
  );
};
