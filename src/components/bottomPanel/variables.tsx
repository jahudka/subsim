import { FC, useCallback, useState } from 'react';
import { FaLessThanEqual, FaPlus, FaTrash } from 'react-icons/fa';
import { Button } from '../button';
import { BooleanField, NumericField, StringField } from '../fields';
import { $, useDispatch, useVariables } from '../stateProvider';
import { getStep } from './utils';

import './variables.less';

export const Variables: FC = () => {
  const variables = useVariables();

  return (
    <div id="variables" className="lg-table">
      {Object.entries(variables).map(([name, props]) => (
        <VariableUi key={name} name={name} {...props} />
      ))}
      <AddVariableUi />
    </div>
  );
};

type VariableUiProps = {
  name: string;
  min: number;
  max: number;
  value: number;
  quick: boolean;
};

const VariableUi: FC<VariableUiProps> = ({ name, min, max, value, quick }) => {
  const dispatch = useDispatch();
  const step = getStep(min, max);

  return (
    <div className="row-wrap">
      <div className="var-quick">
        <BooleanField value={quick} onChange={(q) => dispatch($.var.setQuick(name, q))} data-tooltip="vars.quick" />
      </div>
      <div className="var-name"><code>{name}</code></div>
      <div className="var-range">
        <div className="row">
          <NumericField className="flex-min ml-auto" value={min} max={max - step} onChange={(min) => dispatch($.var.add(name, min, max, value, quick))} data-tooltip="vars.min" />
          <div className="flex-min mx-2"><FaLessThanEqual /></div>
          <NumericField className="flex-min" value={value} min={min} max={max} step={step} onChange={(v) => dispatch($.var.set(name, v))} data-tooltip="vars.value" />
          <div className="flex-min mx-2"><FaLessThanEqual /></div>
          <NumericField className="flex-min mr-auto" value={max} min={min + step} onChange={(max) => dispatch($.var.add(name, min, max, value, quick))} data-tooltip="vars.max" />
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

const AddVariableUi: FC = () => {
  const [quick, setQuick] = useState(true);
  const [name, setName] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const dispatch = useDispatch();
  const step = getStep(min, max);

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
    try {
      validateName(name);
      setName('');
      dispatch($.var.add(name, min, max, undefined, quick));
    } catch { /* noop */ }
  };

  return (
    <div className="row-wrap var-add">
      <div className="var-quick">
        <BooleanField value={quick} onChange={setQuick} data-tooltip="vars.quick" />
      </div>
      <div className="var-name">
        <StringField value={name} onChange={setName} validate={validateName} placeholder="add variable..." data-tooltip="vars.name" />
      </div>
      <div className="var-range">
        <div className="row">
          <NumericField className="flex-min ml-auto" value={min} max={max - step} onChange={setMin} data-tooltip="vars.min" />
          <div className="flex-min mx-2"><FaLessThanEqual /><em className="mx-2">v</em><FaLessThanEqual /></div>
          <NumericField className="flex-min mr-auto" value={max} min={min + step} onChange={setMax} data-tooltip="vars.max" />
        </div>
      </div>
      <div className="var-value"></div>
      <div className="var-rm">
        <button onClick={add}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};
