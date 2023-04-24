import * as sources from './sources';
import * as guides from './guides';
import * as vars from './variables';
import * as sim from './simulation';
import * as ui from './ui';
import { flatten } from './utils';

export { renderContent } from './utils';

export const tooltips = flatten({
  sources,
  guides,
  vars,
  sim,
  ui,
});

declare module 'react' {
  interface HTMLAttributes<T> {
    'data-tooltip'?: string;
  }
}
