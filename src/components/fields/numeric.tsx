import { FC, useMemo } from 'react';
import { BaseFieldPropsWithIntro, Field } from './field';
import { useField } from './utils';

export type NumericFieldProps = BaseFieldPropsWithIntro<number> & {
  min?: number;
  max?: number;
  step?: number;
  slider?: boolean;
};

function createValidator(min?: number, max?: number) {
  const hint =
    min !== undefined && max !== undefined ? ` between ${min} and ${max}`
    : min !== undefined ? ` greater than or equal to ${min}`
    : max !== undefined ? ` less than or equal to ${max}`
    : '';

  return ({ valueAsNumber: value }: HTMLInputElement): number => {
    if (Number.isNaN(value) || min !== undefined && value < min || max !== undefined && value > max) {
      throw new Error(`Please enter a number${hint}.`);
    }

    return value;
  };
}

export const NumericField: FC<NumericFieldProps> = ({ slider, value, onChange, className, intro, children, ['data-tooltip']: tt, ...props }) => {
  const validate = useMemo(() => createValidator(props.min, props.max), [props.min, props.max]);
  const [state, handleChange] = useField(value, onChange, { validate })

  return (
    <Field type={slider ? 'range' : 'numeric'} className={className} error={state.error} intro={intro} addon={children} data-tooltip={tt}>
      <input {...props} type={slider ? 'range' : 'number'} value={state.value} onChange={handleChange} />
    </Field>
  );
};
