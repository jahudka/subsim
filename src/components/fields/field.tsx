import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import { FC, ReactNode } from 'react';
import { Children } from '../types';

export type FieldProps = Children & {
  type?: string;
  className?: string;
  error?: string;
  intro?: ReactNode;
  addon?: ReactNode;
  tooltip?: ReactNode;
  forceTooltip?: boolean;
  'data-tooltip'?: string;
};

export type BaseFieldProps<T> = Children & {
  id?: string;
  className?: string;
  value: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
  'data-tooltip'?: string;
};

export type BaseFieldPropsWithIntro<T> = BaseFieldProps<T> & {
  intro?: ReactNode;
};

export const Field: FC<FieldProps> = ({ type, className, error, intro, addon, tooltip, forceTooltip, children, ...data }) => {
  const hasError = error !== undefined;
  const hasTooltip = tooltip !== undefined && tooltip !== null && tooltip !== false && tooltip !== '';

  return (
    <Tooltip
      placement="top"
      overlay={error ?? tooltip}
      overlayClassName={hasError ? 'rc-tooltip-error' : undefined}
      trigger={hasError || forceTooltip ? [] : ['focus', 'hover']}
      visible={hasError || forceTooltip ? true : !hasTooltip ? false : undefined}
      mouseLeaveDelay={0}
      destroyTooltipOnHide={true}>
      <div className={classNames('field', type && `field-${type}`, error && 'field-invalid', className)} {...data}>
        {intro && <span className="field-addon">{intro}</span>}
        {children}
        {addon && <span className="field-addon">{addon}</span>}
      </div>
    </Tooltip>
  );
}
