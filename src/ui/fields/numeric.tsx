import { FC } from 'react';
import { Children } from '../../types';
import { Field } from './field';
import { useField } from './utils';

export type NumericFieldProps = Children & {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
  onChange?: (value: number) => void;
  className?: string;
};

function validate(el: HTMLInputElement): number {
  if (Number.isNaN(el.valueAsNumber)) {
    throw new Error('Please enter a number.');
  }

  return el.valueAsNumber;
}

export const NumericField: FC<NumericFieldProps> = ({ slider, value, onChange, className, children, ...props }) => {
  const [state, handleChange] = useField(value, onChange, { validate })

  return (
    <Field type={slider ? 'range' : 'numeric'} className={className} error={state.error} addon={children}>
      <input type={slider ? 'range' : 'number'} value={state.value} onChange={handleChange} {...props} />
    </Field>
  );
};
