import { Dispatch, FC, useState } from 'react';
import { Action, add, del, set, useDispatch, useVariables, Variable } from '../state';
import { NumericField, StringField } from './fields';
import { Row } from './tables';

export const VariablesUI: FC = () => {
  const variables = useVariables();
  const dispatch = useDispatch();

  return (
    <>
      <h2>Variables</h2>
      <table>
        <tbody>
          {Object.entries(variables).map(([name, state]) => (
            <VariableUI key={name} name={name} state={state} dispatch={dispatch} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>
              <AddVariable dispatch={dispatch} />
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

type VariableUIProps = {
  name: string;
  state: Variable;
  dispatch: Dispatch<Action>;
};

const VariableUI: FC<VariableUIProps> = ({ name, state, dispatch }) => {
  const range = Math.max(0.001, Math.min(999, Math.abs(state.max - state.min)));
  const step = 10 ** (Math.floor(Math.log10(range)) - 2);

  return (
    <Row id={`var-${name}`}>
      <code>{name}</code>
      <NumericField id={`var-${name}`} {...state} step={step} onChange={(v) => dispatch(set.var(name, v))} />
      <NumericField slider {...state} step={step} onChange={(v) => dispatch(set.var(name, v))} />
      <button className="btn btn-delete" onClick={() => dispatch(del.var(name))}></button>
    </Row>
  );
};

type AddVariableProps = {
  dispatch: Dispatch<Action>;
};

function validate(value: string): string {
  if (!/^[a-z$][a-z0-9_]*$/i.test(value)) {
    throw new Error('Invalid variable name');
  }

  return value;
}

const AddVariable: FC<AddVariableProps> = ({ dispatch }) => {
  const [name, setName] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  return (
    <div className="footer-panel">
      <label htmlFor="variables-add">add variable:</label>
      <StringField id="variables-add" className="field-narrow" value={name} onChange={setName} validate={validate} />
      <label htmlFor="variables-min">min:</label>
      <NumericField id="variables-min" className="field-narrow" max={max} value={min} onChange={setMin} />
      <label htmlFor="variables-max">max:</label>
      <NumericField id="variables-max" className="field-narrow" min={min} value={max} onChange={setMax} />
      <button className="btn btn-add" onClick={() => {
        if (name) {
          setName('');
          dispatch(add.var(name, min, max));
        }
      }}>add</button>
    </div>
  )
};
