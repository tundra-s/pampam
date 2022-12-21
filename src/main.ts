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

const draw = ({ ctx }: CanvasArgs) => {
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.lineTo(100, 100);
  ctx.stroke();
};

const init = () => {
  createCanvas();

  if (!state.ctx) return;

  draw({ ctx: state.ctx });

  window.addEventListener("resize", () => {
    if (state.canvas) resize(state.canvas);
  });
};

window.onload = init;
