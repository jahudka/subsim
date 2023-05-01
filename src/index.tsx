import ReactDOM from 'react-dom/client';
import { App } from './components';

import './layout.less';

const container = ReactDOM.createRoot(document.getElementById('root')!);
container.render(<App />);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    for (const registration of registrations) {
      await registration.unregister();
    }
  });
}
