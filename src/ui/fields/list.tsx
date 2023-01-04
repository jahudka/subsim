import { ReactElement } from 'react';
import { Children } from '../../types';
import { Field } from './field';

export type ListFieldOption<T = any> = {
  label: string;
  value: T;
};

export type ListFieldProps<T = any> = Children & {
  id?: string;
  options: ListFieldOption<T>[];
  value: T;
  onChange?: (value: T) => void;
  className?: string;
};

export function ListField<T = any>({
  id,
  options,
  value,
  onChange,
  className,
  children,
}: ListFieldProps<T>): ReactElement<any, any> | null {
  return (
    <Field type="list" className={className} addon={children}>
      <select id={id} value={options.findIndex((o) => o.value === value)} onChange={(evt) => onChange && onChange(options[evt.target.value].value)}>
        {options.map((o, i) => (
          <option key={i} value={i}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
