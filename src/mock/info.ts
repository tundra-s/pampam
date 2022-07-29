type InfoName = string;
type InfoValue = string | number | boolean;

interface Queue {
  [key: InfoName]: InfoValue;
}

class Info {
  queue: Queue;
  wrapper: HTMLDivElement;

  constructor() {
    this.queue = {};

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("info");

    document.body.append(this.wrapper);
  }

  refresh() {
    this.wrapper.innerHTML = "";

    for (let key in this.queue) {
      const line = document.createElement("div");
      line.classList.add("info__line");
      line.innerText = `${key} : ${this.queue[key]}`;
      this.wrapper.append(line);
    }
  }

  log(name: InfoName, value: InfoValue): void {
    this.refresh();
    this.queue[name] = value;
  }
}

export default Info;
