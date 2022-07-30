import { GREED, WORLD } from "../data/config";
import { RenderEntity } from "./renderEntity";

interface RenderWorldArguments {
  ctx: CanvasRenderingContext2D;
}

interface GreedSettings {
  background: string;
  line: string;
  size: number;
}

interface Vector {
  x: number;
  y: number;
}

interface SceneObject {
  position: Vector;
  size: number;
}

export interface WorldMouse {
  buffer: Vector;
  actual: Vector;
}

export interface WorldViewport {
  localCoords: Vector;
  globalCoords: Vector;
  zoom: number;
}

export default class World {
  private mouse: WorldMouse = {
    buffer: {
      x: 0,
      y: 0,
    },
    actual: {
      x: 0,
      y: 0,
    },
  };

  private viewport: WorldViewport = {
    localCoords: {
      x: 0,
      y: 0,
    },
    globalCoords: {
      x: 0,
      y: 0,
    },
    zoom: 1,
  };

  private sceneObjectQueue: RenderEntity[] = [];

  showGreed: boolean = true;
  greed: GreedSettings = {
    background: "rgb(50, 50, 50)",
    line: "rgb(255, 255, 255)",
    size: 400,
  };

  constructor() {
    this.initMouseListeners();
  }

  private initMouseListeners() {
    const bindedMouseListener = this.mouseMoveListener.bind(this);

    window.addEventListener("mousedown", (e) => {
      this.mouse.buffer.x = e.clientX;
      this.mouse.buffer.y = e.clientY;

      window.addEventListener("mousemove", bindedMouseListener);
    });

    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", bindedMouseListener);
    });

    window.addEventListener("wheel", (e) => {
      const delta = e.deltaY * WORLD.zoom.zoomSpeed * this.viewport.zoom;

      if (delta + this.viewport.zoom > WORLD.zoom.max) {
        return (this.viewport.zoom = WORLD.zoom.max);
      }

      if (delta + this.viewport.zoom < WORLD.zoom.min) {
        return (this.viewport.zoom = WORLD.zoom.min);
      }

      this.viewport.zoom += delta;
    });
  }

  private drawBackground({ ctx }: RenderWorldArguments): void {
    ctx.beginPath();
    ctx.fillStyle = this.greed.background;
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fill();
  }

  // TODO refactor draw greed from 4 loop to 2 loop
  private drawGreed({ ctx }: RenderWorldArguments): void {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    const adaptiveGreedSize = GREED.size * this.viewport.zoom;

    for (let i = 0; i < halfWidth / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = GREED.line;
      ctx.moveTo(
        halfWidth -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.x * this.viewport.zoom) %
              adaptiveGreedSize)),
        0
      );
      ctx.lineTo(
        halfWidth -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.x * this.viewport.zoom) %
              adaptiveGreedSize)),
        window.innerHeight
      );
      ctx.stroke();
    }

    for (let i = 0; i < halfWidth / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = GREED.line;
      ctx.moveTo(
        halfWidth +
          adaptiveGreedSize * i +
          ((this.viewport.localCoords.x * this.viewport.zoom) %
            adaptiveGreedSize),
        0
      );
      ctx.lineTo(
        halfWidth +
          adaptiveGreedSize * i +
          ((this.viewport.localCoords.x * this.viewport.zoom) %
            adaptiveGreedSize),
        window.innerHeight
      );
      ctx.stroke();
    }

    for (let i = 0; i < halfHeight / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = GREED.line;
      ctx.moveTo(
        0,
        halfHeight -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.y * this.viewport.zoom) %
              adaptiveGreedSize))
      );
      ctx.lineTo(
        window.innerWidth,
        halfHeight -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.y * this.viewport.zoom) %
              adaptiveGreedSize))
      );
      ctx.stroke();
    }

    for (let i = 1; i < halfHeight / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = GREED.line;
      ctx.moveTo(
        0,
        halfHeight +
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.y * this.viewport.zoom) %
              adaptiveGreedSize))
      );
      ctx.lineTo(
        window.innerWidth,
        halfHeight +
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            ((this.viewport.localCoords.y * this.viewport.zoom) %
              adaptiveGreedSize))
      );
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.rect(
      (this.viewport.localCoords.x - 10) * this.viewport.zoom,
      (this.viewport.localCoords.y - 10) * this.viewport.zoom,
      20 * this.viewport.zoom,
      20 * this.viewport.zoom
    );
    ctx.fill();
  }

  private drawCross({ ctx }: RenderWorldArguments): void {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 255, 0)";
    ctx.moveTo(window.innerWidth / 2, 0);
    ctx.lineTo(window.innerWidth / 2, window.innerHeight);
    ctx.moveTo(0, window.innerHeight / 2);
    ctx.lineTo(window.innerWidth, window.innerHeight / 2);
    ctx.stroke();
  }

  private mouseMoveListener(e: MouseEvent): void {
    const dx = e.clientX - this.mouse.buffer.x;
    const dy = e.clientY - this.mouse.buffer.y;
    this.mouse.buffer.x = e.clientX;
    this.mouse.buffer.y = e.clientY;

    this.viewport.localCoords.x += dx;
    this.viewport.localCoords.y += dy;

    this.viewport.globalCoords.x = Math.round(
      this.viewport.localCoords.x / GREED.size
    );
    this.viewport.globalCoords.y = Math.round(
      this.viewport.localCoords.y / GREED.size
    );

    console.log(this.viewport.globalCoords);

    window.localStorage.vpx = this.viewport.globalCoords.x;
    window.localStorage.vpy = this.viewport.globalCoords.y;
  }

  getValues() {
    return this.viewport;
  }

  addToScene(addEntity: RenderEntity): void {
    this.sceneObjectQueue.push(addEntity);
  }

  removeFromScene(removeEntity: RenderEntity): boolean {
    let isRemoveSuccess = false;

    this.sceneObjectQueue = this.sceneObjectQueue.filter((entity) => {
      if (entity == removeEntity) {
        isRemoveSuccess = true;
        return false;
      }
    });

    return isRemoveSuccess;
  }

  render(renderArguments: RenderWorldArguments): void {
    this.drawBackground(renderArguments);
    this.drawGreed(renderArguments);
    this.drawCross(renderArguments);

    this.sceneObjectQueue.map((entity) => {
      entity.render({
        ctx: renderArguments.ctx,
        mouse: this.mouse,
        viewport: this.viewport,
      });
    });
  }
}
