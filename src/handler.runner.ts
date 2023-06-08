import { randomUUID } from "crypto";
import { HandlerService } from "./handler.service";
import {
  HandlerError,
  HandlerEventTypes,
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
  private executionId: string;

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
    this.executionId = "";
  }

  async run(): Promise<HandlerType> {
    this.executionId = randomUUID();
    this.dispatchEvent("start");
    try {
      for (const middleware of this.handlerRef.middlewares) {
        await this.runMiddleware(middleware);
      }
      return await this.runResponseHandler();
    } catch (error: any) {
      return await this.runErrorHandler(error);
    } finally {
      this.dispatchEvent("end");
    }
  }

  async runErrorHandler(error: Error): Promise<HandlerError> {
    if (!this.handlerRef.errorHandler) {
      this.dispatchEvent("error", { error });
      throw error;
    }

    this.current = this.handlerRef.errorHandler;

    const errorResponse = this.handlerRef.errorHandler(error);

    this.dispatchEvent("error", {
      error_handler_out: errorResponse,
      error,
    });

    return errorResponse;
  }

  async runMiddleware(middleware: LambdaMiddlewareType): Promise<HandlerType> {
    this.current = middleware;

    this.dispatchEvent("middleware_in");

    await middleware(this.event, this.context);

    this.dispatchEvent("middleware_out");

    this.step++;
  }

  async runResponseHandler(): Promise<HandlerType> {
    this.dispatchEvent("response_in");

    if (!this.handlerRef.responseHandler) {
      return;
    }

    const response = await this.handlerRef.responseHandler(
      this.event,
      this.context
    );

    this.dispatchEvent("response_out", {
      response_handler_out: response || {},
    });

    return response;
  }

  dispatchEvent(type: HandlerEventTypes, data?: any): void {
    const eventObject = {
      type,
      data: {
        time: new Date(),
        context: this.context,
        event: this.event,
        middleware_name: this?.current?.name || "anonymous",
        execution_id: this.executionId,
        step: this.step,
        additional_info: data,
      },
    };

    this.handlerRef.eventsEmitter.dispatchEvent(type, eventObject);
  }
}
