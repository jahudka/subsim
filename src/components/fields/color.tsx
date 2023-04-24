import { FC } from 'react';
import { BaseFieldPropsWithIntro, Field } from './field';
import { useField } from './utils';

export type ColorFieldProps = BaseFieldPropsWithIntro<string>;

function validate(el: HTMLInputElement): string {
  if (!/#(?:[0-9a-f]{3}){1,2}/i.test(el.value)) {
    return '#000';
  }

  return el.value;
}

export const ColorField: FC<ColorFieldProps> = ({ value, onChange, className, intro, children, ['data-tooltip']: tt, ...props }) => {
  const [state, handleChange] = useField(value, onChange, { validate });

  return (
    <Field type="color" className={className} error={state.error} intro={intro} addon={children} data-tooltip={tt}>
      <input {...props} type="color" value={state.value} onChange={handleChange} />
    </Field>
  );
};
