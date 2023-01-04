import ReactDOM from 'react-dom/client';
import { StateProvider } from './state';
import { Plot } from './plot';
import { AreaUI, GuidesUI, SimulationUI, SourcesUI, VariablesUI } from './ui';

import './layout.css';

const container = ReactDOM.createRoot(document.getElementById('root')!);
container.render(
  <StateProvider>
    <div id="main">
      <Plot />
      <div id="options">
        <SimulationUI />
        <AreaUI />
        <VariablesUI />
      </div>
    </div>
    <div id="configs">
      <SourcesUI />
      <GuidesUI />
    </div>
  </StateProvider>
);
