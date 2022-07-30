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
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.rect(
      position.x + GREED.size * this.position.global.x * zoom,
      position.y + GREED.size * this.position.global.y * zoom,
      GREED.size * zoom,
      GREED.size * zoom
    );
    ctx.fill();
  }

  render(renderArguments: RenderChunkArguments): void {
    this.draw(renderArguments);
  }
}
