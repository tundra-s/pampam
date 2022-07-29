import { getRandom } from "./rand";

function component() {
  const element = document.createElement("div");

  element.innerHTML = `TypeScript ${getRandom()}`;

  return element;
}

document.body.appendChild(component());
