import ReactDOM from 'react-dom/client';
import { App } from './components';

import './layout.less';

if (!/\/$/.test(location.pathname)) {
  location.href = location.pathname.replace(/(?:\/(?:index\.html?)?)?$/, '/');
}

const container = ReactDOM.createRoot(document.getElementById('root')!);
container.render(<App />);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('./service-worker.ts', import.meta.url), {
    type: 'module',
  }).then((sw) => sw.update());
}
