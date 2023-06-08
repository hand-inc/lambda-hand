export type LambdaMiddlewareType = <T>(
  event: any,
  context?: any
) => Promise<T | void> | void | T;
export type ErrorMiddlewareType = <T>(error: Error | any) => T | Promise<T>;
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
  | "middleware_out"
  | "middleware_in"
  | "response_in"
  | "response_out"
  | "start"
  | "end"
  | "error";

export type HandlerError = any;
export type HandlerResponse = any;
export type HandlerType = HandlerError | HandlerResponse;
