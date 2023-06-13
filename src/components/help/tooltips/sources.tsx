import { withExpressions } from './utils';

export const tab = 'The Sources tab allows you to define audio sources you wish to simulate.';
export const en = 'Toggles whether a source is enabled.';
export const n = withExpressions('This field sets the number of sources which will be generated.');
export const mode = () => (
  <p>
    This field sets the direction in which the generator variable <code>i</code> will be generated.
    Examples:
    <table>
      <thead>
        <tr>
          <th>mode</th>
          <th>n</th>
          <th>values</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowSpan={2}><code>negative</code></td>
          <td><code>3</code></td>
          <td><code>-2</code>, <code>-1</code>, <code>0</code></td>
        </tr>
        <tr>
          <td><code>4</code></td>
          <td><code>-3</code>, <code>-2</code>, <code>-1</code>, <code>0</code></td>
        </tr>
        <tr>
          <td rowSpan={2}><code>centered</code></td>
          <td><code>3</code></td>
          <td><code>-1</code>, <code>0</code>, <code>1</code></td>
        </tr>
        <tr>
          <td><code>4</code></td>
          <td><code>-1.5</code>, <code>-0.5</code>, <code>0.5</code>, <code>1.5</code></td>
        </tr>
        <tr>
          <td rowSpan={2}><code>positive</code></td>
          <td><code>3</code></td>
          <td><code>0</code>, <code>1</code>, <code>2</code></td>
        </tr>
        <tr>
          <td><code>4</code></td>
          <td><code>0</code>, <code>1</code>, <code>2</code>, <code>3</code></td>
        </tr>
      </tbody>
    </table>
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
