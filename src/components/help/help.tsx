import Tooltip from 'rc-tooltip';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { BooleanField } from '../fields';
import { Children } from '../types';
import { useDismissableUi } from '../hooks';
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
  const touch = useRef(false);
  useDismissableUi(() => setTarget(undefined), active ?? true, '.rc-tooltip');

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

    const checkTarget = (target?: HTMLElement | null) => {
      if (!target) {
        return;
      }

      if (target.dataset.tooltip && target.dataset.tooltip in tooltips) {
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

    const handleEnter = (evt: MouseEvent) => {
      checkTarget(evt.target as any);
    };

    const handleLeave = (evt: MouseEvent) => {
      if (evt.target === currentTarget) {
        tmr === undefined && setTarget(undefined);
        clearTimeout(tmr);
        currentTarget = tmr = undefined;
      }
    };

    const handleTouchStart = (evt: TouchEvent) => {
      if (!touch.current) {
        document.body.removeEventListener('mouseenter', handleEnter, { capture: true });
        document.body.removeEventListener('mouseleave', handleLeave, { capture: true });
        touch.current = true;

        clearTimeout(tmr);
        currentTarget = tmr = undefined;
      }

      if (evt.touches.length === 1) {
        setTarget(undefined);
        checkTarget((evt.target as any).closest('[data-tooltip]'));
      }
    };

    const handleTouchEnd = (evt: TouchEvent) => {
      if (evt.touches.length !== 0) {
        return;
      }

      const target = (evt.target as any).closest('[data-tooltip]');

      if (target === currentTarget) {
        if (tmr !== undefined) {
          clearTimeout(tmr);
          currentTarget = tmr = undefined;
        } else {
          evt.preventDefault();
        }
      }
    };

    if (!touch.current) {
      document.body.addEventListener('mouseenter', handleEnter, { capture: true });
      document.body.addEventListener('mouseleave', handleLeave, { capture: true });
    }

    document.body.addEventListener('touchstart', handleTouchStart, { capture: true });
    document.body.addEventListener('touchend', handleTouchEnd, { capture: true });

    return () => {
      if (!touch.current) {
        document.body.removeEventListener('mouseenter', handleEnter, { capture: true });
        document.body.removeEventListener('mouseleave', handleLeave, { capture: true });
      }

      document.body.removeEventListener('touchstart', handleTouchStart, { capture: true });
      document.body.removeEventListener('touchend', handleTouchEnd, { capture: true });
      clearTimeout(tmr);
      currentTarget = tmr = undefined;
    };
  }, [active, setTarget, touch]);

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
      <Tooltip
        overlay={renderContent(content)}
        trigger={[]}
        visible={true}
        placement="leftTop"
        overlayClassName="rc-tooltip-help"
        destroyTooltipOnHide>
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
