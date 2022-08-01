import { GREED } from "../data/config";
import { Vector } from "./world";

interface RenderChunkArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
}

interface RenderChunkPosition {
  global: Vector;
}

export class RenderChunk {
  private position: RenderChunkPosition = {
    global: {
      x: 0,
      y: 0,
    },
  };

  constructor(position: Vector) {
    this.position.global = position;
  }

  private draw({ ctx, position, zoom }: RenderChunkArguments): void {
    let x = position.x + GREED.size * this.position.global.x * zoom;
    let y =
      position.y +
      GREED.size * this.position.global.y * zoom -
      (GREED.size * zoom) / 2;

    ctx.beginPath();
    ctx.fillStyle = "rgb(30, 50, 30)";
    ctx.rect(x, y, GREED.size * zoom, GREED.size * zoom);
    ctx.fill();

    ctx.font = `${120 * zoom}px Arial`;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(
      `G [ ${Math.round(this.position.global.x)} : ${Math.round(
        this.position.global.y
      )} ]`,
      x + (GREED.size * zoom) / 6,
      y + (GREED.size * zoom) / 3
    );
    ctx.fillText(
      `L [${Math.round(x)} : ${Math.round(y)}]`,
      x + (GREED.size * zoom) / 6,
      y + (GREED.size * zoom) / 2
    );
  }

  render(renderArguments: RenderChunkArguments): void {
    this.draw(renderArguments);
  }
}
