import { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';

export const Panel: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={classNames('panel', className)} {...props}>
    {children}
  </div>
);
