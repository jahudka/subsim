import { FC, MouseEvent, TouchEvent, useCallback, useRef } from 'react';
import {
  ReactZoomPanPinchRef,
  StateType,
  TransformComponent,
  TransformWrapper,
} from 'react-zoom-pan-pinch';
import { useCurrent } from '../hooks';
import { $, useDispatch, useViewState } from '../stateProvider';

export const ViewController: FC = () => {
  const dispatch = useDispatch();
  const view = useCurrent(useViewState());
  const v0 = useRef(view.current);
  const active = useRef(false);

  const start = useCallback(() => {
    v0.current = view.current;
    active.current = true;
  }, [v0, view, active]);

  const handle = useCallback((ref: ReactZoomPanPinchRef, state: StateType) => {
    if (!active.current) {
      return;
    }

    dispatch($.view.set(
      v0.current.x0 - state.positionX / (v0.current.scale * state.scale),
      v0.current.y0 - (window.innerHeight * (1 - state.scale) - state.positionY) / (v0.current.scale * state.scale),
      v0.current.scale * state.scale,
    ));
  }, [v0, active, dispatch]);

  const reset = useCallback((ref: ReactZoomPanPinchRef) => {
    active.current = false;
    ref.resetTransform(0.001, 'linear');
  }, [active]);

  const showContext = useCallback((x: number, y: number) => {
    dispatch($.ctx.show(
      view.current.x0 + Math.round(x) / view.current.scale,
      view.current.y0 + Math.round(window.innerHeight - y) / view.current.scale,
    ));
  }, [view, dispatch]);

  const handleMouse = useCallback((evt: MouseEvent) => {
    showContext(evt.clientX, evt.clientY);
  }, [showContext]);

  const handleTouch = useCallback((evt: TouchEvent) => {
    if (evt.touches.length !== 1) {
      return;
    }

    const touch = evt.touches.item(0);
    showContext(touch.clientX, touch.clientY);
  }, [showContext]);

  return (
    <TransformWrapper
      minScale={0.1}
      limitToBounds={false}
      wheel={{ step: 0.05 }}
      pinch={{ step: 1 }}
      onPanningStart={start}
      onZoomStart={start}
      onTransformed={handle}
      onPanningStop={reset}
      onZoomStop={reset}>
      <TransformComponent wrapperClass="plot-view-controller">
        <div className="plot-placeholder" onMouseMove={handleMouse} onTouchMove={handleTouch} />
      </TransformComponent>
    </TransformWrapper>
  );
};
