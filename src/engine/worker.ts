import { Engine } from './engine';

const engine = new Engine();

engine.on('plot-rendered', () => {
  self.postMessage({ type: 'emit', event: 'plot-rendered' });
});

engine.on('context-rendered', () => {
  self.postMessage({ type: 'emit', event: 'context-rendered' });
});

self.addEventListener('message', async (evt) => {
  switch (evt.data.action) {
    case 'set-canvas':
      engine.setCanvas(evt.data.type, evt.data.canvas);
      break;
    case 'set-canvas-size':
      engine.setCanvasSize(evt.data.type, evt.data.width, evt.data.height);
      break;
    case 'set-options':
      engine.setOptions(evt.data.options, evt.data.$c);
      break;
    case 'set-view':
      engine.setView(evt.data.view);
      break;
    case 'merge-source':
      engine.mergeSource(evt.data.source);
      break;
    case 'del-source':
      engine.deleteSource(evt.data.id);
      break;
    case 'merge-guide':
      engine.mergeGuide(evt.data.guide);
      break;
    case 'del-guide':
      engine.deleteGuide(evt.data.id);
      break;
    case 'clear-all':
      engine.clearAll();
      break;
    case 'render':
      engine.render();
      break;
    case 'ctx':
      engine.renderContext(evt.data.x, evt.data.y);
      break;
  }
});
