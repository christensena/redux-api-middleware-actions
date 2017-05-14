redux-api-middleware-actions
============================
_Action creators for [https://github.com/agraboso/redux-api-middleware](https://github.com/agraboso/redux-api-middleware) or the like._

This library is optimised for redux projects using TypeScript.

It is inspired heavily by [https://github.com/vgmr/redux-helper](https://github.com/vgmr/redux-helper).

# Installation

```bash
npm i redux-api-middleware-actions --save
```
or
```bash
yarn add redux-api-middleware-actions
```

# Usage

Assuming you have already set up your api middleware (in this example [https://github.com/agraboso/redux-api-middleware](https://github.com/agraboso/redux-api-middleware)

```ts
import { createApiAction } from 'redux-typed-async-actions';
import { CALL_API } from 'redux-api-middleware';

export const fetchClients = createApiAction<{}, IClientModel[]>('CLIENTS_FETCH', {
  CALL_API,
  method: 'GET',
  endpoint: `/api/clients`,
});
```

The `CALL_API` is the name of the signature property or symbol used for your API middleware.

```ts
export const createClient = createApiAction<IClientModel, {}>('CLIENT_CREATE', {
  CALL_API,
  method: 'POST',
  endpoint: `/api/clients`,
});
```

The two generic parameters are the *payload* and the *response* types.

The *payload* is the parameter passed to the function e.g.

```ts
dispatch(createClient({
  name: 'Bob the Builder',
}));
```

You can also pass a function instead of an object as the second parameter.
This function can take the payload as an argument.

```ts
export const fetchClients = createApiAction<{ name: string }, IClientModel[]>('FETCH_CLIENTS', ({name}) => ({
  CALL_API,
  method: 'POST',
  endpoint: `/api/clients?name=${name}`,
});
```
