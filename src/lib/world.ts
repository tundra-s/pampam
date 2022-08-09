import { GREED, WORLD } from "../data/config";
import { RenderChunk } from "./renderChunk";

export interface RenderWorldArguments {
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

interface RenderQueue {
  [key: string]: {
    [key: string]: RenderChunk;
  };
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
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.25,
      },
      preloadSize: {
        x: window.innerWidth * 0.6,
        y: window.innerHeight * 0.6,
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
    zoom: WORLD.zoom.default || 1,
  };

  private handleRequestChunk: OnChunkLoaded = (coords: Vector) => {};

  private sceneObjectQueue: RenderQueue = {};

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

      const displacement: Vector = {
        x:
          ((e.clientX - window.innerWidth / 2) / this.viewport.zoom) *
          delta *
          -1,
        y:
          ((e.clientY - window.innerHeight / 2) / this.viewport.zoom) *
          delta *
          -1,
      };

      if (delta + this.viewport.zoom > WORLD.zoom.max) {
        return (this.viewport.zoom = WORLD.zoom.max);
      }

      if (delta + this.viewport.zoom < WORLD.zoom.min) {
        return (this.viewport.zoom = WORLD.zoom.min);
      }

      this.applyNewCoords({ x: displacement.x, y: displacement.y });
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
      const x =
        halfWidth -
        adaptiveGreedSize * i -
        (adaptiveGreedSize -
          (((this.greed.size - this.viewport.localCoords.x) *
            this.viewport.zoom) %
            adaptiveGreedSize));

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    for (let i = 0; i < halfWidth / 2; i += 1) {
      const x =
        halfWidth +
        adaptiveGreedSize * i +
        (((this.greed.size - this.viewport.localCoords.x) *
          this.viewport.zoom) %
          adaptiveGreedSize);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }

    for (let i = 0; i < halfHeight / 2; i += 1) {
      const y =
        halfHeight -
        adaptiveGreedSize * i -
        ((this.viewport.localCoords.y * this.viewport.zoom) %
          adaptiveGreedSize);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }

    for (let i = 1; i < halfHeight / 2; i += 1) {
      const y =
        halfHeight +
        adaptiveGreedSize * i -
        ((this.viewport.localCoords.y * this.viewport.zoom) %
          adaptiveGreedSize);

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.greed.line;
      ctx.moveTo(0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }
  }

  private drawCross({ ctx }: RenderWorldArguments): void {
    ctx.beginPath();
    ctx.lineWidth = 2;
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
    ctx.lineWidth = 2;
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
    ctx.lineWidth = 2;
    ctx.rect(
      x - this.viewport.scene.preloadSize.x / 2,
      y - this.viewport.scene.preloadSize.y / 2,
      this.viewport.scene.preloadSize.x,
      this.viewport.scene.preloadSize.y
    );
    ctx.stroke();
  }

  private applyNewCoords(coords: Vector): void {
    this.viewport.localCoords.x -= coords.x / this.viewport.zoom;
    this.viewport.localCoords.y -= coords.y / this.viewport.zoom;

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

  private mouseMoveListener(e: MouseEvent): void {
    const dx = e.clientX - this.mouse.buffer.x;
    const dy = e.clientY - this.mouse.buffer.y;
    this.mouse.buffer.x = e.clientX;
    this.mouse.buffer.y = e.clientY;

    this.applyNewCoords({ x: dx, y: dy });
  }

  private renderChildObjects(renderArguments: RenderWorldArguments): void {
    const dynamicX: number =
      window.innerWidth / 2 -
      (this.viewport.globalCoords.x * this.greed.size +
        this.viewport.localCoords.x +
        0) *
        this.viewport.zoom;

    const dynamicY: number =
      window.innerHeight / 2 -
      (this.viewport.globalCoords.y * this.greed.size +
        this.viewport.localCoords.y +
        0) *
        this.viewport.zoom;

    for (let i in this.sceneObjectQueue) {
      for (let j in this.sceneObjectQueue[i]) {
        if (this.sceneObjectQueue[i][j]) {
          if (typeof this.sceneObjectQueue[i][j].render !== "function") return;

          this.sceneObjectQueue[i][j].render({
            ctx: renderArguments.ctx,
            position: {
              x: dynamicX,
              y: dynamicY,
            },
            zoom: this.viewport.zoom,
            renderZone: {
              x: this.viewport.scene.renderSize.x,
              y: this.viewport.scene.renderSize.y,
            },
          });
        }
      }
    }
  }

  private checkChunkZones(): void {
    const limit: Vector = {
      x: Math.ceil(
        this.viewport.scene.preloadSize.x /
          2 /
          (this.greed.size * this.viewport.zoom)
      ),
      y: Math.ceil(
        this.viewport.scene.preloadSize.y /
          2 /
          (this.greed.size * this.viewport.zoom)
      ),
    };

    const limitX = {
      min: this.viewport.globalCoords.x - limit.x,
      max: this.viewport.globalCoords.x + limit.x,
    };

    const limitY = {
      min: this.viewport.globalCoords.y - limit.y,
      max: this.viewport.globalCoords.y + limit.y,
    };

    for (let line in this.sceneObjectQueue) {
      for (let cell in this.sceneObjectQueue[line]) {
        if (this.sceneObjectQueue[line][cell] === undefined) return;

        const coords = this.sceneObjectQueue[line][cell].getCoord();
        const deltaX =
          Math.abs(coords.x - this.viewport.globalCoords.x) > limit.x;
        const deltaY =
          Math.abs(coords.y - this.viewport.globalCoords.y) > limit.y;

        if (deltaX || deltaY)
          this.removeFromScene(this.sceneObjectQueue[line][cell]);
      }
    }

    for (let i = limitX.min; i <= limitX.max; i += 1) {
      for (let j = limitY.min; j <= limitY.max; j += 1) {
        const line = this.sceneObjectQueue[i.toString(10)];

        if (line === undefined || line[j.toString(10)] === undefined) {
          this.handleRequestChunk({ x: i, y: j });
        }
      }
    }
  }

  getViewportValues(): WorldViewport {
    return this.viewport;
  }

  addToScene(addEntity: RenderChunk): void {
    const globalCoords = addEntity.getCoord();

    if (!this.sceneObjectQueue[globalCoords.x.toString(10)]) {
      this.sceneObjectQueue[globalCoords.x.toString(10)] = {};
    }

    this.sceneObjectQueue[globalCoords.x.toString(10)][
      globalCoords.y.toString(10)
    ] = addEntity;
  }

  removeFromScene(removeEntity: RenderChunk): boolean {
    let isRemoveSuccess = false;

    for (let i in this.sceneObjectQueue) {
      for (let j in this.sceneObjectQueue[i]) {
        if (this.sceneObjectQueue[i][j] === removeEntity) {
          delete this.sceneObjectQueue[i][j];
          isRemoveSuccess = true;
          return false;
        }
      }
    }

    return isRemoveSuccess;
  }

  requestChunk(onChunkQuerry: OnChunkLoaded): void {
    this.handleRequestChunk = (coords: Vector) => {
      const idleChunk = new RenderChunk({
        x: coords.x,
        y: coords.y,
      });

      this.addToScene(idleChunk);

      onChunkQuerry({
        x: coords.x,
        y: coords.y,
      });
    };
  }

  render(renderArguments: RenderWorldArguments): void {
    this.drawBackground(renderArguments);
    this.drawGreed(renderArguments);

    this.checkChunkZones();
    this.renderChildObjects(renderArguments);

    this.drawRenderZone(renderArguments);
    this.drawDownloadZone(renderArguments);
    this.drawCross(renderArguments);
  }
}
