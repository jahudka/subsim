import classNames from 'classnames';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Canvas } from '../canvas';
import { Collapsible } from '../collapsible';
import { Panel } from '../panel';
import { useEngine } from '../stateProvider';
import { CurrentProject } from './currentProject';
import { ProjectList } from './projectList';

import './styles.less';

type View = 'project' | 'list' | 'context' | 'default';

export const TopPanel: FC = () => {
  const [view, setView] = useState<View>('default');
  const tmr = useRef<number | undefined>(undefined);
  const engine = useEngine();

  const forceProject = useCallback(() => {
    setView((view) => {
      if (view === 'list') return view;
      clearTimeout(tmr.current);
      return 'project';
    });
  }, [tmr, setView]);

  const release = useCallback(() => {
    setView((view) => view === 'project' ? 'default' : view);
  }, [setView]);

  const toggleExpand = useCallback(() => {
    setView((view) => view === 'list' ? 'default' : 'list');
  }, [setView]);

  useEffect(() => {
    const handle = () => {
      setView((view) => {
        if (view === 'project' || view === 'list') {
          return view;
        }

        clearTimeout(tmr.current);
        tmr.current = setTimeout(() => setView('default'), 2000);
        return 'context';
      });
    };

    engine.on('context-rendered', handle);

    return () => {
      engine.off('context-rendered', handle);
      clearTimeout(tmr.current);
    };
  }, [engine, tmr, setView]);

  return (
    <Panel id="top-panel" onMouseEnter={forceProject} onMouseLeave={release}>
      <div className="row">
        <div className="flex-max layers">
          <div className={classNames('layer', view !== 'context' && 'active')}><CurrentProject /></div>
          <Canvas type="context" className={classNames('layer', view === 'context' && 'active')} />
        </div>
        <button className="flex-min ml-1" onClick={toggleExpand}>
          {view !== 'list' ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
      <Collapsible collapsed={view !== 'list'}>
        <ProjectList close={toggleExpand} />
      </Collapsible>
    </Panel>
  );
};
