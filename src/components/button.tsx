import { ButtonHTMLAttributes, FC, ReactElement, useCallback, useState } from 'react';
import { Confirm } from './dialog';
import { useCurrent } from './hooks';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  confirm?: ReactElement | string | null | false;
  onClick: () => void;
};

export const Button: FC<ButtonProps> = ({ confirm, onClick, children, ...props }) => {
  const [ask, setAsk] = useState(false);
  const confirmEl = useCurrent(confirm);
  const onClickFn = useCurrent(onClick);
  const handleClick = useCallback(() => {
    if (confirmEl.current) {
      setAsk(true);
    } else if (onClickFn.current) {
      onClickFn.current();
    }
  }, [confirmEl, onClickFn, setAsk]);
  const handleConfirm = useCallback((confirmed?: boolean) => {
    setAsk(false);
    confirmed && onClickFn.current && onClickFn.current();
  }, [onClickFn, setAsk]);

  return (
    <>
      <button onClick={handleClick} {...props}>{children}</button>
      {ask && <Confirm onClose={handleConfirm}>{confirmEl.current}</Confirm>}
    </>
  );
};
