export type LambdaMiddlewareType = <T>(event: any, context: any) => Promise<T>;
export type ErrorMiddlewareType = <T>(error: Error) => T;
export type ResponseMiddlewareType = LambdaMiddlewareType;

export interface HandlerBuilderInterface extends LambdaMiddlewareType {
  use: any;
  extends: any;
  setErrorHandler: any;
  setResponseHandler: any;
  getMiddlewares: any;
  getErrorHandler: any;
  getResponseHandler: any;
}

export interface HandlerRunnerInterface<T, Q> {
  runResponseHandler: () => Promise<T>;
  runErrorHandler: (error: Error) => Promise<Q>;
}

export type HandlerError = any;
export type HandlerResponse = any;
export type HandlerType = HandlerError | HandlerResponse;
