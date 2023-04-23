import { FC, useEffect, useRef } from 'react';
import { useDispatch } from './stateProvider';

export type CanvasProps = {
  type: 'plot' | 'ui' | 'context' | 'legend';
  id?: string;
  className?: string;
  hires?: boolean;
};

export const Canvas: FC<CanvasProps> = ({ type, hires, ...props }) => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLCanvasElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    if (ref.current && !sent.current) {
      const scale = hires ? window.devicePixelRatio ?? 1 : 1;
      sent.current = true;
      ref.current.width = ref.current.clientWidth * scale;
      ref.current.height = ref.current.clientHeight * scale;
      dispatch({ type: 'set-canvas', canvasType: type, canvas: ref.current });
    }
  }, [ref.current, sent]);

  return <canvas ref={ref} {...props} />;
};
