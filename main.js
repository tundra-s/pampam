const BACKGROUND_COLOR = "rgb(50, 50, 50)";

const context = {};

const getContext = () => {
  return context.ctx;
};

const initContext = () => {
  context.canvas = document.querySelector("#canvas");
  context.ctx = context.canvas && context.canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
};

const draw = () => {
  const ctx = getContext();

  ctx.beginPath();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();
};

const render = () => {
  draw();

  window.requestAnimationFrame(render);
};

const init = () => {
  initContext();
  window.requestAnimationFrame(render);
};

window.onload = init;
