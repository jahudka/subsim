import ReactDOM from 'react-dom/client';
import { App } from './components';

import './layout.less';

const container = ReactDOM.createRoot(document.getElementById('root')!);
container.render(<App />);
