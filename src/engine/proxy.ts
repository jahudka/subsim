import { Guide, SimulationOptions, Source, ViewState } from '../state';
import { EventEmitter } from './eventEmitter';
import { EngineInterface } from './types';

export class ProxyEngine extends EventEmitter implements EngineInterface {
  private readonly worker = new Worker(
    new URL('./worker.ts', import.meta.url),
    { type: 'module' },
  );

  static isSupported(): boolean {
    return 'OffscreenCanvas' in window;
  }

  constructor() {
    super();
    this.worker.addEventListener('message', this.handleMessage.bind(this));
  }

  setCanvas(type: 'plot' | 'ui' | 'context' | 'legend', canvasEl: HTMLCanvasElement): void {
    const canvas = canvasEl.transferControlToOffscreen();
    this.worker.postMessage({ action: 'set-canvas', type, canvas }, [canvas]);
  }

  setCanvasSize(type: 'plot' | 'context' | 'legend', width: number, height: number): void {
    this.worker.postMessage({ action: 'set-canvas-size', type, width, height });
  }

  setOptions(options: SimulationOptions, $c: number): void {
    this.worker.postMessage({ action: 'set-options', options, $c });
  }

  setView(view: ViewState): void {
    this.worker.postMessage({ action: 'set-view', view });
  }

  mergeSource(source: Source): void {
    this.worker.postMessage({ action: 'merge-source', source });
  }

  deleteSource(id: string): void {
    this.worker.postMessage({ action: 'del-source', id });
  }

  mergeGuide(guide: Guide): void {
    this.worker.postMessage({ action: 'merge-guide', guide });
  }

  deleteGuide(id: string): void {
    this.worker.postMessage({ action: 'del-guide', id });
  }

  clearAll(): void {
    this.worker.postMessage({ action: 'clear-all' });
  }

  render(): void {
    this.worker.postMessage({ action: 'render' });
  }

  renderContext(x: number, y: number): void {
    this.worker.postMessage({ action: 'ctx', x, y });
  }

  private handleMessage(evt: MessageEvent): void {
    if (evt.data.type === 'emit') {
      this.emit(evt.data.event, ...(evt.data.args ?? []));
    }
  }
}
