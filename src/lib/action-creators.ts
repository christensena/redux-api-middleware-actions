// rather than depend on external lib for just this...
export interface ReduxAction {
  type: any;
}

export interface ErrorAction extends ReduxAction {
  payload: any;
  error: boolean;
}

export interface Action<TPayload> extends ReduxAction {
  payload: TPayload;
}

export interface CreateAction<TPayload> extends Action<TPayload> {
  (payload?: TPayload): Action<TPayload>;
  matches(action: ReduxAction): action is Action<TPayload>;
  type: string;
}

export const createAction = <TPayload>(type: string): CreateAction<TPayload> => {
  let creator: any = <TPayload>(payload?: TPayload) => ({ type, payload });
  creator.matches = <TPayload>(action: ReduxAction): action is Action<TPayload> => action.type === type;
  creator.type = type;
  return <CreateAction<TPayload>>creator;
};

export type HttpMethod = 'GET' | 'HEAD' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface ICallApiOptions {
  endpoint: string;
  method: HttpMethod;
  types: string[];
  body?: any;
  credentials?: 'omit' | 'same-origin' | 'include';
  headers?: {
    [propName: string]: string;
  };
}

export interface ApiAction<TPayload, TResponse> {
  [propName: string]: ICallApiOptions;
}

export interface IApiActionOptions {
  CALL_API: any;
  endpoint: string;
  method: HttpMethod;
  credentials?: 'omit' | 'same-origin' | 'include';
  headers?: {
    [propName: string]: string;
  };
}

export interface CreateApiAsyncAction<TPayload, TResponse> {
  (payload?: TPayload): ApiAction<TPayload, TResponse>;
  matches(action: Action<any>): action is Action<any>;
  matchesPending(action: Action<TPayload>): action is Action<TPayload>;
  matchesSuccess(action: Action<TResponse>): action is Action<TResponse>;
  matchesFailure(action: Action<any>): action is ErrorAction;
  type: string;
}

export type CreateApiActionOptions<TPayload> =
  IApiActionOptions |
  ((payload: TPayload) => IApiActionOptions);

export const createApiAction =
  <TPayload, TResponse>(type: string, options: CreateApiActionOptions<TPayload>): CreateApiAsyncAction<TPayload, TResponse> => {
    const pendingType = `${type}_PENDING`;
    const successType = `${type}_SUCCESS`;
    const failureType = `${type}_FAILURE`;

    let creator: any = (payload: TPayload): ApiAction<TPayload, TResponse> => {
      const { CALL_API, method, endpoint, credentials, headers }
        = typeof (options) === 'function' ? options(payload) : options;
      return {
        [CALL_API]: {
          endpoint,
          method,
          types: [pendingType, successType, failureType],
          body: method === 'POST' || method === 'PUT' ? payload : undefined,
          credentials,
          headers,
        },
      }
    };
    creator.type = type;
    creator.matches = (action: Action<any>): action is Action<any> =>
      action.type === pendingType || action.type === successType || action.type === failureType;
    creator.matchesPending =
      (action: Action<TPayload>): action is Action<TPayload> => action.type === pendingType;
    creator.matchesSuccess =
      (action: Action<TResponse>): action is Action<TResponse> => action.type === successType;
    creator.matchesFailure =
      (action: Action<any>): action is ErrorAction => action.type === failureType;
    return <CreateApiAsyncAction<TPayload, TResponse>>creator;
  };
