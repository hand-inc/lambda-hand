import { randomUUID } from "crypto";
import { HandlerService } from "./handler.service";
import {
  HandlerError,
  HandlerEventData,
  HandlerEventTypes,
  HandlerResponse,
  HandlerRunnerInterface,
  HandlerType,
  LambdaMiddlewareType,
} from "./types";
import { Benchmark } from "./handler.utils";
export class HandlerRunner
  implements HandlerRunnerInterface<HandlerResponse, HandlerError>
{
  private step: number;
  private current: LambdaMiddlewareType | null;
  private executionId: string | null;
  private benchmark: Benchmark | null;

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
    this.executionId = null;
    this.benchmark = null;
  }

  async run(): Promise<HandlerType> {
    this.executionId = randomUUID();

    this.benchmark = new Benchmark();

    this.dispatchEvent("hand:start");

    try {
      for (const middleware of this.handlerRef.middlewares) {
        await this.runMiddleware(middleware);
      }
      return await this.runResponseHandler();
    } catch (error: any) {
      return await this.runErrorHandler(error);
    } finally {
      this.dispatchEvent("hand:end");
    }
  }

  async runErrorHandler(error: any): Promise<HandlerError> {
    if (!this.handlerRef.errorHandler) {
      this.dispatchEvent("hand:error", { error });
      throw error;
    }

    this.current = this.handlerRef.errorHandler;

    const errorResponse = this.handlerRef.errorHandler(error, this.context);

    this.dispatchEvent("hand:error", {
      error_handler_out: errorResponse,
      error,
    });

    return errorResponse;
  }

  async runMiddleware(middleware: LambdaMiddlewareType): Promise<HandlerType> {
    this.current = middleware;

    this.dispatchEvent("hand:middleware:before");

    await middleware(this.event, this.context);

    this.dispatchEvent("hand:middleware:after");
    this.step++;
  }

  async runResponseHandler(): Promise<HandlerType> {
    if (!this.handlerRef.responseHandler) {
      return;
    }

    this.dispatchEvent("hand:response:before");

    const response = await this.handlerRef.responseHandler(
      this.event,
      this.context
    );

    this.dispatchEvent("hand:response:after", {
      response_handler_out: response || {},
    });

    return response;
  }

  dispatchEvent(type: HandlerEventTypes, additionalInfo?: any): void {
    const eventObject: HandlerEventData = {
      type,
      data: {
        time: new Date(),
        context: this.context,
        event: this.event,
        middleware_name: this?.current?.name || "anonymous",
        execution_id: this.executionId,
        step: this.step,
        additional_info: additionalInfo || null,
      },
    };

    const duration = this?.benchmark?.run(type);
    if (duration) {
      eventObject.data = {
        ...eventObject.data,
        duration_ms: duration,
      };
    }

    this.handlerRef.eventsEmitter.dispatchEvent(type, eventObject);
  }
}
