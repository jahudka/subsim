import {
  Context,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext, useEffect,
  useRef,
  useState,
} from 'react';


export function useContextSafely<T>(context: Context<T | undefined>, message: string = 'Invalid context'): T {
  const value = useContext(context);

  if (value === undefined) {
    throw new Error(message);
  }

  return value;
}


export function useCurrent<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;
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
  const data = useRef<DerivedStateData<State<F>, Parameters<F>>>(null as any);
  const [, update] = useState(false);

  if (!data.current) {
    data.current = {
      state: factory(...params),
      dispatch: state => {
        const next = typeof state === 'function' ? (state as any)(data.current.state) : state;

        if (next !== data.current.state) {
          data.current.state = next;
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


export function useDismissableUi(dismiss: () => void, active: boolean, selector?: string): void {
  const dismissFn = useCurrent(dismiss);

  useEffect(() => {
    if (!active) {
      return () => {};
    }

    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        dismissFn.current();
      }
    };

    const handleMouse = (evt: MouseEvent) => {
      if (!(evt.target as any).closest(selector)) {
        dismissFn.current();
      }
    };

    document.body.addEventListener('keydown', handleEsc);
    selector && document.body.addEventListener('mousedown', handleMouse);

    return () => {
      document.body.removeEventListener('keydown', handleEsc);
      selector && document.body.removeEventListener('mousedown', handleMouse);
    };
  }, [active, dismissFn]);
}
