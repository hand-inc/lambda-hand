import { HandlerBuilder } from "./handler.builder";
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

  constructor() {
    this.middlewares = [];
    this.responseHandler = null;
    this.errorHandler = null;
  }

  extends(handler: HandlerBuilderInterface): HandlerService {
    this.middlewares = [...handler.getMiddlewares(), ...this.middlewares];

    if (handler.getErrorHandler()) {
      this.setErrorHandler(handler.getErrorHandler());
    }

    if (handler.getResponseHandler()) {
      this.setResponseHandler(handler.getResponseHandler());
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
