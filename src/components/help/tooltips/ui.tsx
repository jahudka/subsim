import { TooltipsToggle } from '../help';

export const legend = 'Click on the dynamic range legend to cycle between gradient and isobaric modes.';

export const help = () => (
  <>
    <h3>Welcome to Subsim!</h3>
    <p>
      This is a rudimentary tool for the simulation of subwoofer arrays.
      It is intended as a learning tool, <strong>not</strong> a real-world
      simulator!
    </p>
    <p>
      Expand the top panel to see some example projects.
    </p>
    <p className="hidden-sm">
      You can use "Add to home screen" on your phone to access Subsim even when you're offline.
    </p>
    <p>
      <a href="./docs/" target="_blank">Manual</a>
      {' | '}
      <a href="https://github.com/jahudka/subsim" target="_blank">About & source code</a>
    </p>
    <TooltipsToggle>Show interactive tooltips</TooltipsToggle>
  </>
);
