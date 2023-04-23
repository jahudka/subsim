import { FC, ReactElement } from 'react';
import { NumericField } from '../fields';
import { $, useDispatch, useSimulationOptions, useVariables } from '../stateProvider';
import { getStep } from './utils';

export const QuickControls: FC = () => {
  const { frequency } = useSimulationOptions();
  const variables = useVariables();
  const dispatch = useDispatch();

  return (
    <div id="quick-controls" className="table">
      <QuickControl name="frequency" value={frequency} min={20} max={250} onChange={(f) => dispatch($.sim.set('frequency', f))} />
      {Object.entries(variables).map(([name, { quick, ...props }]) => quick && (
        <QuickControl key={name} name={<code>{name}</code>} {...props} onChange={(v) => dispatch($.var.set(name, v))} />
      ))}
    </div>
  );
};

type QuickControlProps = {
  name: ReactElement | string;
  value: number;
  min: number;
  max: number;
  onChange?: (value: number) => void;
};

const QuickControl: FC<QuickControlProps> = ({ name, ...props }) => {
  const step = getStep(props.min, props.max);

  return (
    <div className="row">
      <div className="flex-min text-right">{name}</div>
      <div>
        <NumericField slider {...props} step={step} />
      </div>
      <div className="flex-min text-right">
        {props.value.toFixed(-Math.log10(step))}
      </div>
    </div>
  );
}
