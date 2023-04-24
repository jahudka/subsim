import Tooltip from 'rc-tooltip';
import { createContext, FC, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { BooleanField } from '../fields';
import { Children } from '../../types';
import { tooltips, renderContent } from './tooltips';

import './styles.less';

type HelpContext = {
  active?: boolean;
  setActive?: (active: boolean) => void;
};

const HelpContext = createContext<HelpContext>({});

export const Help: FC = () => {
  const savedState = localStorage.getItem('tooltips');
  const [active, setActive] = useState(savedState === null ? undefined : (savedState !== '0'));
  const [target, setTarget] = useState(active !== false ? 'ui.help' : undefined);

  if (active !== undefined) {
    localStorage.setItem('tooltips', active ? '1' : '0');
  }

  useEffect(() => {
    if (active === false) {
      setTarget(undefined);
      return;
    }

    let currentTarget: HTMLElement | undefined;
    let tmr: number | undefined;

    const closeCurrent = () => {
      tmr === undefined && setTarget(undefined);
      clearTimeout(tmr);
      currentTarget = tmr = undefined;
    };

    const handleEnter = (evt: MouseEvent) => {
      const target = (evt.target as any) as HTMLElement;

      if (target && target.dataset.tooltip && target.dataset.tooltip in tooltips) {
        clearTimeout(tmr);
        currentTarget = target;
        tmr = setTimeout(() => {
          tmr = undefined;
          setTarget(target.dataset.tooltip);
        }, 1500);
      } else if (target.closest('[data-tooltip]') !== currentTarget) {
        clearTimeout(tmr);
        tmr = undefined;
      }
    };

    const handleLeave = (evt: MouseEvent) => {
      if (evt.target === currentTarget) {
        closeCurrent();
      }
    };

    const handleEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        closeCurrent();
      }
    };

    const handleMouse = (evt: MouseEvent) => {
      if (!(evt.target as any).closest('.rc-tooltip')) {
        closeCurrent();
      }
    };

    document.body.addEventListener('mouseenter', handleEnter, { capture: true });
    document.body.addEventListener('mouseleave', handleLeave, { capture: true });
    document.body.addEventListener('keydown', handleEsc);
    document.body.addEventListener('mousedown', handleMouse);

    return () => {
      document.body.removeEventListener('mouseenter', handleEnter, { capture: true });
      document.body.removeEventListener('mouseleave', handleLeave, { capture: true });
      document.body.removeEventListener('keydown', handleEsc);
      document.body.removeEventListener('mousedown', handleMouse);
      clearTimeout(tmr);
      currentTarget = tmr = undefined;
    };
  }, [active, setTarget]);

  return (
    <HelpContext.Provider value={{ active, setActive }}>
      <TooltipRenderer target={target} content={target && tooltips[target]}>
        <button id="help" onClick={() => setTarget((t) => t ? undefined : 'ui.help')}>
          <HiOutlineQuestionMarkCircle />
        </button>
      </TooltipRenderer>
    </HelpContext.Provider>
  );
};

export const TooltipsToggle: FC<Children> = ({ children }) => {
  const { active, setActive } = useContext(HelpContext);

  return (
    <BooleanField value={active ?? true} onChange={setActive}>{children}</BooleanField>
  );
};

type TooltipRendererProps = {
  target?: string;
  content?: ReactNode | (() => ReactNode);
  children: ReactElement;
};

const TooltipRenderer: FC<TooltipRendererProps> = ({ target, content, children }) => {
  if (!content) {
    return children;
  }

  return (
    <>
      <Tooltip overlay={renderContent(content)} trigger={[]} visible={true} placement="leftTop" overlayClassName="rc-tooltip-help">
        {children}
      </Tooltip>
      <style>
        [data-tooltip="{target}"] {'{'}
        outline: 3px solid #ffa !important;
        outline-offset: 3px !important;
        outline-radius: 3px !important;
        {'}'}
      </style>
    </>
  );
};
