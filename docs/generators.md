# Generators

Adding multiple sources can become tedious. If the differences between multiple
sources can be described mathematically, you can simplify the process by using
a _generator_. A generator has all the same parameters as a source, but on top
of those, it has two special parameters: _count_ and _mode_. The generator will
create _&lt;count&gt;_ virtual sources, which will all have the same parameters
as the generator; but each of the virtual sources will be able to use a special
variable called `i` in its expressions, and the generator will assign a
different `i` to each of the sources based on the configured _mode_. It is up to
you to define the appropriate expressions to make use of `i` and thus to make
each source distinct. The difference between two consecutive values of `i` will
always be `1`, the values will always be generated from lowest to highest, and
there will always be _&lt;count&gt;_ distinct values generated.

The three generator modes are _negative_, _center_, and _positive_. They differ
in the range for the values of `i`:

 - _Positive_ will generate values starting at `0`; e.g. with a count of 4, the
   values would be `0`, `1`, `2`, and `3`.
 - _Negative_ will generate `i` so that there are _&lt;count&gt;_ values
   _ending_ with `0`; e.g. with a count of `3`, the values would be `-2`, `-1`,
   and `0`.
 - _Center_ will generate `i` so that the generated values are symmetrical
   around zero - e.g. with a count of 3, the values would be `-1`, `0`, and `1`,
   and with a count of 4, the values would be `-1.5`, `-0.5`, `0.5`, and `1.5`.
