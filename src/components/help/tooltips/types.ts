import { ReactNode } from 'react';

export type TooltipMap = {
  [id: string]: ReactNode | (() => ReactNode);
};
