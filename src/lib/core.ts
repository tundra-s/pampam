interface RenderChallengerArgument {
  ctx: CanvasRenderingContext2D;
}

type RenderChallenger = (arg: RenderChallengerArgument) => void;

export class Core {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D | null;

  constructor(canvasElement: HTMLCanvasElement) {
    // TODO точнее проверить что передан именно canvas
    if (!canvasElement) return;

    this.isRenderStopped = true;
    this.canvas = canvasElement;

    const context = canvasElement?.getContext("2d");

    if (context !== null) this.ctx = context;

    this._resize();

    window.requestAnimationFrame(() => this._render());
    window.addEventListener("resize", this._resize);
  }

  isRenderStopped: boolean = false;
  renderQueue: RenderChallenger[] = [];

  _resize() {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _render() {
    this.renderQueue.map((challengerRender) => {
      if (!challengerRender) return false;

      if (typeof challengerRender !== "function") return;

      console.log("s");
      if (this.ctx) {
        challengerRender({ ctx: this.ctx });
      }
    });

    if (!this.isRenderStopped)
      window.requestAnimationFrame(() => this._render());
  }

  startRender() {
    if (!this.isRenderStopped) return;

    window.requestAnimationFrame(() => this._render());
  }

  stopRender() {
    this.isRenderStopped = true;
  }

  addRender(renderChallenger: RenderChallenger) {
    // TODO обработать ошибку
    if (!renderChallenger) return;

    this.renderQueue.push(renderChallenger);

    this.isRenderStopped && this.startRender();
    this.isRenderStopped = false;
  }
}
