import { Core, RenderChallengerArgument } from "./lib/core";
import { RenderChunk } from "./lib/renderChunk";
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

const requestDB = ({ x, y }: Vector) =>
  new Promise<RenderChunk>((resolve, reject) => {
    console.log(`Request server [${x}; ${y}]`);

    setTimeout(() => {
      console.log(`Response server [${x}; ${y}]`);
      resolve(new RenderChunk({ x, y }, "loaded"));
    }, Math.random() * 1000);
  });

const init = () => {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  if (!canvas) return;
  const core = new Core(canvas);

  if (!core.isCreated()) return;
  const viewportPosition = initCoordMemo();

  const world = new World(viewportPosition);

  core.addRender(world);
  core.addRender(updateInfoUIWrapper(world));

  //TODO delete test
  world.requestChunk(({ x, y }) => {
    requestDB({ x, y }).then((result) => {
      world.addToScene(result);
    });
  });
};

window.onload = init;
