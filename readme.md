# Subsim - a subwoofer array simulator

This is an extremely simplified simulator of subwoofer arrays.
I mostly wrote it to learn how subwoofer arrays work, so take
it with a grain (or perhaps a truckload, really) of salt.

It is intended more as a "textbook companion" than a tool for
actual engineers to use in the field - there are probably _vastly_
more things going on in the real world than this thing attempts
to simulate - but to help you get the basic concepts it should
hopefully be adequate.

## [See it in action](https://jahudka.github.io/subsim/)
## [Manual](https://github.com/jahudka/subsim/blob/main/docs/manual.md)

## What is Subsim?

This tool is a bare-bones theoretical simulator of how multiple
subwoofers should sum in a given open area. It allows you to
place different sources of audio on a 2D plane
and adjust their settings, such as gain, phase flip, or delay;
the plot will show you how the audio would propagate through the
area and what the resulting amplitude at each point should be.
If you hover over the plot, the tool will show you a readout
of the predicted SPL, as well as a visualisation of the relative
arrival times and gains at that point in space.

## Some important things

I developed this simulator while I was trying to learn about
subwoofer arrays myself, and while I'm reasonably confident that
the math is right and that the predictions the simulator outputs
should be pretty accurate, it bears saying that I'm not an authority
on any of this - I possess high-school level math skills at best,
I'm not an actual engineer with a degree or anything like that -
so it must be said that this tool comes with no guarantees of
any sort. It might be spot on, or it might be completely wrong.
But hopefully as a quick & dirty tool for learning the basics
it might just do the trick.
