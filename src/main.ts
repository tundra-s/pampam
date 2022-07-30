import { Core, RenderChallengerArgument } from "./lib/core";
import { RenderEntity } from "./lib/renderEntity";
import World, { Vector } from "./lib/world";
import Info from "./mock/info";

const info = new Info("Main");

// TODO переписать на World
const updateInfoUI = (world: World) => {
  const worldValues = world.getViewportValues();

  info.log("viewportX", worldValues.localCoords.x);
  info.log("viewportY", worldValues.localCoords.y);
  info.log("iii", "----");
  info.log("zoom", worldValues.zoom);
  info.log("ii", "----");
  info.log("globalX", worldValues.globalCoords.x);
  info.log("globalY", worldValues.globalCoords.y);
};

const updateInfoUIWrapper = (world: World) => {
  return {
    render: ({ ctx }: RenderChallengerArgument) => {
      updateInfoUI(world);
    },
  };
};

const _clearLocalStorage = () => {
  window.localStorage.removeItem("vpx");
  window.localStorage.removeItem("vpy");
};

const initCoordMemo = (): Vector => {
  return {
    x: parseInt(window.localStorage.vpx) || 0,
    y: parseInt(window.localStorage.vpy) || 0,
  };
};

const init = () => {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  if (!canvas) return;
  const core = new Core(canvas);

  if (!core.isCreated()) return;
  const viewportPosition = initCoordMemo();

  const world = new World(viewportPosition);

  const testEntyty = new RenderEntity();

  core.addRender(world);
  core.addRender(updateInfoUIWrapper(world));

  world.addToScene(testEntyty);

  // initCoordMemo();
};

window.onload = init;
