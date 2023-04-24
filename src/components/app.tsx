import { FC } from 'react';
import { BottomPanel } from './bottomPanel';
import { Help } from './help';
import { Legend } from './legend';
import { StateProvider } from './stateProvider';
import { Plot } from './plot';
import { TopPanel } from './topPanel';

import './tooltips.less';

export const App: FC = () => (
  <StateProvider>
    <Plot />
    <BottomPanel />
    <TopPanel />
    <Legend />
    <Help />
  </StateProvider>
);
