export const tab = 'The Options tab allows you to change some common parameters of the simulation engine.';
export const frequency = () => (
  <>
    <p>The frequency at which sound propagation is simulated.</p>
    <p>This can also be controlled using the "frequency" slider in the default view.</p>
  </>
);
export const gain = () => (
  <>
    <p>This field controls the overall gain applied to all sources.</p>
    <p>It is the equivalent of your console's master fader.</p>
  </>
);
export const range = () => (
  <>
    <p>This field controls the dynamic range of the simulation.</p>
    <p>
      The simulation always goes up to <code>+6dB</code>, so setting this field to
      e.g. <code>36</code> would mean the absolute resulting range would
      be <code>-30..+6dB</code>.
    </p>
  </>
);
export const step = () => (
  <>
    <p>
      This field allows you to choose between a smooth gradient display
      and two isobaric modes with 3 and 6 dB steps.
    </p>
    <p>
      The isobaric modes may give you a better idea of which areas
      will be at a similar level.
    </p>
  </>
);
export const $c = () => (
  <>
    <p>This field allows you to change the speed of sound used in the simulation.</p>
    <p>Note that the speed of sound is available in <code>expressions</code> as the <code>$c</code> variable.</p>
  </>
);
