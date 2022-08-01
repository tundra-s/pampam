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
      resolve(new RenderChunk({ x, y }));
    }, 1000 + Math.random() * 2000);
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

  // TEST
  // const SEED_X = 10;
  // const SEED_Y = 5;
  // const DENCITY = 1;

  // for (let i = 0; i < SEED_X; i += 1) {
  //   for (let j = 0; j < SEED_Y; j += 1) {
  //     if (DENCITY > Math.random()) {
  //       const testEntyty = new RenderChunk({
  //         x: i - SEED_X / 2,
  //         y: j - SEED_Y / 2,
  //       });

  //       world.addToScene(testEntyty);
  //     }
  //   }
  // }

  // TEST
  world.requestChunk(({ x, y }) => {
    requestDB({ x: 5, y: 5 }).then((result) => {
      console.log("add");
      world.addToScene(result);
    });
  });
};

window.onload = init;
