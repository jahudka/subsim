import { FC, ReactElement } from 'react';
import { formatNumber, NumericField } from '../fields';
import { $, useDispatch, useSimulationOptions, useVariables } from '../stateProvider';

export const QuickControls: FC = () => {
  const { frequency } = useSimulationOptions();
  const variables = useVariables();
  const dispatch = useDispatch();

  return (
    <div id="quick-controls">
      <div className="table">
        <QuickControl name="frequency" value={frequency} min={20} max={250} step={1} onChange={(f) => dispatch($.sim.set('frequency', f))} />
        {Object.entries(variables).map(([name, { quick, ...props }]) => quick && (
          'source' in props
            ? <QuickReadout key={name} name={<code>{name}</code>} {...props} />
            : <QuickControl key={name} name={<code>{name}</code>} {...props} onChange={(v) => dispatch($.var.set(name, v))} />
        ))}
      </div>
    </div>
  );
};

type QuickControlProps = {
  name: ReactElement | string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (value: number) => void;
};

const QuickControl: FC<QuickControlProps> = ({ name, ...props }) => (
  <div className="row">
    <div className="flex-min text-right">{name}</div>
    <div>
      <NumericField slider {...props} />
    </div>
    <div className="flex-min text-right">
      {formatNumber(props.value)}
    </div>
  </div>
);

type QuickReadoutProps = {
  name: ReactElement | string;
  source: string;
  value: number;
  error?: string;
};

const QuickReadout: FC<QuickReadoutProps> = ({ name, value }) => (
  <div className="row">
    <div className="flex-min text-right">{name}</div>
    <div className="text-center">=</div>
    <div className="flex-min text-right">{formatNumber(value)}</div>
  </div>
);
