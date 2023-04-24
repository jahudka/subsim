import { ReactNode } from 'react';
import { TooltipMap } from './types';

export function renderContent(content: ReactNode | (() => ReactNode)): ReactNode {
  switch (typeof content) {
    case 'function': return content();
    case 'string': return <p>{content}</p>;
    default: return content;
  }
}

export function withExpressions(content: ReactNode | (() => ReactNode)): () => ReactNode {
  return () => (
    <>
      {renderContent(content)}
      <p>This field supports <code>expressions</code>.</p>
    </>
  );
}

export function flatten(defs: Record<string, TooltipMap>): TooltipMap {
  return Object.fromEntries(
    Object.entries(defs).flatMap(
      ([id, map]) => Object.entries(map).map(
        ([k, v]) => [`${id}.${k}`, v],
      ),
    ),
  );
}
