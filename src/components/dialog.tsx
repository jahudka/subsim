import classNames from 'classnames';
import { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useCurrent, useDismissableUi } from './hooks';
import { Children } from './types';

export type DialogChildProps<R = any> = {
  done: (result?: R) => void;
  close: () => void;
};

export type DialogProps<R = any> = {
  onClose?: (result?: R) => void;
  children?: (props: DialogChildProps<R>) => ReactNode;
};

type DialogState = 'init' | 'visible' | 'closing';

export function Dialog<R = any>({ onClose, children }: DialogProps<R>): ReactElement {
  const [state, setState] = useState<DialogState>('init');
  const onCloseFn = useCurrent(onClose);
  const done = useCallback((result?: R) => {
    setState('closing');
    onCloseFn.current && setTimeout(onCloseFn.current.bind(null, result), 300);
  }, [setState, onCloseFn]);
  const close = useCallback(() => done(), [done]);

  useDismissableUi(close, state === 'visible', '.dialog .dialog-content');

  useEffect(() => {
    state === 'init' && setState('visible');
  }, [state, setState, onCloseFn]);

  return createPortal(
    <div className={classNames('dialog', `dialog-${state}`)}>
      <div className="dialog-content">
        {children && children({ done, close })}
      </div>
    </div>,
    document.body,
  );
}

export type ConfirmProps<T> = Children & {
  onClose?: (result: T | undefined) => void;
};

export type ConfirmPropsWithValue<T> = ConfirmProps<T> & {
  value: T;
};

export function Confirm(props: ConfirmProps<boolean>): ReactElement;
export function Confirm<T>(props: ConfirmPropsWithValue<T>): ReactElement;
export function Confirm<T>({ value, onClose, children }: ConfirmProps<T> & { value?: T }): ReactElement {
  return (
    <Dialog onClose={onClose}>
      {({ done, close }) => (
        <>
          <p className="text-center">{children}</p>
          <p className="text-center">
            <button className="mx-2 px-2" onClick={() => done(value ?? (true as any))}><FaCheck /></button>
            <button className="mx-2 px-2" onClick={close}><FaTimes /></button>
          </p>
        </>
      )}
    </Dialog>
  );
}
