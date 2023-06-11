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
