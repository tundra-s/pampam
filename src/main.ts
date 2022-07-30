import { Core, RenderChallengerArgument } from "./lib/core";
import World from "./lib/world";
import Info from "./mock/info";

const info = new Info("Main");

// TODO переписать на World
const updateInfoUI = () => {
  // info.log("viewportX", viewport.x);
  // info.log("viewportY", viewport.y);
  // info.log("iii", "----");
  // info.log("zoom", viewport.zoom);
  // info.log("ii", "----");
  // info.log("globalX", viewport.globalX);
  // info.log("globalY", viewport.globalY);
};

const updateInfoUIWrapper = {
  render: ({ ctx }: RenderChallengerArgument) => {
    updateInfoUI();
  },
};

const _clearLocalStorage = () => {
  window.localStorage.removeItem("vpx");
  window.localStorage.removeItem("vpy");
};

// TODO: Переписать на World
//
// const initCoordMemo = () => {
//   viewport.globalX = parseInt(window.localStorage.vpx);
//   viewport.globalY = parseInt(window.localStorage.vpy);

//   viewport.x = viewport.globalX * GREED.size || 0;
//   viewport.y = viewport.globalY * GREED.size || 0;
// };

const init = () => {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  if (!canvas) return;
  const core = new Core(canvas);

  if (!core.isCreated()) return;

  const world = new World();

  core.addRender(world);
  core.addRender(updateInfoUIWrapper);

  // initCoordMemo();
};

window.onload = init;
