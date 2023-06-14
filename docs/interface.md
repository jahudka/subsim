# User interface

The user interface is composed of two layers. The plot layer includes the plot
and its user interface elements (axes, guides, source symbols). You can interact
with this layer similarly to various map applications - pan the plot by dragging
it, and zoom using mouse wheel or two fingers.

In the control layer you'll find:
 - The plot legend at the top left - this is a visual guide mapping the plot
   colors to decibel values. You can click on the legend to cycle between the
   default gradient rendering mode and two stepped "isobaric" modes, with
   steps of 3dB and 6dB.
 - The top center project panel shows the name of the active project, along
   with "Save" and "Reload" buttons. When you hover over the plot, this panel
   will show contextual information about the place you're hovering over. The
   panel can be expanded using the V-shaped button on the right side to show
   the project menu, where you can create a new project, load one of the
   existing projects, or import a project from a JSON data file.
 - At the top right of the user interface you can find the "Help" button,
   which triggers the "Welcome to Subsim" tooltip also shown when you first
   load the app. This tooltip includes a link to this manual, as well as an
   option to toggle interactive tooltips. Below the "Help" button there is a
   "Share" button, which brings up the sharing menu; you can export the
   current view of the plot as an image, or export the entire project as a
   JSON data file.
 - And lastly, located at the bottom of the user interface is the main panel.
   In its default state, this panel shows a slider controlling the simulation
   frequency, as well as sliders and readouts for select user-defined
   variables. This panel can be expanded using the arrow at the top right to
   show tabs where you can configure sources, guides and variables, and also
   control more simulation options.


## Project panel

As explained above, the project panel serves two main functions: to manage your
projects, and to give contextual information about the plot. The project
management features should be fairly straightforward. Note that you can delete
neither the current project, nor any of the example projects; their "delete"
button is grayed out and inactive to indicate this. When saving a previously
saved project, it will always be overwritten, even if you change its name in the
"Save" dialog; to leave the original project unchanged, you can enable the "Save
as a copy" option in the dialog.

When the project panel is in its default collapsed state and you hover over the
plot, the panel will switch to show contextual information about the place
you're hovering over; this includes the final predicted SPL in decibels, as well
as a small illustration of the arrivals from each individual source in the form
of vertical bars, whose height matches the amplitude of the signal, and whose
horizontal position is proportional to the relative time difference between the
signals; therefore, the first signal to arrive at any given point will always be
represented by the leftmost vertical bar in this illustration. The range of the
relative time differences is currently fixed at 100ms.


## Main panel

The default view of the main panel is the so-called "quick-access" tool; in
this view, the panel includes a slider for the simulation frequency, and can be
configured to include sliders and / or readouts for user-defined variables.

If you expand it, you get access to four tabs:
 - The _sources_ tab is used to create and configure audio sources and / or
   generators.
 - The _guides_ tab allows you to create and configure visual guides.
 - The _variables_ tab contains variable definitions.
 - The _options_ tab allows you to adjust global simulation options.

If you enable interactive tooltips in the Help menu, you can hover over any
field in any tab to get a tooltip explaining what the field does.
