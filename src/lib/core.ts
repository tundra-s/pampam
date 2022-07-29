interface RenderChallengerArgument {
  ctx: CanvasRenderingContext2D;
}

type RenderChallenger = (arg: RenderChallengerArgument) => void;

export class Core {
  renderQueue: RenderChallenger[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  isRenderStopped: boolean;

  constructor(canvasElement: HTMLCanvasElement) {
    // TODO точнее проверить что передан именно canvas
    if (!canvasElement) return;

    this.renderQueue = [];
    this.isRenderStopped = true;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext && canvasElement.getContext("2d");

    this._resize();

    window.requestAnimationFrame(() => this._render());
    window.addEventListener("resize", this._resize);
  }

  _resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _render() {
    this.renderQueue.map((challengerRender) => {
      if (!challengerRender) return false;

      if (typeof challengerRender !== "function") return;

      challengerRender({ ctx: this.ctx });
    });

    if (!this.isRenderStopped)
      window.requestAnimationFrame(() => this._render());
  }

  startRender(): void {
    if (!this.isRenderStopped) return;

    window.requestAnimationFrame(() => this._render());
  }

  stopRender() {
    this.isRenderStopped = true;
  }

  addRender(renderChallenger: RenderChallenger): boolean {
    // TODO обработать ошибку
    if (!renderChallenger) return;

    this.renderQueue.push(renderChallenger);

    this.isRenderStopped && this.startRender();
    this.isRenderStopped = false;
  }
}
