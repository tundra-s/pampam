import { GREED } from "../data/config";
import { Vector } from "./world";

interface RenderChunkArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
  renderZone: Vector;
}

interface RenderChunkPosition {
  global: Vector;
}

type RenderStatus = "idle" | "delete" | "loaded";

export class RenderChunk {
  private position: RenderChunkPosition = {
    global: {
      x: 0,
      y: 0,
    },
  };
  private status: RenderStatus = "idle";

  constructor(position: Vector, status?: RenderStatus) {
    this.position.global = position;

    if (status) this.status = status;
  }

  private draw({
    ctx,
    position,
    zoom,
    renderZone,
  }: RenderChunkArguments): void {
    let x = position.x + GREED.size * this.position.global.x * zoom;
    let y = position.y + GREED.size * this.position.global.y * zoom;

    if (this.status === "loaded") {
      ctx.beginPath();
      ctx.fillStyle = "rgb(30, 60, 30)";
      ctx.rect(x, y, GREED.size * zoom, GREED.size * zoom);
      ctx.fill();
    }

    if (this.status === "idle") {
      ctx.beginPath();
      ctx.fillStyle = "rgb(60, 30, 50)";
      ctx.rect(x, y, GREED.size * zoom, GREED.size * zoom);
      ctx.fill();
    }

    if (
      x > window.innerWidth / 2 - renderZone.x / 2 - GREED.size * zoom &&
      x < window.innerWidth / 2 + renderZone.x / 2 &&
      y > window.innerHeight / 2 - renderZone.y / 2 - GREED.size * zoom &&
      y < window.innerHeight / 2 + renderZone.y / 2
    ) {
      if (renderZone) {
        ctx.font = `${100 * zoom}px Arial`;
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
    }
  }

  setStatus(status: RenderStatus) {
    return (this.status = status);
  }

  getStatus(): RenderStatus {
    return this.status;
  }

  getCoord(): Vector {
    return this.position.global;
  }

  render(renderArguments: RenderChunkArguments): void {
    this.draw(renderArguments);
  }
}
