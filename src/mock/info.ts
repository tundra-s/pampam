type InfoName = string;
type InfoValue = string | number | boolean;

interface Queue {
  [key: InfoName]: InfoValue;
}

class Info {
  queue: Queue;
  wrapper: HTMLDivElement;

  constructor(name?: string) {
    this.queue = {};

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("info");

    document.body.append(this.wrapper);
  }

  refreshAll() {
    for (let key in this.queue) {
      this.refresh(key, this.queue[key]);
    }
  }

  refresh(key: string, value: InfoValue) {
    let line = document.querySelector<HTMLDivElement>(`#${key}`);

    if (!line) {
      line = document.createElement("div");
      line.id = `${key}`;
      line.classList.add("info__line");
      this.wrapper.append(line);
    }

    line.innerHTML = `<span>${key}</span> : <span>${value}</span>`;
  }

  log(name: InfoName, value: InfoValue): void {
    if (this.queue[name] === value) return;

    this.queue[name] = value;
    this.refresh(name, value);
  }
}

export default Info;
