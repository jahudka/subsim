import { withExpressions } from './utils';

export const tab = () => (
  <>
    <p>
      The Guides tab allows you to add visual guides to the simulation.
      These may help you get an idea of the scale of a specific space.
    </p>
    <p>
      Additionally, using Line guides, you can get a rudimentary simulation
      of reflections. See the manual for details.
    </p>
  </>
);

export const x = withExpressions(() => (
  <>
    <p>This field sets the guide position along the horizontal X axis.</p>
    <p>
      For rectangular guides, this is the X coordinate of the rectangle's center;
      for line guides, this is the X coordinate of a point the line must pass through.
    </p>
  </>
));

export const y = withExpressions(() => (
  <>
    <p>This field sets the guide position along the vertical Y axis.</p>
    <p>
      For rectangular guides, this is the Y coordinate of the rectangle's center;
      for line guides, this is the Y coordinate of a point the line must pass through.
    </p>
  </>
));

export const angle = withExpressions(() => (
  <>
    <p>This field sets the clockwise rotation angle of the guide.</p>
    <p>
      <code>0°</code> corresponds to 12 o'clock and <code>90°</code> to 3 o'clock.
    </p>
  </>
));

export const width = withExpressions('This field sets the rectangle width.');
export const height = withExpressions('This field sets the rectangle height.');

export const reflect = () => (
  <>
    <p>Controls whether a given line will reflect sources.</p>
    <p>Read more about reflections in the manual.</p>
  </>
);

export const absorption = withExpressions(() => (
  <>
    <p>
      This field sets the attenuation for sources reflected by this line.
      The value can either be an absorption coefficient between <code>0</code> and <code>1</code>,
      representing the ratio of absorbed energy to incident energy,
    </p>
    <p>Read more about reflections in the manual.</p>
  </>
));

export const color = 'This field sets the guide color.';
export const label = 'This field sets the guide label.';
