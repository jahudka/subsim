import { FC } from 'react';
import { GainMapProvider } from './gainMap';
import { Legend } from './legend';
import { PlotSources } from './sources';
import { PlotSourcesUI } from './sourcesUi';
import { PlotUI } from './plotUi';

import './styles.css';
import { Tooltip } from './tooltip';

export const Plot: FC = () => (
  <div id="plot">
    <div className="plot-layers">
      <GainMapProvider>
        <PlotSources />
        <PlotUI />
        <PlotSourcesUI />
        <Tooltip />
      </GainMapProvider>
    </div>
    <div className="plot-legend">
      <Legend />
    </div>
  </div>
);
