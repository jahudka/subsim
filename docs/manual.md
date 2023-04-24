# Subsim manual

## How it works

The simulator runs in 2D only and the simulation area represents a birds-eye
view of an open field, that is, there are no walls which would generate
reflections in the real world (although there is a tool which can add walls,
to some extent - we'll get back to that). There is also no attempt to simulate
things like the speed of sound changing based on weather conditions (although
you can adjust it manually if you're so inclined).

The simulation is always run at one defined frequency, which you can adjust
using the slider in the bottom panel or in the Options section. For each point
in the plot the distance to each source is computed; from the source distance
we can get two things: the gain factor (`1 / distance`, since we're working with
amplitudes); and based on the speed of sound and the source delay, if any, we
can get the arrival time, and from that we can get the phase offset for that
source at the defined frequency. Then it's just a matter of summing the signals
to produce the resulting gain factor and picking a suitable color.

### Projects

Click the V-shaped button in the panel at the top of the screen to open the
Project list; there is a number of predefined example projects you can check out.
Some are parametric - they have some parameters set using variables that you can
change in the bottom panel.

You can also create your own projects. They will be saved in your browser for
later use, but beware that there is no autosave function - remember to hit the
"Save" button in the top panel when you're happy with your settings!

### Building blocks

#### Sources

The most important part of the simulator are the _sources_ - these represent
individual speakers as idealised point sources.

#### Guides

Guides are visual helpers you can use to help you visualise the space in which
you're working - you can e.g. add a stage or an FOH and similar things.
Guides don't affect the simulation - with one exception: _line_ guides can be
configured to produce mirror images of the sources, which allows you to simulate
the effects of first reflections. See below for more info on that.

#### Expressions

All numeric parameters of both _sources_ and _guides_ can actually be
represented using an _expression_, rather than just a number. Expressions can
contain _variables_, like `$c` for the speed of sound, but you can also define
your own variables. There is also a number of _functions_ you can call in
expressions - see below for a reference. This allows you to e.g. define a
variable representing the frequency for which you're tuning your array and then
specify all the spatial offsets and time delays of your sources as a function of
that frequency - meaning that if you want to try a different frequency, you just
adjust that one variable, and your entire array will reconfigure automatically.
All the numeric parameters will by default show their computed numeric values;
parameters which use an expression will have a blue underline, and you can hover
over them to show a tooltip with the source expression. This will switch while
you're editing such a parameter: the parameter field will then contain the
expression, and the tooltip will show the computed value.


## Parameters and options reference

### Simulation options

#### Frequency

The frequency at which the simulation is computed.

#### Gain

This is basically a common gain trim applied to all sources. You can use it if
you want to simulate a smaller area and the entire plot is awash with red.

#### Range

This option allows you to adjust the dynamic range of the simulation.
The color spectrum used to render the plot will stretch over the configured
range; any values below the range will simply use the same purple color as the
lowest value in the range.

#### Step

This allows you to switch between a smooth color gradient and two stepped
isobaric modes, one with a step of 3dB and the other 6dB. The isobaric modes,
while not quite as easy on the eye as the gradient mode, are very useful in
determining areas with a similar SPL. You can also quickly cycle between all
three modes by clicking the range legend at the top left of the screen.

#### Speed of sound

The speed of sound, in meters per second, to use in the simulation; it is also
available in any _expressions_ as the variable `$c`.


### Sources

#### on

Whether the source is included in the simulation or not.

#### x, y, angle

The position and rotation of the source in the simulation area. Note that this
is the position of the idealised point source, which is idealised to be located
in the center of the front grille of the speaker, since that will probably be
the closest approximation for generic speakers.

#### width, depth

The size of the physical speaker. This is just a visual guide, it doesn't affect
the simulation.

#### delay

The delay time set for this source, in ms.

#### invert

Flips the polarity of the source.

#### pattern

The polar pattern of the source.


### Guides

#### type

'rect' or 'line'

#### x, y, angle

The position and rotation of the guide. For rectangular guides, this is the
position of the center of the rectangle; for lines, it is a point through which
the line must pass.

#### width, height

The width and height of rectangular guides.

#### reflect

Whether a line guide should reflect sound. This is currently implemented by just
mirroring all active sources along the line, which means that the resulting plot
will still show audio on both sides of the line, but you can just ignore the
side you don't care about. Also, multiple reflecting lines don't interact - each
line will simply mirror the original sources, and that's that. Basically it
should tell you what first reflections will do, which (especially in outdoors
settings, where you may have just a building on one side or something similar)
should be useful info.

#### absorption

When a line guide has reflections enabled, this parameter adjusts the initial
gain of the generated reflected sources. A value `<0` will be interpreted as
attenuation in dB; a value `>=0` will be interpreted as an absorption
coefficient the way it is usually specified for materials, i.e. ratio of the
absorbed energy to the incident energy. A coefficient of `0` means no
absorption, while a coefficient of `1` means total absorption.

#### color, label

The color and label of the guide.

## Expressions reference

### Basic info

*   Supported operators: `+`, `-`, `*`, `/` and `^` (for exponentiation).
    Operator precedence follows standard mathematical conventions.
*   Parentheses are supported.
*   Undefined variables are resolved to `0`.
*   Invalid expressions (e.g. due to syntax errors) resolve to `0`.
*   Calls to nonexistent functions make the entire expression fail, which makes
    its output `0`.
*   Whitespace is ignored.

### Global variables

#### `$c`

The speed of sound, in meters per second. Can be adjusted in simulation options.

### Function reference

#### `qw(freq: number): number`

Returns a quarter of the wavelength, in meters, of the specified frequency at
the current speed of sound. Useful for setting distances between sources.

#### `qt(freq: number): number`

Returns a quarter of the period of the specified frequency, in ms. Useful for
setting source delays.

#### `dt(dist: number): number`

Returns the delay produced by the specified physical distance, in ms.

#### `sin(angle: number): number`, `cos(angle: number): number`, `tan(angle: number): number`

Standard trigonometric functions. Angles are specified in degrees.

#### `asin(value: number): number`, `acos(value: number): number`, `atan(value: number): number`

Standard inverse trigonometric functions. Angles are returned in degrees.

#### `atan2(y: number, x: number): number`

Inverse tangent from coordinates. Note that `y` is specified first. The angle
is returned in degrees.

#### `deg(angleInRadians: number): number`, `rad(angleInDegrees: number): number`

These functions convert angles between degrees and radians.

#### `min(value: number[, value: number...]): number`, `max(value: number[, value: number...]): number`

These functions return, respectively, the smallest (most negative) and largest
(most positive) of the supplied parameters.

#### `clamp(value: number, min: number, max: number): number`

This function returns `value` clamped to the range `<min, max>`. It is a
shortcut for `max(min, min(max, value))`.

#### `round(value: number): number`, `floor(value: number): number`, `ceil(value: number): number`

Standard rounding functions.

#### `abs(value: number): number`

Returns the absolute value of the specified number.

#### `sign(value: number): number`

Returns `-1` if the value is less than zero, `1` if the value is greater than
zero, and `0` if the value is zero.
