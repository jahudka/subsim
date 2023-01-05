import { ReactElement } from 'react';
import { Children } from '../../types';
import { Field } from './field';

export type ListFieldProps<T extends string = string> = Children & {
  id?: string;
  options: T[];
  value: T;
  onChange?: (value: T) => void;
  className?: string;
};

export function ListField<T extends string = string>({
  id,
  options,
  value,
  onChange,
  className,
  children,
}: ListFieldProps<T>): ReactElement<any, any> | null {
  return (
    <Field type="list" className={className} addon={children}>
      <select id={id} value={options.indexOf(value)} onChange={(evt) => onChange && onChange(options[evt.target.value])}>
        {options.map((o, i) => (
          <option key={i} value={i}>{o}</option>
        ))}
      </select>
    </Field>
  );
}
