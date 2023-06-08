import { EventEmitter } from "events";
import { HandlerEventCallback, HandlerEventData, HandlerEventTypes } from "./types";

export class HandlerEventsEmitter extends EventEmitter {
  dispatchEvent(event: HandlerEventTypes, data: HandlerEventData) {
    this.emit(event, data);
  }

  on(event: HandlerEventTypes, callback: HandlerEventCallback) {
    super.on(event, (data: HandlerEventData) => (callback ? callback(data) : null));
    return this;
  }
}
