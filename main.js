const context = {};

const getContext = () => {
  return context.ctx;
};

const initContext = () => {
  context.canvas = document.querySelector("#canvas");
  context.ctx = context.canvas && context.canvas.getContext("2d");
};

const draw = () => {};

const render = () => {
  draw();

  window.requestAnimationFrame(render);
};

const init = () => {
  initContext();
  window.requestAnimationFrame(render);
};

window.onload = init;
