import { expect } from "chai";
import { Handler } from "../handler";

describe('Extends', ()=> {
  context('when extending a handler with 1 middleware', () => {
    const handler = Handler();

    const middleware = (event: any) => {
      event.middleware = true;
    };

    handler.use(middleware);
    const newHandler = Handler().extends(handler);
    const event: any = {};

    it('should run the middleware', async () => {
      await newHandler(event, {});
      expect(event.middleware).to.be.true;
    });
  });

  context('when extending a handler with responseHandler', () => {
    const handler = Handler();

    const middleware = (event: any) => {
      event.middleware = true;
    };

    const responseHandler = (event: any) => {
      console.log('responseHandler');
      event.response = true;
      return event;
    };

    handler.setResponseHandler(responseHandler)

    handler.use(middleware);
    const newHandler = Handler().extends(handler);
    const event: any = {};

    it('should run the responseMiddleware and returning the value', async () => {
      const result = await newHandler(event, {});
      expect(event.response).to.be.true;
      expect(result.response).to.be.true;
    });
  });

  context('when extending a handler with errorHandler', () => {
    const handler = Handler();

    const middleware = (event: any) => {
      throw new Error('error');
    };

    const errorHandler = (error: Error) => {
      return error;
    };

    handler.setErrorHandler(errorHandler);

    handler.use(middleware);
    const newHandler = Handler().extends(handler);
    const event: any = {};

    it('should run the errorHandler and returning the value', async () => {
      const result = await newHandler(event, {});
      expect(result).to.be.instanceOf(Error);
    });
  });
})