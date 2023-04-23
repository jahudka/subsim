import { FC } from 'react';
import useResizeObserver from 'use-resize-observer';
import { $, useDispatch } from '../stateProvider';
import { Canvas } from '../canvas';
import { ViewController } from './viewController';

import './styles.less';

export const Plot: FC = () => {
  const dispatch = useDispatch();
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width = window.innerWidth, height = window.innerHeight }) =>
      dispatch($.canvas.setSize('plot', width, height)),
  });

  return (
    <div ref={ref} id="plot">
      <Canvas type="plot" />
      <Canvas type="ui" />
      <ViewController />
    </div>
  );
};
