import { withExpressions } from './utils';

export const tab = () => (
  <>
    <p>
      The Variables tab allows you to define variables which you can then
      use in any field which supports <code>expressions</code> across the app.
    </p>
    <p>
      See the manual for more info.
    </p>
  </>
);

export const quick = 'Toggles whether the variable will be displayed in the default view.';
export const name = () => (
  <>
    <p>
      Variable names must begin with a character in the range <code>a-z</code> and
      can only contain alphanumeric characters and underscore.
    </p>
  </>
);

export const min = 'This field defines the lowest value allowed for the variable.';
export const value = 'This field sets and displays the current value for the variable.';
export const max = 'This field defines the largest value allowed for the variable.';
export const step = 'This field defines the step by which the value will be incremented when adjusted using a slider.';
export const expr = withExpressions('This field defines the expression which computes the variable value.');

export const addVar = 'Adds a variable which can be adjusted manually.';
export const addComp = 'Adds a computed variable, which is a result of an expression. You can use computed variables to simplify other expressions when part of the computation is repeated often.';
