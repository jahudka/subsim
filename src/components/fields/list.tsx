import { ReactElement } from 'react';
import { BaseFieldPropsWithIntro, Field } from './field';

export type ListFieldProps<T extends string = string> = BaseFieldPropsWithIntro<T> & {
  options: T[];
};

export function ListField<T extends string = string>({
  options,
  value,
  onChange,
  className,
  intro,
  children,
  ['data-tooltip']: tt,
  ...props
}: ListFieldProps<T>): ReactElement<any, any> | null {
  return (
    <Field type="list" className={className} intro={intro} addon={children} data-tooltip={tt}>
      <select {...props} value={options.indexOf(value)} onChange={(evt) => onChange && onChange(options[evt.target.value])}>
        {options.map((o, i) => (
          <option key={i} value={i}>{o}</option>
        ))}
      </select>
    </Field>
  );
}
