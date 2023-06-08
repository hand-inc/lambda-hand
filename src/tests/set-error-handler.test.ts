import { expect } from "chai";
import { Handler } from "../handler";

describe('Set Error Handler', ()=> {
  context('when setting the error handler', () => {
    const handler = Handler();

    const middleware = (event: any) => {
      throw new Error('error');
    };

    const errorHandler = (event: any) => {
      event.error = true;
      return event;
    };

    handler.use(middleware);
    handler.setErrorHandler(errorHandler);
    const event: any = {};

    it('should run the error middleware and returning the its value', async () => {
      const result: any = await handler(event, {});
      expect(result.error).to.be.true;
    });
  });

  context('when setting the error handler without error', () => {
    const handler = Handler();

    const middleware = (event: any) => {
      event.middleware = true;
    };

    const errorHandler = (event: any) => {
      event.error = true;
      return event;
    };

    handler.use(middleware);
    handler.setErrorHandler(errorHandler);
    const event: any = {};

    it('should not run the error middleware', async () => {
      const result: any = await handler(event, {});
      expect(result).to.be.undefined;
    });
  });
})