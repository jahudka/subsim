import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { $, useDispatch, useEngine } from '../stateProvider';
import { Canvas } from '../canvas';
import { ViewController } from './viewController';

import './styles.less';

export const Plot: FC = () => {
  const dispatch = useDispatch();
  const engine = useEngine();
  const [res, setRes] = useState(1);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width = window.innerWidth, height = window.innerHeight }) =>
      dispatch($.canvas.setSize('plot', width, height)),
  });

  useEffect(() => {
    engine.on('plot-rendered', setRes);
    return () => engine.off('plot-rendered', setRes);
  }, [engine, setRes]);

  return (
    <div ref={ref} id="plot">
      <Canvas type="plot" className={classNames(res > 1 && `blur-${res / 2}`)} />
      <Canvas type="ui" />
      <ViewController />
    </div>
  );
};
