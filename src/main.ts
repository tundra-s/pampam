import { GREED, WORLD } from "./data/config";
import { Core, RenderChallengerArgument } from "./lib/core";
import World from "./lib/world";
import Info from "./mock/info";

const info = new Info("Main");

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

const updateInfoUI = () => {
  info.log("viewportX", viewport.x);
  info.log("viewportY", viewport.y);
  info.log("iii", "----");
  info.log("zoom", viewport.zoom);
  info.log("ii", "----");
  info.log("globalX", viewport.globalX);
  info.log("globalY", viewport.globalY);
};

const drawCross = ({ ctx }: RenderChallengerArgument) => {
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0, 255, 0)";
  ctx.moveTo(window.innerWidth / 2, 0);
  ctx.lineTo(window.innerWidth / 2, window.innerHeight);
  ctx.moveTo(0, window.innerHeight / 2);
  ctx.lineTo(window.innerWidth, window.innerHeight / 2);
  ctx.stroke();
};

const draw = ({ ctx }: RenderChallengerArgument) => {
  drawCross({ ctx });
  updateInfoUI();
};

const updateMousePosition = (dx: number, dy: number) => {
  if (!dx || !dy) return;

  viewport.x = dx;
  viewport.y = dy;
};

const _clearLocalStorage = () => {
  window.localStorage.removeItem("vpx");
  window.localStorage.removeItem("vpy");
};

const mouseMoveListener = (e: MouseEvent) => {
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
    const delta = e.deltaY * WORLD.zoom.zoomSpeed * viewport.zoom;

    if (delta + viewport.zoom > WORLD.zoom.max) {
      return (viewport.zoom = WORLD.zoom.max);
    }

    if (delta + viewport.zoom < WORLD.zoom.min) {
      return (viewport.zoom = WORLD.zoom.min);
    }

    viewport.zoom += delta;
  });
};

const initCoordMemo = () => {
  viewport.globalX = parseInt(window.localStorage.vpx);
  viewport.globalY = parseInt(window.localStorage.vpy);

  viewport.x = viewport.globalX * GREED.size || 0;
  viewport.y = viewport.globalY * GREED.size || 0;
};

const init = () => {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  if (!canvas) return;
  const core = new Core(canvas);

  if (!core.isCreated()) return;

  const world = new World();

  core.addRender(world);

  initCoordMemo();
  initListeners();
};

window.onload = init;
