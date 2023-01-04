import { FC } from 'react';
import { Children } from '../../types';
import { Field } from './field';
import { useField } from './utils';

export type ColorFieldProps = Children & {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

function validate(el: HTMLInputElement): string {
  if (!/#(?:[0-9a-f]{3}){1,2}/i.test(el.value)) {
    return '#000';
  }

  return el.value;
}

export const ColorField: FC<ColorFieldProps> = ({ value, onChange, className, children, ...props }) => {
  const [state, handleChange] = useField(value, onChange, { validate });

  return (
    <Field type="color" className={className} error={state.error} addon={children}>
      <input type="color" value={state.value} onChange={handleChange} {...props} />
    </Field>
  );
};
