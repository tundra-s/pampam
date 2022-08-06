import { GREED } from "../data/config";
import StaticObject from "./staticObject";
import { Vector } from "./world";

export interface RenderChunkArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
  renderZone: Vector;
}

interface RenderChunkPosition {
  global: Vector;
}

interface ChunkOption {
  background: string;
  renderZoomLimit: number;
}

type StaticObjects = StaticObject[];

type RenderStatus = "idle" | "delete" | "loaded";

export class RenderChunk {
  private position: RenderChunkPosition = {
    global: {
      x: 0,
      y: 0,
    },
  };
  private chunkOption: ChunkOption = {
    background: "rgb(30, 60, 30)",
    renderZoomLimit: 0.02,
  };
  private status: RenderStatus = "idle";
  private childObjects: StaticObjects = [];

  constructor(
    position: Vector,
    status?: RenderStatus,
    staticObjects?: StaticObjects
  ) {
    this.position.global = position;

    if (staticObjects) this.childObjects = staticObjects;

    if (status) this.status = status;
  }

  private checkRenderZone({
    position,
    zoom,
    renderZone,
  }: RenderChunkArguments): boolean {
    let x = position.x + GREED.size * this.position.global.x * zoom;
    let y = position.y + GREED.size * this.position.global.y * zoom;

    if (
      x > window.innerWidth / 2 - renderZone.x / 2 - GREED.size * zoom &&
      x < window.innerWidth / 2 + renderZone.x / 2 &&
      y > window.innerHeight / 2 - renderZone.y / 2 - GREED.size * zoom &&
      y < window.innerHeight / 2 + renderZone.y / 2
    ) {
      return true;
    }
    return false;
  }

  private draw({
    ctx,
    position,
    zoom,
    renderZone,
  }: RenderChunkArguments): void {
    let x = position.x + GREED.size * this.position.global.x * zoom;
    let y = position.y + GREED.size * this.position.global.y * zoom;

    ctx.beginPath();
    if (this.status === "loaded") ctx.fillStyle = this.chunkOption.background;
    if (this.status === "idle") ctx.fillStyle = "rgb(60, 30, 50)";
    ctx.rect(x, y, GREED.size * zoom, GREED.size * zoom);
    ctx.fill();

    if (this.checkRenderZone({ ctx, position, zoom, renderZone })) {
      this.childObjects.map((child) => {
        child.render({
          ctx,
          zoom,
          position: { x, y },
          perspective: { angle: 45, deep: 10 },
        });
      });

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

  private drawPreview({
    ctx,
    position,
    zoom,
    renderZone,
  }: RenderChunkArguments): void {
    let x = position.x + GREED.size * this.position.global.x * zoom;
    let y = position.y + GREED.size * this.position.global.y * zoom;

    ctx.beginPath();
    if (this.status === "loaded") ctx.fillStyle = this.chunkOption.background;
    if (this.status === "idle") ctx.fillStyle = "rgb(60, 30, 50)";
    ctx.rect(x, y, GREED.size * zoom, GREED.size * zoom);
    ctx.fill();

    if (this.checkRenderZone({ ctx, position, zoom, renderZone })) {
      ctx.font = `${140 * zoom}px Arial`;
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(
        `${Math.round(this.position.global.x)} : ${Math.round(
          this.position.global.y
        )}`,
        x + (GREED.size * zoom) / 6,
        y + (GREED.size * zoom) / 3
      );
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
    if (renderArguments.zoom > this.chunkOption.renderZoomLimit) {
      this.draw(renderArguments);
    } else {
      this.drawPreview(renderArguments);
    }
  }
}
