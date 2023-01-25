import { Dispatch, FC } from 'react';
import {
  Action,
  add,
  del,
  set,
  Source,
  useDispatch,
  useSources,
} from '../state';
import { $id } from '../utils';
import { BooleanField, ExpressionField, ListField } from './fields';

export const SourcesUI: FC = () => {
  const sources = useSources();
  const dispatch = useDispatch();

  return (
    <>
      <h2>Sources</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th className="text-center">on</th>
            <th>x (m)</th>
            <th>y (m)</th>
            <th>angle (&deg;)</th>
            <th>width (m)</th>
            <th>depth (m)</th>
            <th>delay (ms)</th>
            <th>gain (dB)</th>
            <th className="text-center">invert</th>
            <th>pattern</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source, idx) => <SourceUI key={source[$id]} idx={idx} source={source} dispatch={dispatch} />)}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={12}>
              <button className="btn btn-add" onClick={() => dispatch(add.src())}>add</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

type SourceUIProps = {
  idx: number;
  source: Source;
  dispatch: Dispatch<Action>;
};

const models: string[] = [
  'omni',
  'cardioid',
];

const SourceUI: FC<SourceUIProps> = ({ idx, source, dispatch }) => (
  <tr>
    <th>{idx+1}</th>
    <td><BooleanField value={source.enabled} onChange={(enabled) => dispatch(set.src(source, 'enabled', enabled))} /></td>
    <td><ExpressionField state={source.x} onChange={(x) => dispatch(set.src(source, 'x', x))} /></td>
    <td><ExpressionField state={source.y} onChange={(y) => dispatch(set.src(source, 'y', y))} /></td>
    <td><ExpressionField state={source.angle} onChange={(angle) => dispatch(set.src(source, 'angle', angle))} /></td>
    <td><ExpressionField state={source.width} onChange={(width) => dispatch(set.src(source, 'width', width))} /></td>
    <td><ExpressionField state={source.depth} onChange={(depth) => dispatch(set.src(source, 'depth', depth))} /></td>
    <td><ExpressionField state={source.delay} onChange={(delay) => dispatch(set.src(source, 'delay', delay))} /></td>
    <td><ExpressionField state={source.gain} onChange={(gain) => dispatch(set.src(source, 'gain', gain))} /></td>
    <td><BooleanField value={source.invert} onChange={(invert) => dispatch(set.src(source, 'invert', invert))} /></td>
    <td><ListField options={models} value={source.model} onChange={(model) => dispatch(set.src(source, 'model', model))} /></td>
    <td className="text-right"><button className="btn btn-delete" onClick={() => dispatch(del.src(source))}></button></td>
  </tr>
);
