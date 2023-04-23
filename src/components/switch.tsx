import classNames from 'classnames';
import { FC, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useCurrent } from './hooks';
import { Children } from './types';

export type SwitchItems = {
  [id: string]: ReactElement;
};

export type SwitchProps<Items extends SwitchItems> = {
  current: string & keyof Items;
  children: Items;
};

type Size = {
  width: number;
  height: number;
};

type Render = {
  currentId?: string;
  currentSize?: Size;
  nextId?: string;
  nextSize?: Size;
};


export function Switch<Items extends SwitchItems>({ current, children }: SwitchProps<Items>): ReactElement {
  const items = useCurrent(children);
  const [render, setRender] = useState<Render>({ nextId: current });
  const renderRef = useCurrent(render);
  const sizes = useRef<Record<string, Size>>({});
  const setItemSize = useCallback((id: string, size: Size) => {
    sizes.current[id] = size;

    if (id === renderRef.current.nextId && !renderRef.current.nextSize) {
      setRender(({ ...renderRef.current, nextSize: size }));
    } else if (id === renderRef.current.currentId && !renderRef.current.nextId) {
      setRender({ currentId: renderRef.current.currentId, currentSize: size });
    }
  }, [sizes, renderRef, setRender]);

  useEffect(() => {
    if (render.currentId && current !== render.currentId && current !== render.nextId) {
      // when an item is currently displayed and we get asked to switch
      // to a different item, we need to clear the current item first
      // and remember that we're transitioning to the new item:
      setRender({
        currentId: undefined,
        currentSize: render.currentSize,
        nextId: current,
        nextSize: sizes.current[current],
      });
    } else if (!render.currentId && render.currentSize && render.currentSize === render.nextSize) {
      // when no item is currently displayed and we've just set the new container size,
      // we need to wait for the container to resize and then display the new item:
      setTimeout(() => setRender({ currentId: render.nextId, currentSize: render.currentSize }), 300);
    } else if (!render.currentId && render.nextSize) {
      // when no item is currently displayed and we know the size of the
      // next item, it means we've begun transitioning to it; we need to wait
      // for the old item to fade out and then resize the container:
      setTimeout(() => setRender({ ...render, currentSize: render.nextSize }), 200);
    }
  }, [current, render, setRender, sizes]);

  return (
    <div className="switch" style={render.currentSize}>
      {Object.entries(items.current).map(([id, component]) => (
        <SwitchItem key={id} id={id} className={id === render.currentId && 'switch-current'} onResize={setItemSize}>
          {component}
        </SwitchItem>
      ))}
    </div>
  );
}

type SwitchItemProps = Children & {
  id: string;
  className?: string | false;
  onResize: (id: string, size: Size) => void;
};

const SwitchItem: FC<SwitchItemProps> = ({ id, className, onResize: setSize, children }) => {
  const onResize = useCallback((size: Size) => setSize(id, size), [id, setSize]);
  const { ref } = useResizeObserver<HTMLDivElement>({ onResize });
  return (
    <div ref={ref} className={classNames('switch-item', className)}>
      {children}
    </div>
  );
};
