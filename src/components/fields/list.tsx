import { ReactElement, ReactNode } from 'react';
import { BaseFieldPropsWithIntro, Field } from './field';

export type ListFieldProps<T extends string = string> = BaseFieldPropsWithIntro<T> & {
  options: (T | [value: T, label: ReactNode])[];
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
  const opts = normalizeOptions(options);

  return (
    <Field type="list" className={className} intro={intro} addon={children} data-tooltip={tt}>
      <select {...props} value={value} onChange={(evt) => onChange && onChange(evt.target.value as T)}>
        {opts.map(([option, label]) => (
          <option key={option} value={option}>{label}</option>
        ))}
      </select>
    </Field>
  );
}

function normalizeOptions<T extends string = string>(
  options: (T | [value: T, label: ReactNode])[],
): [value: T, label: ReactNode][] {
  return options.map((o) => Array.isArray(o) ? o : [o, o]);
}
