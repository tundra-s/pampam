export interface RenderChallengerArgument {
  ctx: CanvasRenderingContext2D;
}

export type RenderChallenger = (arg: RenderChallengerArgument) => void;

export class Core {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D | null;

  constructor(canvasElement: HTMLCanvasElement) {
    if (!canvasElement) return;

    this.isRenderStopped = true;
    this.canvas = canvasElement;

    const context = canvasElement?.getContext("2d");

    if (context === null) return;

    this.ctx = context;
    this.resize();

    window.requestAnimationFrame(() => this.render());
    window.addEventListener("resize", this.resize);
  }

  isRenderStopped: boolean = false;
  renderQueue: RenderChallenger[] = [];

  private resize(): void {
    if (!this.canvas) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private render(): void {
    this.renderQueue.map((challengerRender) => {
      if (!challengerRender) return;

      if (typeof challengerRender !== "function") return;

      if (this.ctx) {
        challengerRender({ ctx: this.ctx });
      }
    });

    if (!this.isRenderStopped)
      window.requestAnimationFrame(() => this.render());
  }

  isCreated(): boolean {
    return this.ctx !== undefined && this.ctx !== null;
  }

  startRender(): void {
    if (!this.isRenderStopped) return;

    window.requestAnimationFrame(() => this.render());
  }

  stopRender(): void {
    this.isRenderStopped = true;
  }

  addRender(renderChallenger: RenderChallenger): boolean {
    // TODO обработать ошибку
    if (!renderChallenger) return false;

    this.renderQueue.push(renderChallenger);

    this.isRenderStopped && this.startRender();
    this.isRenderStopped = false;

    return true;
  }
}
