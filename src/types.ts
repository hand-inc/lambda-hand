export type LambdaMiddlewareType = <T>(event: any, context: any) => Promise<T>;
export type ErrorMiddlewareType = <T>(error: Error) => T;
export type ResponseMiddlewareType = LambdaMiddlewareType;

export interface HandlerBuilderInterface extends LambdaMiddlewareType {
  use: (...middleware: LambdaMiddlewareType[]) => HandlerBuilderInterface;
  extends: (handlerService: HandlerBuilderInterface) => HandlerBuilderInterface;
  setErrorHandler: (errorHandler: ErrorMiddlewareType) => HandlerBuilderInterface;
  setResponseHandler: (responseHandler: ResponseMiddlewareType) => HandlerBuilderInterface;
  getMiddlewares: () => LambdaMiddlewareType[];
  getErrorHandler: () => ErrorMiddlewareType | null;
  getResponseHandler: () => ResponseMiddlewareType | null;
}

export interface HandlerRunnerInterface<T, Q> {
  runResponseHandler: () => Promise<T>;
  runErrorHandler: (error: Error) => Promise<Q>;
}

export type HandlerError = any;
export type HandlerResponse = any;
export type HandlerType = HandlerError | HandlerResponse;
