import { EventEmitter } from "events";
import { HandlerEventCallback, HandlerEventTypes } from "./types";

export class HandlerEventsEmitter extends EventEmitter {
  dispatchEvent(event: HandlerEventTypes, data: any) {
    this.emit(event, data);
  }

  on(event: HandlerEventTypes, callback: HandlerEventCallback) {
    super.on(event, (data) => (callback ? callback(data) : null));
    return this;
  }
}
