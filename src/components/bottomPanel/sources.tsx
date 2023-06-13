import { FC } from 'react';
import { RxAngle } from 'react-icons/rx';
import { CgArrowsShrinkH, CgArrowsShrinkV } from 'react-icons/cg';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { TbAxisX, TbAxisY, TbMathAvg } from 'react-icons/tb';
import { Generator, Source } from '../../state';
import { $sources } from '../../utils';
import { Button } from '../button';
import { BooleanField, ExpressionField, ListField, StaticField } from '../fields';
import { $, useDispatch, useSources } from '../stateProvider';

import './sources.less';

export const Sources: FC = () => {
  const sources = useSources();
  const dispatch = useDispatch();

  return (
    <div id="sources">
      <div className="lg-table">
        {sources.map((src) => <SourceUi key={src.id} source={src} />)}
      </div>
      <div className="row src-add">
        <button className="ml-auto mr-2" onClick={() => dispatch($.src.add('source'))}>
          <FaPlus /> add source
        </button>
        <button className="ml-2 mr-auto" onClick={() => dispatch($.src.add('generator'))}>
          <FaPlus /> add generator
        </button>
      </div>
    </div>
  );
};

const models = [
  'omni',
  'cardioid',
];

const SourceUi: FC<{ source: Source | Generator }> = ({ source }) => {
  if (source.kind === 'source') {
    return <SourceRow {...source} />;
  }

  return (
    <>
      <SourceRow {...source} />
      {(source[$sources] ?? []).map((src, i) => (
        <GeneratedUi key={i} {...src} i={getI(source, i)} />
      ))}
    </>
  );
};

function getI(gen: Generator, idx: number): number {
  switch (gen.mode) {
    case 'negative': return idx + 1 - Math.round(gen.n.value);
    case 'center': return idx + (1 - Math.round(gen.n.value)) / 2;
    case 'positive': return idx;
  }
}

const SourceRow: FC<Source | Generator> = (source) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap">
      <div className="src-en">
        <BooleanField value={source.enabled} onChange={(en) => dispatch($.src.set(source.id, 'enabled', en))} data-tooltip="sources.en" />
      </div>
      <div className="src-n">
        {source.kind === 'generator' && (
          <ExpressionField state={source.n} onChange={(n) => dispatch($.src.set(source.id, 'n', n))} intro="n =" data-tooltip="sources.n" />
        )}
      </div>
      <div className="src-mode">
        {source.kind === 'generator' && (
          <ListField value={source.mode} onChange={(mode) => dispatch($.src.set(source.id, 'mode', mode))} options={getGeneratorRanges(source.n.value)} intro="i =" data-tooltip="sources.mode" />
        )}
      </div>
      <CommonUi {...source} values={source.kind !== 'generator'} />
    </div>
  );
};

const GeneratedUi: FC<Source & { i: number }> = ({
  i,
  x,
  y,
  angle,
  width,
  depth,
  delay,
  gain,
}) => (
  <div className="row-wrap">
    <div className="src-en"></div>
    <div className="src-n"></div>
    <div className="src-mode"><StaticField intro="i =" value={i} /></div>
    <div className="src-x"><StaticField intro={<TbAxisX />} value={x.value}>m</StaticField></div>
    <div className="src-y"><StaticField intro={<TbAxisY />} value={y.value}>m</StaticField></div>
    <div className="src-angle"><StaticField intro={<RxAngle />} value={angle.value}>°</StaticField></div>
    <div className="src-width"><StaticField intro={<CgArrowsShrinkH />} value={width.value}>m</StaticField></div>
    <div className="src-height"><StaticField intro={<CgArrowsShrinkV />} value={depth.value}>m</StaticField></div>
    <div className="src-delay"><StaticField intro="𝝙t" value={delay.value}>ms</StaticField></div>
    <div className="src-gain"><StaticField intro={<Gain />} value={gain.value}>dB</StaticField></div>
    <div className="src-invert"></div>
    <div className="src-model"></div>
    <div className="src-rm"></div>
  </div>
);


const CommonUi: FC<(Source | Generator) & { values?: boolean }> = ({
  id,
  kind,
  x,
  y,
  angle,
  width,
  depth,
  delay,
  gain,
  invert,
  model,
  values,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="src-x">
        <ExpressionField state={x} onChange={(x) => dispatch($.src.set(id, 'x', x))} showValue={values} intro={<TbAxisX />} data-tooltip="sources.x">m</ExpressionField>
      </div>
      <div className="src-y">
        <ExpressionField state={y} onChange={(y) => dispatch($.src.set(id, 'y', y))} showValue={values} intro={<TbAxisY />} data-tooltip="sources.y">m</ExpressionField>
      </div>
      <div className="src-angle">
        <ExpressionField state={angle} onChange={(angle) => dispatch($.src.set(id, 'angle', angle))} showValue={values} intro={<RxAngle />} data-tooltip="sources.angle">°</ExpressionField>
      </div>
      <div className="src-width">
        <ExpressionField state={width} onChange={(w) => dispatch($.src.set(id, 'width', w))} showValue={values} intro={<CgArrowsShrinkH />} data-tooltip="sources.width">m</ExpressionField>
      </div>
      <div className="src-height">
        <ExpressionField state={depth} onChange={(d) => dispatch($.src.set(id, 'depth', d))} showValue={values} intro={<CgArrowsShrinkV />} data-tooltip="sources.depth">m</ExpressionField>
      </div>
      <div className="src-delay">
        <ExpressionField state={delay} onChange={(d) => dispatch($.src.set(id, 'delay', d))} showValue={values} intro="𝝙t" data-tooltip="sources.delay">ms</ExpressionField>
      </div>
      <div className="src-gain">
        <ExpressionField state={gain} onChange={(g) => dispatch($.src.set(id, 'gain', g))} showValue={values} intro={<Gain />} data-tooltip="sources.gain">dB</ExpressionField>
      </div>
      <div className="src-invert">
        <BooleanField value={invert} onChange={(i) => dispatch($.src.set(id, 'invert', i))} data-tooltip="sources.invert"><TbMathAvg /></BooleanField>
      </div>
      <div className="src-model">
        <ListField value={model} options={models} onChange={(m) => dispatch($.src.set(id, 'model', m))} data-tooltip="sources.model" />
      </div>
      <div className="src-rm">
        <Button onClick={() => dispatch($.src.del(id))} confirm={`Are you sure you want to delete this ${kind}?`}>
          <FaTrash />
        </Button>
      </div>
    </>
  );
};


const Gain: FC = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 13 13" width="0.8em" height="0.8em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" strokeWidth="1.5" />
    <line x1="7" y1="7" x2="12.5" y2="2.5" strokeWidth="1" />
  </svg>
);

function getGeneratorRanges(n: number): ['negative' | 'center' | 'positive', string][] {
  n = Math.round(n);

  return [
    ['negative', `${1 - n} .. 0`],
    ['center', `${(1 - n) / 2} .. ${(n - 1) / 2}`],
    ['positive', `0 .. ${n - 1}`],
  ];
}
