import { withExpressions } from './utils';

export const tab = 'The Sources tab allows you to define audio sources you wish to simulate.';
export const en = 'Toggles whether a source is enabled.';
export const n = withExpressions('This field sets the number of sources which will be generated.');
export const mode = () => (
  <p>
    This field sets the direction in which the generator variable <code>i</code> will be generated.
  </p>
);
export const x = withExpressions('This field sets the source position along the horizontal X axis.');
export const y = withExpressions('This field sets the source position along the vertical Y axis.');

export const angle = withExpressions(() => (
  <>
    <p>This field sets the clockwise source rotation angle.</p>
    <p>
      <code>0°</code> corresponds to 12 o'clock and <code>90°</code> to 3 o'clock.
      Note that source rotation only affects the simulation if the source polar pattern is cardioid.
    </p>
  </>
));

export const width = withExpressions(() => (
  <>
    <p>This field sets the source width.</p>
    <p>Note that this is only a visual attribute; it doesn't have any effect on the simulation.</p>
  </>
));

export const depth = withExpressions(() => (
  <>
    <p>This field sets the source depth.</p>
    <p>Note that this is only a visual attribute; it doesn't have any effect on the simulation.</p>
  </>
));


export const delay = withExpressions('This field sets the source delay time.');
export const gain = withExpressions('This field sets the source gain.');
export const invert = `Toggles whether the source signal's polarity is inverted.`;
export const model = 'Controls the source polar pattern.';

export const addSrc = `Add a new Source.`;
export const addGen = `Add a new Generator. See the manual for details on those.`;
