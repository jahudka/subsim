# Expressions reference

## Basic info

 - Supported operators: `+`, `-`, `*`, `/` and `^` (for exponentiation).
   Operator precedence follows standard mathematical conventions.
 - Parentheses are supported.
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
| `deg(angleInRadians)`<br/>`rad(angleInDegrees)`       | These functions convert angles between degrees and radians.                                                                                                   |
| `min(value[, value...])`<br/>`max(value[, value...])` | These functions return, respectively, the smallest (most negative) and largest (most positive) of the supplied parameters.                                    |
| <code>clamp(value,&nbsp;min,&nbsp;max)</code>         | This function returns `value` clamped to the range <code>&lt;min,&nbsp;max&gt;</code>. It is a shortcut for <code>max(min,&nbsp;min(max,&nbsp;value))</code>. |
| `round(value)`<br/>`floor(value)`<br/>`ceil(value)`   | Standard rounding functions.                                                                                                                                  |
| `abs(value)`                                          | Returns the absolute value of the specified number.                                                                                                           |
| `sign(value)`                                         | Returns `-1` if the value is less than zero, `1` if the value is greater than zero, and `0` if the value is zero.                                             |
