import { FC, useCallback } from 'react';
import { set, useDispatch, useGlobals, useSimulation } from '../state';
import { NumericField } from './fields';
import { Row } from './tables';

export const SimulationUI: FC = () => {
  const state = useSimulation();
  const dispatch = useDispatch();
  const setFreq = useCallback((f: number) => dispatch(set.opt('simulation', 'frequency', f)), [dispatch]);
  const setRes = useCallback((r: number) => dispatch(set.opt('simulation', 'resolution', r)), [dispatch]);
  const set$C = useCallback(($c: number) => dispatch(set.var('$c', $c, true)), [dispatch]);
  const { $c } = useGlobals();

  return (
    <>
      <h2>Simulation options</h2>
      <table>
        <tbody>
          <Row id="sim-freq" label="Frequency:">
            <NumericField id="sim-freq" value={state.frequency} onChange={setFreq} min={20} max={250} step={1}>hz</NumericField>
            <NumericField slider value={state.frequency} onChange={setFreq} min={20} max={250} step={1} />
          </Row>
          <Row id="sim-c">
            <>Speed of sound (<code>$c</code>):</>
            <NumericField id="sim-c" value={$c.value} onChange={set$C} min={$c.min} max={$c.max} step={1}>m/s</NumericField>
          </Row>
          <Row id="sim-res" label="Resolution:">
            <NumericField id="sim-res" value={state.resolution} onChange={setRes} min={1} max={20} step={1}>px</NumericField>
          </Row>
        </tbody>
      </table>
    </>
  );
};
