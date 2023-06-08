import { HandlerEventTypes } from "./types";

const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]);
};

export class Benchmark {
  private elementsBenchmark: { [index: string]: any };

  constructor() {
    this.elementsBenchmark = {};
  }

  run(event: HandlerEventTypes) {
    const index = event.replace(/:end|:start|:before|:after/g, "");

    if (this.elementsBenchmark[index]) {
      const duration = this.elementsBenchmark[index]();
      delete this.elementsBenchmark[index];
      return duration;
    }
    const benchmark = (start: [number, number]) => () =>
    getDurationInMilliseconds(start);
    this.elementsBenchmark[index] = benchmark(process.hrtime());
    return null;
  }
}
