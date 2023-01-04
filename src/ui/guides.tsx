import { Dispatch, FC } from 'react';
import { $id, Action, add, del, Guide, Line, Rect, set, useDispatch, useGuides } from '../state';
import { BooleanField, ColorField, ExpressionField, StringField } from './fields';

export const GuidesUI: FC = () => {
  const guides = useGuides();
  const dispatch = useDispatch();

  return (
    <>
      <h2>Guides</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>type</th>
            <th>x (m)</th>
            <th>y (m)</th>
            <th>angle (&deg;)</th>
            <th>width (m)</th>
            <th>height (m)</th>
            <th>reflect</th>
            <th>color</th>
            <th>label</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {guides.map((guide, i) => <GuideUI key={guide[$id]} idx={i} guide={guide} dispatch={dispatch} />)}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={11}>
              <button className="btn btn-add" onClick={() => dispatch(add.guide('rect'))}>add rectangle</button>
              <button className="btn btn-add" onClick={() => dispatch(add.guide('line'))}>add line</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  )
};

type GuideUIProps = {
  idx: number;
  guide: Guide;
  dispatch: Dispatch<Action>;
};

const GuideUI: FC<GuideUIProps> = ({ idx, guide, dispatch }) => {
  switch (guide.kind) {
    case 'rect': return <RectUI idx={idx} rect={guide} dispatch={dispatch} />;
    case 'line': return <LineUI idx={idx} line={guide} dispatch={dispatch} />;
  }
};

type RectUIProps = {
  idx: number;
  rect: Rect;
  dispatch: Dispatch<Action>;
};

const RectUI: FC<RectUIProps> = ({ idx, rect, dispatch }) => (
  <tr>
    <th>{idx+1}</th>
    <td>rectangle</td>
    <td><ExpressionField state={rect.x} onChange={(x) => dispatch(set.guide(rect[$id], 'x', x))} /></td>
    <td><ExpressionField state={rect.y} onChange={(y) => dispatch(set.guide(rect[$id], 'y', y))} /></td>
    <td><ExpressionField state={rect.angle} onChange={(a) => dispatch(set.guide(rect[$id], 'angle', a))} /></td>
    <td><ExpressionField state={rect.width} onChange={(w) => dispatch(set.guide(rect[$id], 'width', w))} /></td>
    <td><ExpressionField state={rect.height} onChange={(h) => dispatch(set.guide(rect[$id], 'height', h))} /></td>
    <td>&nbsp;</td>
    <td><ColorField value={rect.color} onChange={(c) => dispatch(set.guide(rect[$id], 'color', c))} /></td>
    <td><StringField value={rect.label ?? ''} onChange={(l) => dispatch(set.guide(rect[$id], 'label', l))} /></td>
    <td className="text-right"><button className="btn btn-delete" onClick={() => dispatch(del.guide(rect[$id]))} /></td>
  </tr>
);

type LineUIProps = {
  idx: number;
  line: Line;
  dispatch: Dispatch<Action>;
};

const LineUI: FC<LineUIProps> = ({ idx, line, dispatch }) => (
  <tr>
    <th>{idx+1}</th>
    <td>line</td>
    <td><ExpressionField state={line.x} onChange={(x) => dispatch(set.guide(line[$id], 'x', x))} /></td>
    <td><ExpressionField state={line.y} onChange={(y) => dispatch(set.guide(line[$id], 'y', y))} /></td>
    <td><ExpressionField state={line.angle} onChange={(a) => dispatch(set.guide(line[$id], 'angle', a))} /></td>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
    <td><BooleanField value={line.reflect} onChange={(r) => dispatch(set.guide(line[$id], 'reflect', r as any))} /></td>
    <td><ColorField value={line.color} onChange={(c) => dispatch(set.guide(line[$id], 'color', c))} /></td>
    <td><StringField value={line.label ?? ''} onChange={(l) => dispatch(set.guide(line[$id], 'label', l))} /></td>
    <td className="text-right"><button className="btn btn-delete" onClick={() => dispatch(del.guide(line[$id]))} /></td>
  </tr>
);
