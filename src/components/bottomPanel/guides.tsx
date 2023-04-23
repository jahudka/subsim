import { FC } from 'react';
import { VscMirror } from 'react-icons/vsc';
import { IoIosColorPalette } from 'react-icons/io';
import { RxAngle } from 'react-icons/rx';
import { CgArrowsShrinkH, CgArrowsShrinkV } from 'react-icons/cg';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { TbAlpha, TbAxisX, TbAxisY, TbTag } from 'react-icons/tb';
import { Guide, Line, Rect } from '../../state';
import { Button } from '../button';
import { BooleanField, ColorField, ExpressionField, StringField } from '../fields';
import { $, useDispatch, useGuides } from '../stateProvider';

import './guides.less';

export const Guides: FC = () => {
  const guides = useGuides();
  const dispatch = useDispatch();

  return (
    <div id="guides">
      <div className="lg-table">
        {guides.map((guide) => <GuideUi key={guide.id} {...guide} />)}
      </div>
      <div className="row guide-add">
        <button className="ml-auto mr-2" onClick={() => dispatch($.guide.add('rect'))}>
          <FaPlus /> add rectangle
        </button>
        <button className="ml-2 mr-auto" onClick={() => dispatch($.guide.add('line'))}>
          <FaPlus /> add line
        </button>
      </div>
    </div>
  );
};

export const GuideUi: FC<Guide> = (guide) => {
  return guide.kind === 'rect' ? <RectUi {...guide} /> : <LineUi {...guide} />;
};

const RectUi: FC<Rect> = ({
  id,
  x,
  y,
  angle,
  width,
  height,
  color,
  label,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap guide-rect">
      <div className="guide-kind">rect</div>
      <div className="guide-x">
        <ExpressionField state={x} onChange={(x) => dispatch($.guide.set(id, 'x', x))} intro={<TbAxisX />}>m</ExpressionField>
      </div>
      <div className="guide-y">
        <ExpressionField state={y} onChange={(y) => dispatch($.guide.set(id, 'y', y))} intro={<TbAxisY />}>m</ExpressionField>
      </div>
      <div className="guide-angle">
        <ExpressionField state={angle} onChange={(angle) => dispatch($.guide.set(id, 'angle', angle))} intro={<RxAngle />}>°</ExpressionField>
      </div>
      <div className="guide-width">
        <ExpressionField state={width} onChange={(w) => dispatch($.guide.set(id, 'width', w))} intro={<CgArrowsShrinkH />}>m</ExpressionField>
      </div>
      <div className="guide-height">
        <ExpressionField state={height} onChange={(d) => dispatch($.guide.set(id, 'height', d))} intro={<CgArrowsShrinkV />}>m</ExpressionField>
      </div>
      <div className="guide-spacer"></div>
      <div className="guide-spacer"></div>
      <div className="guide-color">
        <ColorField value={color} onChange={(c) => dispatch($.guide.set(id, 'color', c))} intro={<IoIosColorPalette />} />
      </div>
      <div className="guide-label">
        <StringField value={label ?? ''} onChange={(l) => dispatch($.guide.set(id, 'label', l))} intro={<TbTag />} />
      </div>
      <div className="guide-rm">
        <Button onClick={() => dispatch($.guide.del(id))} confirm="Are you sure you want to delete this guide?">
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};



const LineUi: FC<Line> = ({
  id,
  x,
  y,
  angle,
  reflect,
  absorption,
  color,
  label,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="row-wrap guide-line">
      <div className="guide-kind">line</div>
      <div className="guide-x">
        <ExpressionField state={x} onChange={(x) => dispatch($.guide.set(id, 'x', x))} intro={<TbAxisX />}>m</ExpressionField>
      </div>
      <div className="guide-y">
        <ExpressionField state={y} onChange={(y) => dispatch($.guide.set(id, 'y', y))} intro={<TbAxisY />}>m</ExpressionField>
      </div>
      <div className="guide-angle">
        <ExpressionField state={angle} onChange={(angle) => dispatch($.guide.set(id, 'angle', angle))} intro={<RxAngle />}>°</ExpressionField>
      </div>
      <div className="guide-spacer"></div>
      <div className="guide-spacer"></div>
      <div className="guide-reflect">
        <BooleanField value={reflect} onChange={(r) => dispatch($.guide.set(id, 'reflect', r as any))}><VscMirror /></BooleanField>
      </div>
      <div className="guide-absorption">
        <ExpressionField state={absorption} onChange={(d) => dispatch($.guide.set(id, 'absorption', d))} intro={<TbAlpha />} />
      </div>
      <div className="guide-color">
        <ColorField value={color} onChange={(c) => dispatch($.guide.set(id, 'color', c))} intro={<IoIosColorPalette />} />
      </div>
      <div className="guide-label">
        <StringField value={label ?? ''} onChange={(l) => dispatch($.guide.set(id, 'label', l))} intro={<TbTag />} />
      </div>
      <div className="guide-rm">
        <Button onClick={() => dispatch($.guide.del(id))} confirm="Are you sure you want to delete this guide?">
          <FaTrash />
        </Button>
      </div>
    </div>
  );
};

