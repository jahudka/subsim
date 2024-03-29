# Subsim manual intro

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

Projects can be exported using the export button at the top right of the screen,
either as an image, or as a JSON data file which you can share with others who
can then load it back into the app. Exported data files can be imported using
the "Import" button in the project list.

## Building blocks

### Sources

The most important part of the simulator are the _sources_ - these represent
individual speakers as idealised point sources. Sources can be added
individually, but if you're feeling fancy, you can use _generators_, which can
be used to define multiple sources in one go.

### Guides

Guides are visual helpers you can use to help you visualise the space in which
you're working - you can e.g. add a stage or an FOH and similar things.
Guides don't affect the simulation - with one exception: _line_ guides can be
configured to produce mirror images of the sources, which allows you to simulate
the effects of first reflections. See the [parameter reference](params.md) for
more info.

### Expressions

All numeric parameters of both _sources_ and _guides_ can be represented using
an _expression_, rather than just a number. Expressions can contain _variables_,
like `$c` for the speed of sound, but you can also define your own variables.
There is also a number of _functions_ you can call in expressions - see the
[expressions reference](expressions.md). This allows you to e.g. define a
variable representing the frequency for which you're tuning your array and then
specify all the spatial offsets and time delays of your sources as a function of
that frequency - meaning that if you want to try a different frequency, you just
adjust that one variable, and your entire array will reconfigure automatically.
All the numeric parameters will by default show their computed numeric values;
parameters which use an expression will have a blue underline, and you can hover
over them to show a tooltip with the source expression. This will switch while
you're editing such a parameter: the parameter field will then contain the
expression, and the tooltip will show the computed value.

### Variables

You can define variables for use in expressions. Variables can either be simple
values you can adjust manually, or they can be defined using an expression; this
comes in rather handy when you have a number of easily derived values which
repeat often in expressions in your project.

Subsim differentiates between several layers, or _scopes_, of variables:
_global_, _user_, and _generator_. Any user-defined variables belong to the
_user_ scope (surprising no-one). The variable `$c`, which represents the speed
of sound, is defined in the _global_ scope. When using a [generator](generators.md),
its `i` variable is defined in the _generator_ scope. This is important because
variables in a lower (more local) scope override variables defined in a higher
(less local) scope: a variable in the _user_ scope will override any variable of
the same name in the _global_ scope, and a variable in the _generator_ scope
will override any variable defined in either the _user_ or the _global_ scope.
So you can for example define your own `$c` and derive it from e.g. the room
temperature, which you can define as another variable, and then adjust that to
see what effect will changing the temperature have on the sound.

## Further reading

You can read more about the Subsim user interface in the [User interface](interface.md)
section. There is also a complete [parameter and option](params.md) reference
with detailed descriptions of what each option and parameter does. When you're
ready to make your models parametric, you can check out the
[expressions reference](expressions.md) and [generators](generators.md).
