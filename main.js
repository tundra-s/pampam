const BACKGROUND_COLOR = "rgb(50, 50, 50)";
const ID_CANVAS = "canvas";
const MAX_FIELD = {
  x: 10000,
  y: 10000,
};

const Info = function () {
  const queue = {};

  const init = () => {
    this.wrapper = document.createElement("div");

    this.wrapper.classList.add("info");

    document.body.append(this.wrapper);
  };

  const refresh = () => {
    this.wrapper.innerHTML = "";

    for (let key in queue) {
      const line = document.createElement("div");
      line.classList.add("info__line");
      line.innerText = `${key} : ${queue[key]}`;
      this.wrapper.append(line);
    }
  };

  init();

  return {
    log: (name, value) => {
      queue[name] = value;
      refresh();
    },
  };
};

const info = new Info();

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
  const adaptiveGreedSize = grid.size * 0.3;

  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.moveTo(i * adaptiveGreedSize + (viewport.x % adaptiveGreedSize), 0);
    ctx.lineTo(
      i * adaptiveGreedSize + (viewport.x % adaptiveGreedSize),
      window.innerHeight
    );
    ctx.stroke();
  }

  // Отрисовка грида по Y

  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.moveTo(0, adaptiveGreedSize * i + (viewport.y % adaptiveGreedSize));
    ctx.lineTo(
      window.innerWidth,
      adaptiveGreedSize * i + (viewport.y % adaptiveGreedSize)
    );
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
  info.log("viewportX", viewport.x);
  info.log("viewportY", viewport.y);
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
