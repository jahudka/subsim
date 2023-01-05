import ReactDOM from 'react-dom/client';
import { StateProvider } from './state';
import { Plot } from './plot';
import { AreaUI, GuidesUI, SimulationUI, SourcesUI, VariablesUI } from './ui';

import './layout.css';
import { ProjectUI } from './ui/project';

const container = ReactDOM.createRoot(document.getElementById('root')!);
container.render(
  <StateProvider>
    <header className="row">
      <h1 className="col">Subsim: <ProjectUI /></h1>
      <p className="col text-right"><em>scroll down for manual</em></p>
    </header>
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
