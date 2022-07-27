class Core {
  constructor(canvasElement) {
    // TODO точнее проверить что передан именно canvas
    if (!canvasElement) return;

    this.renderQueue = [];
    this.isRenderStopped = true;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext && canvasElement.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.requestAnimationFrame(() => this._render());
  }

  _render() {
    this.renderQueue.map((challengerRender) => {
      if (!challengerRender) return false;

      if (typeof challengerRender === "function")
        return challengerRender({ ctx: this.ctx });

      if (
        challengerRender.render &&
        typeof challengerRender.render === "function"
      ) {
        return challengerRender.render({ ctx: this.ctx });
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

  addRender(renderChallenger) {
    // TODO обработать ошибку
    if (!renderChallenger) return;

    this.renderQueue.push(renderChallenger);

    this.isRenderStopped && this.startRender();
    this.isRenderStopped = false;
  }
}
