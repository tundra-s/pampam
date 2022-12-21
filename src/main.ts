const SETTINGS = {
  greed: {
    size: 100,
    lineColor: "#fff",
  },
  backround: "#333",
};

type stateType = {
  canvas?: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
};

interface CanvasArgs {
  ctx: CanvasRenderingContext2D;
}

const state: stateType = {
  canvas: undefined,
  ctx: null,
};

const resize = (canvas: HTMLCanvasElement) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const createCanvas = () => {
  state.canvas = document.createElement("canvas");
  state.ctx = state.canvas.getContext("2d");

  resize(state.canvas);

  document.body.appendChild(state.canvas);
};

const clear = ({ ctx }: CanvasArgs) => {
  ctx.beginPath();
  ctx.fillStyle = SETTINGS.backround;
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();
};

const draw = ({ ctx }: CanvasArgs) => {
  clear({ ctx });

  ctx.beginPath();
  ctx.strokeStyle = SETTINGS.greed.lineColor;

  for (let i = 0; i < window.innerWidth; i += SETTINGS.greed.size) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, window.innerHeight);
  }

  for (let i = 0; i < window.innerHeight; i += SETTINGS.greed.size) {
    ctx.moveTo(0, i);
    ctx.lineTo(window.innerWidth, i);
  }

  ctx.stroke();
};

const render = (canvasArgs: CanvasArgs) => {
  draw(canvasArgs);

  window.requestAnimationFrame(() => render(canvasArgs));
};

const init = () => {
  createCanvas();

  if (!state.ctx) return;

  render({ ctx: state.ctx });

  window.addEventListener("resize", () => {
    if (state.canvas) resize(state.canvas);
  });
};

window.onload = init;
