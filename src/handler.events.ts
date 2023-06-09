import { EventEmitter } from "events";
import {
  HandlerEventCallback,
  HandlerEventData,
  HandlerEventTypes,
} from "./types";

export class HandlerEventsEmitter extends EventEmitter {
  dispatchEvent(event: HandlerEventTypes, data: HandlerEventData): void {
    if (this.listenerCount(event) == 0) {
      return;
    }
    this.emit(event, data);
  }

  on(event: HandlerEventTypes, callback: HandlerEventCallback): this {
    super.on(event, (data: HandlerEventData) =>
      callback ? callback(data) : null
    );
    return this;
  }
}
