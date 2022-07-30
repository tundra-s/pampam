import { WorldMouse, WorldViewport } from "./world";

interface RenderEntityArguments {
  ctx: CanvasRenderingContext2D;
  mouse: WorldMouse;
  viewport: WorldViewport;
}

export class RenderEntity {
  private draw({ ctx, viewport }: RenderEntityArguments): void {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.rect(
      (viewport.localCoords.x + 0) * viewport.zoom,
      viewport.localCoords.y + 0 * viewport.zoom,
      100 * viewport.zoom,
      100 * viewport.zoom
    );
    ctx.fill();
  }

  render(renderArguments: RenderEntityArguments): void {
    this.draw(renderArguments);
  }
}
