import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Collapsible } from '../collapsible';
import { Panel } from '../panel';
import { Switch } from '../switch';
import { Guides } from './guides';
import { QuickControls } from './quickControls';
import { Simulation } from './simulation';
import { Sources } from './sources';
import { Tabs } from './tabs';
import { Variables } from './variables';

import './styles.less';

export const BottomPanel: FC = () => {
  const [view, setView] = useState('quick');

  return (
    <Panel id="bottom-panel" className="row">
      <div className="flex-max">
        <Collapsible collapsed={view === 'quick'}>
          <Tabs current={view} setCurrent={setView} />
        </Collapsible>
        <Switch current={view as any}>
          {{
            quick: <QuickControls />,
            sources: <Sources />,
            guides: <Guides />,
            vars: <Variables />,
            sim: <Simulation />,
          }}
        </Switch>
      </div>
      <div className="flex-min ml-2">
        <button onClick={() => setView(view !== 'quick' ? 'quick' : 'vars')}>
          {view !== 'quick' ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
    </Panel>
  );
};
