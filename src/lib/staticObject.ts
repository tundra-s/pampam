import { RenderChunkArguments } from "./renderChunk";
import { Vector } from "./world";

interface StaticObjectPerspective {
  angle: number;
  deep: number;
}

interface StaticObjectPosition {
  x: number;
  y: number;
  perspective: StaticObjectPerspective;
}

export interface StaticObjectRenderArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
  perspective: StaticObjectPerspective;
}

export default class StaticObject {
  private position: StaticObjectPosition = {
    x: 10,
    y: 10,
    perspective: {
      angle: 45,
      deep: 100,
    },
  };

  constructor(coords: Vector) {
    this.position.x = coords.x;
    this.position.y = coords.y;
  }

  private draw({ ctx, position, zoom }: StaticObjectRenderArguments) {
    const x = position.x + this.position.x * zoom;
    const y = position.y + this.position.y * zoom;

    const rightTop: Vector = {
      x: 0,
      y: 0,
    };

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 100, y + 100);
    ctx.stroke();
  }

  render(renderArguments: StaticObjectRenderArguments) {
    this.draw(renderArguments);
  }
}
