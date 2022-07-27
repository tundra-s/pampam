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

const mouse = {
  x: 0,
  y: 0,
};

const viewport = {
  x: 0,
  y: 0,
  globalX: 0,
  globalY: 0,
  zoom: 1,
};

const buffer = {
  x: 0,
  y: 0,
};

const drawGreed = (ctx) => {
  const adaptiveGreedSize = GREED.size * viewport.zoom;

  info.log("someX", viewport.x % adaptiveGreedSize);
  info.log("someY", viewport.y % adaptiveGreedSize);

  ctx.beginPath();
  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(i * adaptiveGreedSize + (mouse.x % adaptiveGreedSize), 0);
    ctx.lineTo(
      i * adaptiveGreedSize + (mouse.x % adaptiveGreedSize),
      window.innerHeight
    );
  }

  for (let i = 0; i < window.innerWidth / adaptiveGreedSize; i += 1) {
    ctx.moveTo(0, adaptiveGreedSize * i + (mouse.y % adaptiveGreedSize));
    ctx.lineTo(
      window.innerWidth,
      adaptiveGreedSize * i + (mouse.y % adaptiveGreedSize)
    );
  }
  ctx.stroke();

  // ctx.beginPath();
  // ctx.fillStyle = "rgb(255, 0, 0)";
  // ctx.rect(viewport.x - 10, viewport.y - 10, 20, 20);
  // ctx.fill();
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
  info.log("iii", "----");
  info.log("zoom", viewport.zoom);
  info.log("ii", "----");
  info.log("globalX", viewport.globalX);
  info.log("globalY", viewport.globalY);
};

const drawCross = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.moveTo(window.innerWidth / 2, 0);
  ctx.lineTo(window.innerWidth / 2, window.innerHeight);
  ctx.moveTo(0, window.innerHeight / 2);
  ctx.lineTo(window.innerWidth, window.innerHeight / 2);
  ctx.stroke();
};

const drawNewGreed = (ctx) => {
  // Половина экрана по X и Y (середина экрана)
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  // Размер грида с учетом зума
  const adaptiveGreedSize = GREED.size * viewport.zoom;

  // старт отрисовки цикла
  const startX = -Math.round(halfWidth / adaptiveGreedSize);

  // отрисовка влево
  for (let i = 0; i < halfWidth / 2; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(halfWidth - adaptiveGreedSize * i, 0);
    ctx.lineTo(halfWidth - adaptiveGreedSize * i, window.innerHeight);
    ctx.stroke();
  }

  // отрисовка вправо
  for (let i = 0; i < halfWidth / 2; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(
      halfWidth + adaptiveGreedSize * i + (viewport.x % adaptiveGreedSize),
      0
    );
    ctx.lineTo(
      halfWidth + adaptiveGreedSize * i + (viewport.x % adaptiveGreedSize),
      window.innerHeight
    );
    ctx.stroke();
  }

  // отрисовка вверх
  for (let i = 0; i < halfHeight / 2; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(0, halfHeight - adaptiveGreedSize * i);
    ctx.lineTo(window.innerWidth, halfHeight - adaptiveGreedSize * i);
    ctx.stroke();
  }

  // отрисовка вниз
  for (let i = 0; i < halfHeight / 2; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = GREED.line;
    ctx.moveTo(0, halfHeight + adaptiveGreedSize * i);
    ctx.lineTo(window.innerWidth, halfHeight + adaptiveGreedSize * i);
    ctx.stroke();
  }
};

const draw = ({ ctx }) => {
  drawBackground(ctx);
  drawGreed(ctx);
  // drawNewGreed(ctx);
  drawCross(ctx);
  updateInfoUI();
};

const updateMousePosition = (dx, dy) => {
  if (!dx || !dy) return;

  viewport.x = dx;
  viewport.y = dy;
};

const _clearLocalStorage = () => {
  window.localStorage.removeItem("vpx");
  window.localStorage.removeItem("vpy");
};

const mouseMoveListener = (e) => {
  const dx = e.clientX - buffer.x;
  const dy = e.clientY - buffer.y;
  buffer.x = e.clientX;
  buffer.y = e.clientY;

  viewport.x += dx;
  viewport.y += dy;

  viewport.globalX = Math.round(mouse.x / GREED.size);
  viewport.globalY = Math.round(mouse.y / GREED.size);

  window.localStorage.vpx = viewport.globalX;
  window.localStorage.vpy = viewport.globalY;
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

    mouse.x = e.screenX;
    mouse.y = e.screenY;
  });
};

const init = () => {
  const canvas = document.querySelector(`#${ID_CANVAS}`);
  const core = new Core(canvas);

  viewport.globalX = parseInt(window.localStorage.vpx);
  viewport.globalY = parseInt(window.localStorage.vpy);

  viewport.x = viewport.globalX * GREED.size || 0;
  viewport.y = viewport.globalY * GREED.size || 0;

  core.addRender(draw);

  initListeners();

  initDraft(core);
};

window.onload = init;
