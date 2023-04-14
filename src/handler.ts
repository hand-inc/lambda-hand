import { HandlerService } from "./handler.service";
import { HandlerBuilderInterface } from "./types";

export const Handler = (): HandlerBuilderInterface => {
  const service = new HandlerService();
  return service.build();
};
