import { ChangeEvent, useCallback } from 'react';
import { useCurrent, useDerivedState } from '../hooks';

export type FieldState = {
  value: string;
  error?: string;
};

export type FieldStateFactory<T> = (value: T) => FieldState;
export type FieldValidator<T> = (field: HTMLInputElement) => T;
export type FieldUpdateHandler<T> = (value: T) => void;
export type FieldChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => void;

export type FieldOptions<T> = T extends string
  ? { factory?: FieldStateFactory<T>, validate?: FieldValidator<T> }
  : { factory?: FieldStateFactory<T>, validate: FieldValidator<T> };

const defaultFactory: FieldStateFactory<any> = (value) => ({ value: value.toString() });

export function useField<T>(
  value: T,
  onChange?: FieldUpdateHandler<T>,
  { factory = defaultFactory, validate }: FieldOptions<T> = {} as FieldOptions<T>,
): [FieldState, FieldChangeHandler] {
  const [state, setState] = useDerivedState(factory, value);
  const onChangeFn = useCurrent(onChange);
  const factoryFn = useCurrent(factory);
  const validateFn = useCurrent(validate);
  const initialVal = useCurrent(value);

  const handleChange: FieldChangeHandler = useCallback((evt) => {
    if (onChangeFn.current) {
      try {
        const value = validateFn.current ? validateFn.current(evt.target) : evt.target.value as T;

        if (value === initialVal.current) {
          setState({ value: evt.target.value });
        } else {
          onChangeFn.current(value);
        }
      } catch (e) {
        setState({ value: evt.target.value, error: e.message });
      }
    } else {
      setState({ value: evt.target.value });
    }
  }, [onChangeFn, factoryFn, validateFn, setState, initialVal]);

  return [state, handleChange];
}
