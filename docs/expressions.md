# Expressions reference

## Basic info

 - Supported operators: `+`, `-`, `*`, `/`, `%` (modulo) and `^` (for
   exponentiation). Operator precedence follows standard mathematical
   conventions; the `%` (modulo) operator has the same priority as `*` and `/`.
 - Also supports comparison operators `>`, `<`, `>=`, `<=`, `==`, and `!=`.
   These operators have the highest priority - higher than all of the above
   mathematical operators. They resolve to `1` if the comparison is true and
   `0` otherwise.
 - Parentheses are supported, allowing you to override the default operator
   precedence.
 - Undefined variables are resolved to `0`.
 - Invalid expressions (e.g. due to syntax errors) resolve to `0`.
 - Calls to nonexistent functions make the entire expression fail, which makes
   its output `0`.
 - Whitespace is ignored.


## Global variables

| Variable | Description                                                                      |
|----------|----------------------------------------------------------------------------------|
| `$c`     | The speed of sound, in meters per second. Can be adjusted in simulation options. |


## Function reference

| Signature                                             | Description                                                                                                                                                   |
|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `qw(freq)`                                            | Returns a quarter of the wavelength, in meters, of the specified frequency at the current speed of sound. Useful for setting distances between sources.       |
| `qt(freq)`                                            | Returns a quarter of the period of the specified frequency, in ms. Useful for setting source delays.                                                          |
| `dt(dist)`                                            | Returns the delay produced by the specified physical distance, in ms.                                                                                         |
| `sin(angle)`<br/>`cos(angle)`<br/>`tan(angle)`        | Standard trigonometric functions. Angles are specified in degrees.                                                                                            |
| `asin(value)`<br/>`acos(value)`<br/>`atan(value)`     | Standard inverse trigonometric functions. Angles are returned in degrees.                                                                                     |
| `atan2(y, x)`                                         | Inverse tangent from coordinates. Note that `y` is specified first. The angle is returned in degrees.                                                         |
| `sqrt(value)`                                         | Returns the square root of `value`.                                                                                                                           |
| `deg(angleInRadians)`<br/>`rad(angleInDegrees)`       | These functions convert angles between degrees and radians.                                                                                                   |
| `min(value[, value...])`<br/>`max(value[, value...])` | These functions return, respectively, the smallest (most negative) and largest (most positive) of the supplied parameters.                                    |
| <code>clamp(value,&nbsp;min,&nbsp;max)</code>         | This function returns `value` clamped to the range <code>&lt;min,&nbsp;max&gt;</code>. It is a shortcut for <code>max(min,&nbsp;min(max,&nbsp;value))</code>. |
| `round(value)`<br/>`floor(value)`<br/>`ceil(value)`   | Standard rounding functions.                                                                                                                                  |
| `abs(value)`                                          | Returns the absolute value of the specified number.                                                                                                           |
| `sign(value)`                                         | Returns `-1` if the value is less than zero, `1` if the value is greater than zero, and `0` if the value is zero.                                             |
| `if(condition[[, then], else])`                       | Returns `then` if `condition` is non-zero, `else` otherwise; `then` defaults to `1`, `else` defaults to `0`.                                                  |
