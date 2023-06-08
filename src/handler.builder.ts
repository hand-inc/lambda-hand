import { HandlerRunner } from "./handler.runner";
import { HandlerService } from "./handler.service";
import {
  ErrorMiddlewareType,
  HandlerBuilderInterface,
  HandlerEventCallback,
  HandlerEventTypes,
  LambdaMiddlewareType,
  ResponseMiddlewareType,
} from "./types";

export const HandlerBuilder = (
  HandlerServiceRef: HandlerService
): HandlerBuilderInterface => {
  const handler = async (event: any, context: any) => {
    const runner = new HandlerRunner(event, context, HandlerServiceRef);
    return await runner.run();
  };

  handler.on = (
    eventName: HandlerEventTypes,
    callback: HandlerEventCallback
  ) => {
    HandlerServiceRef.eventsEmitter.on(eventName, callback);
    return handler;
  };

  handler.getMiddlewares = (): LambdaMiddlewareType[] =>
    HandlerServiceRef.middlewares;
  handler.getErrorHandler = (): ErrorMiddlewareType | null =>
    HandlerServiceRef.errorHandler;
  handler.getResponseHandler = (): ResponseMiddlewareType | null =>
    HandlerServiceRef.responseHandler;

  handler.use = (...data: LambdaMiddlewareType[]): HandlerBuilderInterface => {
    HandlerServiceRef.use(...data);
    return handler;
  };

  handler.extends = (
    handlerService: HandlerBuilderInterface
  ): HandlerBuilderInterface => {
    HandlerServiceRef.extends(handlerService);
    return handler;
  };

  handler.setErrorHandler = (
    errorHandler: ErrorMiddlewareType
  ): HandlerBuilderInterface => {
    HandlerServiceRef.setErrorHandler(errorHandler);
    return handler;
  };

  handler.setResponseHandler = (
    responseHandler: ResponseMiddlewareType
  ): HandlerBuilderInterface => {
    HandlerServiceRef.setResponseHandler(responseHandler);
    return handler;
  };

  return handler;
};
