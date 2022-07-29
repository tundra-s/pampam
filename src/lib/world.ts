import { GREED } from "../data/config";

interface RenderWorldArguments {
  ctx: CanvasRenderingContext2D;
}

interface GreedSettings {
  background: string;
  line: string;
  size: number;
}

export default class World {
  ctx?: CanvasRenderingContext2D | null;
  viewportX: number = 0;
  viewportY: number = 0;
  globalX: number = 0;
  globalY: number = 0;
  zoom: number = 1;
  greed: GreedSettings = {
    background: "rgb(50, 50, 50)",
    line: "rgb(255, 255, 255)",
    size: 100,
  };

  constructor() {}

  render({ ctx }: RenderWorldArguments): void {
    this.drawBackground(ctx);
  }

  drawBackground(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.greed.background;
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fill();
  }
}
