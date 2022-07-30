import { Vector } from "./world";

interface RenderEntityArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
}

export class RenderEntity {
  private draw({ ctx, position, zoom }: RenderEntityArguments): void {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.rect(position.x, position.y, 100 * zoom, 100 * zoom);
    ctx.fill();
  }

  render(renderArguments: RenderEntityArguments): void {
    this.draw(renderArguments);
  }
}
