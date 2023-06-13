import { FC, useCallback, useState } from 'react';
import { FaLessThanEqual, FaPlus, FaTrash } from 'react-icons/fa';
import { LocalComputedVariable, LocalVariable } from '../../state';
import { Button } from '../button';
import { BooleanField, ExpressionField, formatNumber, NumericField, StringField } from '../fields';
import { $, useDispatch, useVariables } from '../stateProvider';

import './variables.less';

export const Variables: FC = () => {
  const variables = useVariables();

  return (
    <div id="variables">
      <div className="lg-table">
        {Object.entries(variables).map(([name, def]) => (
          <VariableRow key={name} name={name} def={def} />
        ))}
      </div>
      <AddVariableUi />
    </div>
  );
};

type VariableRowProps = {
  name: string;
  def: LocalVariable | LocalComputedVariable;
};

const VariableRow: FC<VariableRowProps> = ({ name, def }) => (
  'source' in def
    ? <ComputedVariableUi name={name} state={def} />
    : <VariableUi name={name} min={def.min} max={def.max} step={def.step} value={def.value} quick={def.quick} />
);

type VariableUiProps = {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  quick: boolean;
};

const VariableUi: FC<VariableUiProps> = ({ name, min, max, step, value, quick }) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap">
      <div className="var-quick">
        <BooleanField value={quick} onChange={(q) => dispatch($.var.setQuick(name, q))} data-tooltip="vars.quick" />
      </div>
      <div className="var-name"><code>{name}</code></div>
      <div className="var-range">
        <div className="row">
          <NumericField className="flex-min ml-auto" value={min} max={max} onChange={(min) => dispatch($.var.add(name, min, max, step, value, quick))} data-tooltip="vars.min" />
          <div className="flex-min mx-2"><FaLessThanEqual /></div>
          <NumericField className="flex-min" value={value} min={min} max={max} step={step} onChange={(v) => dispatch($.var.set(name, v))} data-tooltip="vars.value" />
          <div className="flex-min mx-2"><FaLessThanEqual /></div>
          <NumericField className="flex-min mr-2" value={max} min={min} onChange={(max) => dispatch($.var.add(name, min, max, step, value, quick))} data-tooltip="vars.max" />
          <NumericField className="flex-min mr-auto" value={step} min={0} onChange={(step) => dispatch($.var.add(name, min, max, step, value, quick))} intro="step:" data-tooltip="vars.step" />
        </div>
      </div>
      <div className="var-value">
        <NumericField slider value={value} min={min} max={max} step={step} onChange={(v) => dispatch($.var.set(name, v))} />
      </div>
      <div className="var-rm">
        <Button onClick={() => dispatch($.var.del(name))} confirm="Are you sure you want to remove this variable?">
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};

type ComputedVariableUiProps = {
  name: string;
  state: LocalComputedVariable;
};

const ComputedVariableUi: FC<ComputedVariableUiProps> = ({ name, state }) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap">
      <div className="var-quick">
        <BooleanField value={state.quick} onChange={(q) => dispatch($.var.setQuick(name, q))} data-tooltip="vars.quick" />
      </div>
      <div className="var-name"><code>{name}</code></div>
      <div className="var-range">
        <ExpressionField className="mx-auto" state={state} onChange={(source) => dispatch($.var.addComp(name, source, state.quick))} showValue={false} intro="=" data-tooltip="vars.expr" />
      </div>
      <div className="var-value">
        = <code>{formatNumber(state.value)}</code>
      </div>
      <div className="var-rm">
        <Button onClick={() => dispatch($.var.del(name))} confirm="Are you sure you want to remove this variable?">
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};

const AddVariableUi: FC = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const variables = useVariables();
  const validateName = useCallback((name: string) => {
    if (name in variables) {
      throw new Error(`Variable already exists`);
    } else if (name.length && !/[a-z][a-z0-9_]*/i.test(name)) {
      throw new Error('Invalid variable name');
    }

    return name;
  }, [variables]);

  const add = () => {
    if (name.length) try {
      validateName(name);
      setName('');
      dispatch($.var.add(name, 0, 1, 0));
    } catch { /* noop */ }
  };

  const addComputed = () => {
    if (name.length) try {
      validateName(name);
      setName('');
      dispatch($.var.addComp(name, ''));
    } catch { /* noop */ }
  };

  return (
    <div className="row var-add">
      <StringField className="ml-auto mr-2" value={name} onChange={setName} validate={validateName} placeholder="variable name..." data-tooltip="vars.name" />
      <button onClick={add} className="mx-2">
        <FaPlus />
        add variable
      </button>
      <button onClick={addComputed} className="ml-2 mr-auto">
        <FaPlus />
        add computed value
      </button>
    </div>
  );
};
