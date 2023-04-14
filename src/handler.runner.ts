import { HandlerService } from "./handler.service";
import {
  HandlerError,
  HandlerResponse,
  HandlerRunnerInterface,
  HandlerType,
  LambdaMiddlewareType,
} from "./types";

export class HandlerRunner
  implements HandlerRunnerInterface<HandlerResponse, HandlerError>
{
  private step: number;
  private current: LambdaMiddlewareType | null;

  constructor(
    private event: any,
    private context: any,
    private handlerRef: HandlerService
  ) {
    this.event = event;
    this.context = context;
    this.handlerRef = handlerRef;
    this.step = 0;
    this.current = null;
  }

  async run(): Promise<HandlerType> {
    try {
      for (const middleware of this.handlerRef.middlewares) {
        await this.runMiddleware(middleware);
      }
      return await this.runResponseHandler();
    } catch (error: any) {
      return await this.runErrorHandler(error);
    }
  }

  async runErrorHandler(error: Error): Promise<HandlerError> {
    if (this.handlerRef.errorHandler) {
      return this.handlerRef.errorHandler(error);
    }

    throw error;
  }

  async runMiddleware(middleware: LambdaMiddlewareType): Promise<HandlerType> {
    this.current = middleware;

    // this.dispatchEvent("middleware_out");

    await middleware(this.event, this.context);

    // this.dispatchEvent("middleware_out");

    this.step++;
  }

  async runResponseHandler(): Promise<HandlerType> {
    if (!this.handlerRef.responseHandler) {
      return;
    }

    const response = await this.handlerRef.responseHandler(
      this.event,
      this.context
    );

    this.dispatchEvent("response", { response: response || {} });

    return response;
  }

  dispatchEvent(type: string, data: any) {
    // dispatchEvent({
    //   type,
    //   data: {
    //     context: this.context,
    //     event: this.event,
    //     handler: this.handlerRef.constructor.name,
    //     middlewareName: this.current.middleware.name,
    //     step: this.step,
    //     ...data,
    //   },
    // });
  }
}
