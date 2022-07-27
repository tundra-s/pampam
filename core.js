class Core {
  renderQueue = [];
  isRenderStopped = false;

  constructor() {}

  _render() {
    this.renderQueue.map((challengerRender) => {
      if (!challengerRender) return false;

      if (typeof challengerRender === "function") return challengerRender();

      if (
        challengerRender.render &&
        typeof challengerRender.render === "function"
      ) {
        return challengerRender.render();
      }
    });

    if (!this.isRenderStopped) window.requestAnimationFrame(this._render);
  }

  startRender() {
    window.requestAnimationFrame(this._render);
  }

  stopRender() {
    this.isRenderStopped = true;
  }

  addRender(renderChallenger) {
    // TODO обработать ошибку
    if (!renderChallenger) return;

    this.renderQueue.push(renderChallenger);
  }
}
