export class Exporter {
  private readonly canvases: Map<string, HTMLCanvasElement> = new Map();

  setCanvas(type: string, canvas: HTMLCanvasElement): void {
    this.canvases.set(type, canvas);
  }

  exportImageOnto(ctx: CanvasRenderingContext2D, ui?: boolean, legend?: boolean): void {
    ctx.drawImage(this.getCanvas('plot'), 0, 0, ctx.canvas.width, ctx.canvas.height);
    ui && ctx.drawImage(this.getCanvas('ui'), 0, 0, ctx.canvas.width, ctx.canvas.height);

    if (legend) {
      const legendCanvas = this.getCanvas('legend');
      ctx.fillStyle = '#fff';
      ctx.fillRect(15, 15, legendCanvas.width + 10, legendCanvas.height);
      ctx.drawImage(legendCanvas, 20, 15);
    }
  }

  private getCanvas(type: string): HTMLCanvasElement {
    const canvas = this.canvases.get(type);

    if (!canvas) {
      throw new Error(`${type} canvas is not available`);
    }

    return canvas;
  }
}
