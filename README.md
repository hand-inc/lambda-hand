# Lambda-Hand

## How to install:

```bash
npm i -S lambda-hand
```

## How to use:

```javascript
import { Handler } from 'lambda-hand';
const middleware1 = (event: any, context:any) => {};
const middleware2 = (event: any, context:any) => {};
const middleware3 = (event: any, context:any) => {};

export const AuthorizationHandler = Handler()
  .use(middleware1)
  .use(middleware2)
  .use(middleware3)
  // .use(() => {throw new Error()})
  .setResponseHandler((event, context) => console.log(event, context))
  .setErrorHandler((error) => console.log(error));

```

or just:

```javascript
import { Handler } from 'lambda-hand';
const middleware1 = (event: any, context:any) => {};
const middleware2 = (event: any, context:any) => {};
const middleware3 = (event: any, context:any) => {};

export const AuthorizationHandler = Handler()
  .use(middleware1, middleware2, middleware3)
  // .use(() => {throw new Error()})
  .setResponseHandler((event, context) => console.log(event, context))
  .setErrorHandler((error) => console.log(error));
```
The handler will return a function with the type:
```javascript
 (event: any, context:any) => any
```
### How to extend a Handler:
```javascript
export const UserHandler = Handler().extends(AuthorizationHandler);
```


### How to use with serverless:

```yml
...serverless.yml


functions:
  foo:
    handler: ./handler # here the path of your Handler
    events:
      - http:
          path: /path
          method: get

```


## Methods

|  Method |  Description |
|---|---|
| **use**  |  Used to add a Middleware or a Middleware List to Handler |
| **setResponseHandler**  |  Used to set up Response Handler |
| **setErrorHandler**  |  Used to set up Error Handler |
| **extends**   | Used to reutilize the **Middleware List**,  <br/> **ResponseHandler**, and **ErrorHandler** from other Handler |