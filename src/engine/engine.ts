import { Guide, SimulationOptions, Source, ViewState } from '../state';
import { ArrivalMap } from './arrivalMap';
import { ContextRenderer } from './contextRenderer';
import { GainMap } from './gainMap';
import { LegendRenderer } from './legendRenderer';
import { PlotRenderer } from './plotRenderer';
import { EngineInterface } from './types';
import { UiRenderer } from './uiRenderer';

export class Engine implements EngineInterface {
  private readonly arrivals: ArrivalMap;
  private readonly gainMap: GainMap;
  private readonly plot: PlotRenderer;
  private readonly ui: UiRenderer;
  private readonly context: ContextRenderer;
  private readonly legend: LegendRenderer;

  constructor() {
    this.arrivals = new ArrivalMap();
    this.gainMap = new GainMap(this.arrivals);
    this.plot = new PlotRenderer(this.gainMap);
    this.ui = new UiRenderer();
    this.context = new ContextRenderer(this.arrivals, this.gainMap);
    this.legend = new LegendRenderer();
  }

  setCanvas(type: 'plot' | 'ui' | 'context' | 'legend', canvas: HTMLCanvasElement | OffscreenCanvas): void {
    const ctx = canvas.getContext('2d') as any;

    switch (type) {
      case 'plot':
        this.plot.setContext(ctx);
        this.plot.render();
        break;
      case 'ui':
        this.ui.setContext(ctx);
        this.ui.render();
        break;
      case 'context':
        this.context.setContext(ctx);
        break;
      case 'legend':
        this.legend.setContext(ctx);
        break;
    }
  }

  setCanvasSize(type: 'plot' | 'context' | 'legend', width: number, height: number): void {
    switch (type) {
      case 'plot':
        this.ui.setCanvasSize(width, height);
        this.plot.setCanvasSize(width, height);
        this.ui.render();
        this.plot.render();
        break;
      case 'context':
        this.context.setCanvasSize(width, height);
        break;
      case 'legend':
        this.legend.setCanvasSize(width, height);
        break;
    }
  }

  setOptions(options: SimulationOptions, $c: number): void {
    this.arrivals.setSpeedOfSound($c);
    this.gainMap.setOptions(options.frequency, options.gain);
    this.plot.setOptions(options.range, options.step);
    this.plot.render();
    this.legend.setOptions(options.range, options.step);
  }

  setView(view: ViewState): void {
    this.arrivals.clear();
    this.ui.setView(view);
    this.plot.setView(view);
    this.ui.render();
    this.plot.render();
  }

  mergeSource(source: Source): void {
    this.ui.mergeSource(source);
    this.arrivals.mergeSource(source);
    this.ui.render();
    this.plot.render();
  }

  deleteSource(id: string): void {
    this.ui.deleteSource(id);
    this.arrivals.deleteSource(id);
    this.ui.render();
    this.plot.render();
  }

  mergeGuide(guide: Guide): void {
    this.ui.mergeGuide(guide);
    guide.kind === 'line' && this.arrivals.mergeWall(guide);
    this.ui.render();
    guide.kind === 'line' && this.plot.render();
  }

  deleteGuide(id: string): void {
    this.ui.deleteGuide(id);
    this.arrivals.deleteWall(id);
    this.ui.render();
    this.plot.render();
  }

  clearAll(): void {
    this.ui.clearAll();
    this.arrivals.clearAll();
  }

  render(): void {
    this.ui.render();
    this.plot.render();
  }

  renderContext(x: number, y: number): void {
    this.context.render(x, y);
  }

  on(event: 'plot-rendered', handler: () => void): void;
  on(event: 'context-rendered', handler: () => void): void;
  on(event: string, handler: () => void): void {
    switch (event) {
      case 'plot-rendered':
        this.plot.on('rendered', handler);
        break;
      case 'context-rendered':
        this.context.on('rendered', handler);
        break;
    }
  }

  once(event: 'plot-rendered', handler: () => void): void;
  once(event: 'context-rendered', handler: () => void): void;
  once(event: string, handler: () => void): void {
    switch (event) {
      case 'plot-rendered':
        this.plot.once('rendered', handler);
        break;
      case 'context-rendered':
        this.context.once('rendered', handler);
        break;
    }
  }

  off(event?: 'plot-rendered', handler?: () => void): void;
  off(event?: 'context-rendered', handler?: () => void): void;
  off(event?: string, handler?: () => void): void {
    switch (event) {
      case 'plot-rendered':
        this.plot.off('rendered', handler);
        break;
      case 'context-rendered':
        this.context.off('rendered', handler);
        break;
      default:
        this.plot.off(event, handler);
        this.context.off(event, handler);
        break;
    }
  }
}
