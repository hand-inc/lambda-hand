import { expect } from "chai";
import { Handler } from "../handler";

describe('Set Response Handler', ()=> {
  context('when setting the response handler', () => {
    const handler = Handler();

    const middleware = async (event: any) => {
      event.middleware = true;
    };

    const responseHandler = (event: any) => {
      event.response = true;
      return event;
    };

    handler.use(middleware);
    handler.setResponseHandler(responseHandler);
    const event: any = {};

    it('should run the response middleware and returning the its value', async () => {
      const result: any = await handler(event, {});
      expect(result.middleware).to.be.true;
      expect(result.response).to.be.true;
    });
  });
})