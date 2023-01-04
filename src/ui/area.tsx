import { FC, useCallback } from 'react';
import { Orientation, set, useArea, useDispatch } from '../state';
import { ListField, ListFieldOption, NumericField } from './fields';
import { Row } from './tables';

const orientations: ListFieldOption<Orientation>[] = [
  { label: 'landscape', value: 'landscape' },
  { label: 'portrait', value: 'portrait' },
];

export const AreaUI: FC = () => {
  const { scale, width, depth, x0, y0, orientation } = useArea();
  const dispatch = useDispatch();
  const setScale = useCallback((s: number) => dispatch(set.opt('area', 'scale', s)), [dispatch]);
  const setWidth = useCallback((w: number) => dispatch(set.opt('area', 'width', w)), [dispatch]);
  const setDepth = useCallback((d: number) => dispatch(set.opt('area', 'depth', d)), [dispatch]);
  const setX0 = useCallback((x0: number) => dispatch(set.opt('area', 'x0', x0)), [dispatch]);
  const setY0 = useCallback((y0: number) => dispatch(set.opt('area', 'y0', y0)), [dispatch]);
  const setOrientation = useCallback((o: Orientation) => dispatch(set.opt('area', 'orientation', o)), [dispatch]);

  return (
    <>
      <h2>Area</h2>
      <table>
        <tbody>
          <Row id="area-scale" label="Scale:">
            <NumericField id="area-scale" value={scale} onChange={setScale} min={1} max={50} step={1}>px/m</NumericField>
          </Row>
          <Row id="area-width" label="Width:">
            <NumericField id="area-width" value={width} onChange={setWidth} min={1} max={500} step={1}>m</NumericField>
          </Row>
          <Row id="area-depth" label="Depth:">
            <NumericField id="area-depth" value={depth} onChange={setDepth} min={1} max={500} step={1}>m</NumericField>
          </Row>
          <Row id="area-x0" label="X0:">
            <NumericField id="area-x0" value={x0} onChange={setX0} min={-500} max={500} step={1}>m</NumericField>
          </Row>
          <Row id="area-y0" label="Y0:">
            <NumericField id="area-y0" value={y0} onChange={setY0} min={-500} max={500} step={1}>m</NumericField>
          </Row>
          <Row id="area-orientation" label="Orientation:">
            <ListField id="area-orientation" options={orientations} value={orientation} onChange={setOrientation} />
          </Row>
        </tbody>
      </table>
    </>
  );
};
