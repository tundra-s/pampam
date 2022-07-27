const BACKGROUND_COLOR = "rgb(50, 50, 50)";
const ID_CANVAS = "canvas";

const viewport = {
  x: 0,
  y: 0,
};

const grid = {
  size: 100,
};

const buffer = {
  x: 0,
  y: 0,
};

const drawGreed = (ctx) => {
  for (let i = 0; i < window.innerWidth / grid.size; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.moveTo(i * grid.size * 0.3 + viewport.x, 0);
    ctx.lineTo(i * grid.size * 0.3 + viewport.x, window.innerHeight);
    ctx.stroke();
  }

  for (let i = 0; i < window.innerWidth / grid.size; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.moveTo(0, grid.size * i * 0.3 + viewport.y);
    ctx.lineTo(window.innerWidth, grid.size * i * 0.3 + viewport.y);
    ctx.stroke();
  }
};

const drawBackground = (ctx) => {
  ctx.beginPath();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();
};

const draw = ({ ctx }) => {
  drawBackground(ctx);
  drawGreed(ctx);
};

const updateMousePosition = (dx, dy) => {
  if (!dx || !dy) return;

  viewport.x = dx;
  viewport.y = dy;
};

const mouseMoveListener = (e) => {
  const dx = e.clientX - buffer.x;
  const dy = e.clientY - buffer.y;
  buffer.x = e.clientX;
  buffer.y = e.clientY;

  viewport.x += dx;
  viewport.y += dy;
};

const initListeners = () => {
  window.addEventListener("mousedown", (e) => {
    buffer.x = e.clientX;
    buffer.y = e.clientY;

    window.addEventListener("mousemove", mouseMoveListener);
  });

  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", mouseMoveListener);
  });
};

const init = () => {
  const canvas = document.querySelector(`#${ID_CANVAS}`);
  const core = new Core(canvas);

  core.addRender(draw);

  initListeners();
};

window.onload = init;
