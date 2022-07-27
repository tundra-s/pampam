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
  zoom: 1,
};

const buffer = {
  x: 0,
  y: 0,
};

const drawGreed = (ctx) => {
  const adaptiveGreedSize = GREED.size * viewport.zoom;

  ctx.beginPath();
  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(i * adaptiveGreedSize + (viewport.x % adaptiveGreedSize), 0);
    ctx.lineTo(
      i * adaptiveGreedSize + (viewport.x % adaptiveGreedSize),
      window.innerHeight
    );
  }

  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.moveTo(0, adaptiveGreedSize * i + (viewport.y % adaptiveGreedSize));
    ctx.lineTo(
      window.innerWidth,
      adaptiveGreedSize * i + (viewport.y % adaptiveGreedSize)
    );
  }
  ctx.stroke();
};

const drawBackground = (ctx) => {
  ctx.beginPath();
  ctx.fillStyle = GREED.background;
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fill();
};

const updateInfoUI = () => {
  info.log("viewportX", viewport.x);
  info.log("viewportY", viewport.y);
  info.log("zoom", viewport.zoom);
};

const draw = ({ ctx }) => {
  drawBackground(ctx);
  drawGreed(ctx);
  updateInfoUI();
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

  window.addEventListener("wheel", (e) => {
    viewport.zoom += e.deltaY * SCROLL_WEIGTH;
  });
};

const init = () => {
  const canvas = document.querySelector(`#${ID_CANVAS}`);
  const core = new Core(canvas);

  core.addRender(draw);

  initListeners();
};

window.onload = init;
