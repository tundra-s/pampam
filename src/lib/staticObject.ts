import { GREED } from "../data/config";
import Convert from "../mock/convert";
import { Vector } from "./world";

interface StaticObjectPerspective {
  angle: number;
  deep: number;
}

interface StaticObjectPosition {
  x: number;
  y: number;
  perspective: StaticObjectPerspective;
  floor: number;
}

export interface StaticObjectRenderArguments {
  ctx: CanvasRenderingContext2D;
  position: Vector;
  zoom: number;
  perspective: StaticObjectPerspective;
}

interface StaticObjectCreate {
  x: number;
  y: number;
  floor: number;
}

export default class StaticObject {
  private position: StaticObjectPosition = {
    x: 10,
    y: 10,
    perspective: {
      angle: 45,
      deep: 100,
    },
    floor: 1,
  };

  constructor({ x, y, floor }: StaticObjectCreate) {
    this.position.x = x;
    this.position.y = y;
    this.position.floor = floor;
  }

  private draw({ ctx, position, zoom }: StaticObjectRenderArguments) {
    const OBJECT_SIZE = {
      width: 50,
      length: 100,
      height: this.position.floor || 1,
      heightSize: 30,
    };

    const convert = new Convert();

    const x = position.x + this.position.x * zoom;
    const y = position.y + this.position.y * zoom;

    const offsetWidth: Vector = convert.getVectorSize(
      OBJECT_SIZE.width * zoom,
      this.position.perspective.angle
    );

    const offsetLength: Vector = convert.getVectorSize(
      OBJECT_SIZE.length * zoom,
      this.position.perspective.angle - 20
    );

    const height = OBJECT_SIZE.height * OBJECT_SIZE.heightSize * zoom;

    // крыша
    ctx.beginPath();
    ctx.fillStyle = "rgb(230, 250, 210)";
    ctx.moveTo(x, y);
    ctx.lineTo(offsetWidth.x + x, y - offsetWidth.y);
    ctx.lineTo(
      offsetWidth.x + x + offsetLength.x,
      y - offsetWidth.y + offsetLength.y
    );
    ctx.lineTo(x + offsetLength.x, y + offsetLength.y);
    ctx.lineTo(x, y);
    ctx.fill();

    // Этажи
    // Передняя стена
    ctx.beginPath();
    ctx.fillStyle = "rgb(200, 250, 100)";
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + offsetLength.x, y + offsetLength.y + height);
    ctx.lineTo(x + offsetLength.x, y + offsetLength.y);
    ctx.lineTo(x, y);
    ctx.fill();

    // Задняя стена
    ctx.beginPath();
    ctx.fillStyle = "rgb(120, 190, 40)";
    ctx.moveTo(x + offsetLength.x, y + offsetLength.y);
    ctx.lineTo(x + offsetLength.x, y + offsetLength.y + height);
    ctx.lineTo(
      x + offsetWidth.x + offsetLength.x,
      y + height - offsetWidth.y + offsetLength.y
    );
    ctx.lineTo(
      x + offsetWidth.x + offsetLength.x,
      y - offsetWidth.y + offsetLength.y
    );
    ctx.fill();
  }

  render(renderArguments: StaticObjectRenderArguments) {
    this.draw(renderArguments);
  }
}
