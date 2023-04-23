import { FC } from 'react';
import { RxAngle } from 'react-icons/rx';
import { CgArrowsShrinkH, CgArrowsShrinkV } from 'react-icons/cg';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { TbAxisX, TbAxisY, TbMathAvg } from 'react-icons/tb';
import { Source } from '../../state';
import { Button } from '../button';
import { BooleanField, ExpressionField, ListField } from '../fields';
import { $, useDispatch, useSources } from '../stateProvider';

import './sources.less';

export const Sources: FC = () => {
  const sources = useSources();
  const dispatch = useDispatch();

  return (
    <div id="sources">
      <div className="lg-table">
        {sources.map((src) => <SourceUi key={src.id} {...src} />)}
      </div>
      <div className="row src-add">
        <button className="mx-auto" onClick={() => dispatch($.src.add())}>
          <FaPlus /> add source
        </button>
      </div>
    </div>
  );
};

const models = [
  'omni',
  'cardioid',
];

export const SourceUi: FC<Source> = ({
  id,
  x,
  y,
  angle,
  width,
  depth,
  delay,
  gain,
  invert,
  model,
  enabled,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap">
      <div className="src-en">
        <BooleanField value={enabled} onChange={(en) => dispatch($.src.set(id, 'enabled', en))} />
      </div>
      <div className="src-x">
        <ExpressionField state={x} onChange={(x) => dispatch($.src.set(id, 'x', x))} intro={<TbAxisX />}>m</ExpressionField>
      </div>
      <div className="src-y">
        <ExpressionField state={y} onChange={(y) => dispatch($.src.set(id, 'y', y))} intro={<TbAxisY />}>m</ExpressionField>
      </div>
      <div className="src-angle">
        <ExpressionField state={angle} onChange={(angle) => dispatch($.src.set(id, 'angle', angle))} intro={<RxAngle />}>°</ExpressionField>
      </div>
      <div className="src-width">
        <ExpressionField state={width} onChange={(w) => dispatch($.src.set(id, 'width', w))} intro={<CgArrowsShrinkH />}>m</ExpressionField>
      </div>
      <div className="src-height">
        <ExpressionField state={depth} onChange={(d) => dispatch($.src.set(id, 'depth', d))} intro={<CgArrowsShrinkV />}>m</ExpressionField>
      </div>
      <div className="src-delay">
        <ExpressionField state={delay} onChange={(d) => dispatch($.src.set(id, 'delay', d))} intro="𝝙t">ms</ExpressionField>
      </div>
      <div className="src-gain">
        <ExpressionField state={gain} onChange={(g) => dispatch($.src.set(id, 'gain', g))} intro={<Gain />}>dB</ExpressionField>
      </div>
      <div className="src-invert">
        <BooleanField value={invert} onChange={(i) => dispatch($.src.set(id, 'invert', i))}><TbMathAvg /></BooleanField>
      </div>
      <div className="src-model">
        <ListField value={model} options={models} onChange={(m) => dispatch($.src.set(id, 'model', m))} />
      </div>
      <div className="src-rm">
        <Button onClick={() => dispatch($.src.del(id))} confirm="Are you sure you want to delete this source?">
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};


const Gain: FC = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 13 13" width="0.8em" height="0.8em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" strokeWidth="1.5" />
    <line x1="7" y1="7" x2="12.5" y2="2.5" strokeWidth="1" />
  </svg>
);
