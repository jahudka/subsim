import { FC } from 'react';
import { Canvas } from './canvas';
import { $, useDispatch, useSimulationOptions } from './stateProvider';

export const Legend: FC = () => {
  const { step } = useSimulationOptions();
  const dispatch = useDispatch();

  return (
    <div id="legend" onClick={() => dispatch($.sim.set('step', (((step ?? 0) + 3) % 9) || undefined))} data-tooltip="ui.legend">
      <Canvas type="legend" />
    </div>
  );
}
