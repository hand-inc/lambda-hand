export type LambdaMiddlewareType = <T>(
  event: any,
  context?: any
) => Promise<T | void> | void | T;
export type ErrorMiddlewareType = <T>(
  error: Error | any,
  context?: any
) => T | Promise<T>;

export type ResponseMiddlewareType = LambdaMiddlewareType;

export interface HandlerBuilderInterface extends LambdaMiddlewareType {
  use: (...middleware: LambdaMiddlewareType[]) => HandlerBuilderInterface;
  extends: (handlerService: HandlerBuilderInterface) => HandlerBuilderInterface;
  setErrorHandler: (
    errorHandler: ErrorMiddlewareType
  ) => HandlerBuilderInterface;
  setResponseHandler: (
    responseHandler: ResponseMiddlewareType
  ) => HandlerBuilderInterface;
  getMiddlewares: () => LambdaMiddlewareType[];
  getErrorHandler: () => ErrorMiddlewareType | null;
  getResponseHandler: () => ResponseMiddlewareType | null;
  on: (
    event: HandlerEventTypes,
    callback: HandlerEventCallback
  ) => HandlerBuilderInterface;
}
export interface HandlerRunnerInterface<T, Q> {
  runResponseHandler: () => Promise<T>;
  runErrorHandler: (error: Error) => Promise<Q>;
}

export type HandlerEventCallback = (...args: any[]) => void;
export type HandlerEventTypes =
  | "hand:middleware:before"
  | "hand:middleware:after"
  | "hand:response:before"
  | "hand:response:after"
  | "hand:start"
  | "hand:end"
  | "hand:error";

export interface HandlerEventData {
  type: HandlerEventTypes;
  data: {
    time: Date;
    context: any;
    event: any;
    middleware_name: string;
    execution_id: string | null;
    step: number;
    additional_info: any;
    duration_ms?: number | null;
  };
}
export type HandlerError = any;
export type HandlerResponse = any;
export type HandlerType = HandlerError | HandlerResponse;
