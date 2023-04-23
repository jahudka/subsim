import classNames from 'classnames';
import { FC, useRef } from 'react';
import { Children } from './types';

export type CollapsibleProps = Children & {
  collapsed?: boolean;
};

export const Collapsible: FC<CollapsibleProps> = ({ collapsed, children }) => {
  const first = useRef(true);
  const className = classNames(
    'collapsible',
    first.current && collapsed && 'collapsible-collapsed',
    !first.current && collapsed && 'collapsible-collapse',
    !collapsed && 'collapsible-expand',
  );

  !collapsed && (first.current = false);

  return (
    <div className={className}>
      {children}
    </div>
  );
}
