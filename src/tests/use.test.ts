import { expect } from "chai";
import sinon from "sinon";
import { Handler } from "../handler";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Use', ()=> {
  context('when using the "use" with a middleware', () => {
    const handler = Handler();
    const middleware = sinon.spy()
    handler.use(middleware);

    it('should run the middleware', () => {
      handler({}, {});
      expect(middleware.calledOnce).to.be.true;
    });
  });

  context('when using the "use" with 3 middlewares', () => {
    const handler = Handler();
    const event: any = {};
    const middleware = async (event: any) => {event.middleware1 = true;};
    const middleware2 = async (event: any) => {event.middleware2 = true;};
    const middleware3 = async (event: any) => {event.middleware3 = true;};
    handler.use(middleware, middleware2, middleware3);

    it('should run the middlewares', async () => {
      await handler(event, {});
      expect(event.middleware1).to.be.true;
      expect(event.middleware2).to.be.true;
      expect(event.middleware3).to.be.true;
    });
  });

  context('when using the multiple "use"s', () => {
    const handler = Handler();
    const event: any = {};
    const middleware = async (event: any) => {event.middleware1 = true;};
    const middleware2 = async (event: any) => {event.middleware2 = true;};
    const middleware3 = async (event: any) => {event.middleware3 = true;};
    handler.use(middleware).use(middleware2).use(middleware3);

    it('should run the middlewares', async () => {
      await handler(event, {});
      expect(event.middleware1).to.be.true;
      expect(event.middleware2).to.be.true;
      expect(event.middleware3).to.be.true;
    });
  });

  context('when using the multiple "use"s with timers', () => {
    const handler = Handler();
    const event: any = {};

    const middleware = async (event: any) => {
      await sleep(200);
      event.middleware1 = new Date();
    };

    const middleware2 = async (event: any) => {
      await sleep(200);
      event.middleware2 = new Date();
    };

    const middleware3 = async (event: any) => {
      await sleep(200);
      event.middleware3 = new Date();
    };

    handler.use(middleware).use(middleware2).use(middleware3);
    
    it('they should be runned in order', async () => {
      await handler(event, {});
      expect(Number(event.middleware3)).to.be.greaterThan(Number(event.middleware2));
      expect(Number(event.middleware2)).to.be.greaterThan(Number(event.middleware1));
    });
  });
})