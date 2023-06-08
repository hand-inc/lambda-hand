import { HandlerBuilder } from "./handler.builder";
import { HandlerEventsEmitter } from "./handler.events";
import {
  ErrorMiddlewareType,
  HandlerBuilderInterface,
  LambdaMiddlewareType,
  ResponseMiddlewareType,
} from "./types";

export class HandlerService {
  public middlewares: LambdaMiddlewareType[];
  public errorHandler: ErrorMiddlewareType | null;
  public responseHandler: ResponseMiddlewareType | null;
  public eventsEmitter: HandlerEventsEmitter;

  constructor() {
    this.middlewares = [];
    this.responseHandler = null;
    this.errorHandler = null;
    this.eventsEmitter = new HandlerEventsEmitter();
  }

  extends(handler: HandlerBuilderInterface): HandlerService {
    this.middlewares = [...handler.getMiddlewares(), ...this.middlewares];

    const errorHandler = handler.getErrorHandler();
    if (errorHandler) {
      this.setErrorHandler(errorHandler);
    }

    const responseHandler = handler.getResponseHandler();
    if (responseHandler) {
      this.setResponseHandler(responseHandler);
    }

    return this;
  }

  use(...data: LambdaMiddlewareType[]): HandlerService {
    this.middlewares = [...this.middlewares, ...data];
    return this;
  }

  setErrorHandler(errorHandler: ErrorMiddlewareType): HandlerService {
    this.errorHandler = errorHandler;
    return this;
  }

  setResponseHandler(responseHandler: ResponseMiddlewareType): HandlerService {
    this.responseHandler = responseHandler;
    return this;
  }

  build(): HandlerBuilderInterface {
    return HandlerBuilder(this);
  }
}
