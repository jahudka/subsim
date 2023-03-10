import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';

export function useCurrent<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function useFirst<T>(factory: () => T): MutableRefObject<T> {
  const ref = useRef(undefined as T);
  ref.current ??= factory();
  return ref;
}

type Factory<S> = (...params: any[]) => S;
type State<F extends Factory<any>> = F extends Factory<infer S> ? S : never;

type DerivedStateData<S, P> = {
  state: S;
  dispatch: Dispatch<SetStateAction<S>>;
  deps: P;
};

export function useDerivedState<
  F extends Factory<any>,
>(factory: F, ...params: Parameters<F>): [State<F>, Dispatch<SetStateAction<State<F>>>] {
  const data = useRef<DerivedStateData<State<F>, Parameters<F>>>();
  const [, update] = useState(false);

  if (!data.current) {
    data.current = {
      state: factory(...params),
      dispatch: state => {
        if (data.current) {
          data.current.state = typeof state === 'function' ? (state as any)(data.current.state) : state;
          update(v => !v);
        }
      },
      deps: params,
    };
  } else if (depsChanged(params, data.current.deps)) {
    data.current.state = factory(...params);
    data.current.deps = params;
  }

  return [data.current.state, data.current.dispatch];
}

function depsChanged<P>(a: P[], b: P[]): boolean {
  return a.some((v, i) => v !== b[i]);
}
