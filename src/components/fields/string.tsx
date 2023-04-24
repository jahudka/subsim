import { FC, useMemo } from 'react';
import { BaseFieldPropsWithIntro, Field } from './field';
import { FieldValidator, useField } from './utils';

export type StringFieldProps = BaseFieldPropsWithIntro<string> & {
  validate?: (value: string) => string;
};

export const StringField: FC<StringFieldProps> = ({ value, validate: validateFn, onChange, className, intro, ['data-tooltip']: tt, children, ...props }) => {
  const validate: FieldValidator<string> | undefined = useMemo(() => validateFn && ((el) => validateFn(el.value)), [validateFn]);
  const [state, handleChange] = useField(value, onChange, { validate });

  return (
    <Field type="string" className={className} error={state.error} intro={intro} addon={children} data-tooltip={tt}>
      <input {...props} type="text" value={state.value} onChange={handleChange} />
    </Field>
  );
};
