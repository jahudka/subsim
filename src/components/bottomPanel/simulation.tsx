import { FC } from 'react';
import { NumericField } from '../fields';
import { $, useDispatch, useGlobals, useSimulationOptions } from '../stateProvider';

export const Simulation: FC = () => {
  const { frequency, gain, range, step } = useSimulationOptions();
  const { $c } = useGlobals();
  const dispatch = useDispatch();

  return (
    <div id="simulation" className="table">
      <div className="row">
        <div className="flex-min text-right">frequency:</div>
        <div className="flex-min">
          <NumericField value={frequency} min={20} max={250} step={1} onChange={(f) => dispatch($.sim.set('frequency', f))} data-tooltip="sim.frequency">hz</NumericField>
        </div>
        <NumericField slider value={frequency} min={20} max={250} step={1} onChange={(f) => dispatch($.sim.set('frequency', f))} />
      </div>
      <div className="row">
        <div className="flex-min text-right">gain:</div>
        <div className="flex-min">
          <NumericField value={gain} min={-24} max={24} step={1} onChange={(g) => dispatch($.sim.set('gain', g))} data-tooltip="sim.gain">dB</NumericField>
        </div>
        <NumericField slider value={gain} min={-24} max={24} step={1} onChange={(g) => dispatch($.sim.set('gain', g))} />
      </div>
      <div className="row">
        <div className="flex-min text-right">range:</div>
        <div className="flex-min">
          <NumericField value={range} min={12} max={54} step={3} onChange={(r) => dispatch($.sim.set('range', r))} data-tooltip="sim.range">dB</NumericField>
        </div>
        <NumericField slider value={range} min={12} max={54} step={3} onChange={(r) => dispatch($.sim.set('range', r))} />
      </div>
      <div className="row">
        <div className="flex-min text-right">step:</div>
        <div className="flex-min">
          <NumericField value={step ?? 0} min={0} max={6} step={3} onChange={(r) => dispatch($.sim.set('step', r || undefined))} data-tooltip="sim.step">dB</NumericField>
        </div>
        <NumericField slider value={step ?? 0} min={0} max={6} step={3} onChange={(r) => dispatch($.sim.set('step', r || undefined))} />
      </div>
      <div className="row">
        <div className="flex-min text-right"><code>$c</code>:</div>
        <div className="flex-min">
          <NumericField value={$c.value} min={$c.min} max={$c.max} step={1} onChange={($c) => dispatch($.var.set('$c', $c, true))} data-tooltip="sim.$c">m/s</NumericField>
        </div>
        <NumericField slider value={$c.value} min={$c.min} max={$c.max} step={1} onChange={($c) => dispatch($.var.set('$c', $c, true))} />
      </div>
    </div>
  );
};
