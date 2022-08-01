import { GREED, WORLD } from "../data/config";
import { RenderChunk } from "./renderChunk";

interface RenderWorldArguments {
  ctx: CanvasRenderingContext2D;
}

export interface Vector {
  x: number;
  y: number;
}

interface SceneObject {
  position: Vector;
  zoom: number;
}

export interface WorldMouse {
  buffer: Vector;
  actual: Vector;
}

export interface WorldViewport {
  scene: {
    renderSize: Vector;
    preloadSize: Vector;
  };
  localCoords: Vector;
  globalCoords: Vector;
  zoom: number;
}

export interface WorldGreed {
  background: string;
  line: string;
  size: number;
}

export type OnChunkLoaded = (coords: Vector) => void;

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
    scene: {
      renderSize: {
        x: 550,
        y: 330,
      },
      preloadSize: {
        x: 880,
        y: 660,
      },
    },
    localCoords: {
      x: 0,
      y: 0,
    },
    globalCoords: {
      x: 0,
      y: 0,
    },
    zoom: 2,
  };

  private sceneObjectQueue: RenderChunk[][] = [];

  showGreed: boolean = true;
  greed: WorldGreed = {
    background: GREED.background || "rgb(50, 50, 50)",
    line: GREED.line || "rgb(255, 255, 255)",
    size: GREED.size || 400,
  };

  constructor(globalCoords?: Vector) {
    this.viewport.globalCoords.x = globalCoords?.x || 0;
    this.viewport.globalCoords.y = globalCoords?.y || 0;

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
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(
        halfWidth -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            (((this.greed.size - this.viewport.localCoords.x) *
              this.viewport.zoom) %
              adaptiveGreedSize)),
        0
      );
      ctx.lineTo(
        halfWidth -
          adaptiveGreedSize * i -
          (adaptiveGreedSize -
            (((this.greed.size - this.viewport.localCoords.x) *
              this.viewport.zoom) %
              adaptiveGreedSize)),
        window.innerHeight
      );
      ctx.stroke();
    }

    for (let i = 0; i < halfWidth / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(
        halfWidth +
          adaptiveGreedSize * i +
          (((this.greed.size - this.viewport.localCoords.x) *
            this.viewport.zoom) %
            adaptiveGreedSize),
        0
      );
      ctx.lineTo(
        halfWidth +
          adaptiveGreedSize * i +
          (((this.greed.size - this.viewport.localCoords.x) *
            this.viewport.zoom) %
            adaptiveGreedSize),
        window.innerHeight
      );
      ctx.stroke();
    }

    for (let i = 0; i < halfHeight / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(
        0,
        halfHeight -
          adaptiveGreedSize * i -
          ((this.viewport.localCoords.y * this.viewport.zoom) %
            adaptiveGreedSize)
      );
      ctx.lineTo(
        window.innerWidth,
        halfHeight -
          adaptiveGreedSize * i -
          ((this.viewport.localCoords.y * this.viewport.zoom) %
            adaptiveGreedSize)
      );
      ctx.stroke();
    }

    for (let i = 1; i < halfHeight / 2; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(
        0,
        halfHeight +
          adaptiveGreedSize * i -
          ((this.viewport.localCoords.y * this.viewport.zoom) %
            adaptiveGreedSize)
      );
      ctx.lineTo(
        window.innerWidth,
        halfHeight +
          adaptiveGreedSize * i -
          ((this.viewport.localCoords.y * this.viewport.zoom) %
            adaptiveGreedSize)
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
    ctx.strokeStyle = "rgb(255, 255, 0)";
    ctx.moveTo(window.innerWidth / 2, 0);
    ctx.lineTo(window.innerWidth / 2, window.innerHeight);
    ctx.moveTo(0, window.innerHeight / 2);
    ctx.lineTo(window.innerWidth, window.innerHeight / 2);
    ctx.stroke();
  }

  private drawRenderZone({ ctx }: RenderWorldArguments): void {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 255, 255)";
    ctx.rect(
      x - this.viewport.scene.renderSize.x / 2,
      y - this.viewport.scene.renderSize.y / 2,
      this.viewport.scene.renderSize.x,
      this.viewport.scene.renderSize.y
    );
    ctx.stroke();
  }

  private drawDownloadZone({ ctx }: RenderWorldArguments): void {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 255)";
    ctx.rect(
      x - this.viewport.scene.preloadSize.x / 2,
      y - this.viewport.scene.preloadSize.y / 2,
      this.viewport.scene.preloadSize.x,
      this.viewport.scene.preloadSize.y
    );
    ctx.stroke();
  }

  private mouseMoveListener(e: MouseEvent): void {
    const dx = e.clientX - this.mouse.buffer.x;
    const dy = e.clientY - this.mouse.buffer.y;
    this.mouse.buffer.x = e.clientX;
    this.mouse.buffer.y = e.clientY;

    this.viewport.localCoords.x -= dx / this.viewport.zoom;
    this.viewport.localCoords.y -= dy / this.viewport.zoom;

    if (this.viewport.localCoords.x / this.greed.size >= 1) {
      this.viewport.globalCoords.x += Math.round(
        this.viewport.localCoords.x / this.greed.size
      );

      this.viewport.localCoords.x =
        this.viewport.localCoords.x % this.greed.size;
    } else if (this.viewport.localCoords.x < 0) {
      this.viewport.localCoords.x =
        this.greed.size + this.viewport.localCoords.x;

      this.viewport.globalCoords.x -= 1;
    }

    if (this.viewport.localCoords.y / this.greed.size >= 1) {
      this.viewport.globalCoords.y += Math.round(
        this.viewport.localCoords.y / this.greed.size
      );

      this.viewport.localCoords.y =
        this.viewport.localCoords.y % this.greed.size;
    } else if (this.viewport.localCoords.y < 0) {
      this.viewport.localCoords.y =
        this.greed.size + this.viewport.localCoords.y;

      this.viewport.globalCoords.y -= 1;
    }

    window.localStorage.vpx = this.viewport.globalCoords.x;
    window.localStorage.vpy = this.viewport.globalCoords.y;
  }

  private renderChildObjects(renderArguments: RenderWorldArguments): void {
    const dynamicX =
      window.innerWidth / 2 -
      (this.viewport.globalCoords.x * this.greed.size +
        this.viewport.localCoords.x +
        0) *
        this.viewport.zoom;

    const dynamicY =
      window.innerHeight / 2 -
      (this.viewport.globalCoords.y * this.greed.size +
        this.viewport.localCoords.y +
        0) *
        this.viewport.zoom;

    this.sceneObjectQueue.map((entity) => {
      entity.render({
        ctx: renderArguments.ctx,
        position: {
          x: dynamicX,
          y: dynamicY,
        },
        zoom: this.viewport.zoom,
      });
    });
  }

  getViewportValues(): WorldViewport {
    return this.viewport;
  }

  addToScene(addEntity: RenderChunk): void {
    const globalCoords = addEntity.getCoord();

    if (!Array.isArray(this.sceneObjectQueue[globalCoords.x])) {
      this.sceneObjectQueue[globalCoords.x] = [];
    }

    this.sceneObjectQueue[globalCoords.x][globalCoords.y] = addEntity;
  }

  removeFromScene(removeEntity: RenderChunk): boolean {
    let isRemoveSuccess = false;

    // TODO переписать на двухуровневый массив
    // this.sceneObjectQueue = this.sceneObjectQueue.filter((entity) => {
    //   if (entity == removeEntity) {
    //     isRemoveSuccess = true;
    //     return false;
    //   }
    // });

    return isRemoveSuccess;
  }

  requestChunk(onChunkQuerry: OnChunkLoaded): void {
    onChunkQuerry(this.viewport.globalCoords);
  }

  render(renderArguments: RenderWorldArguments): void {
    this.drawBackground(renderArguments);
    this.drawGreed(renderArguments);

    this.renderChildObjects(renderArguments);

    this.drawRenderZone(renderArguments);
    this.drawDownloadZone(renderArguments);
    this.drawCross(renderArguments);
  }
}
