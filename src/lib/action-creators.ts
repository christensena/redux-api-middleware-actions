// rather than depend on external lib for just this...
export interface ReduxAction {
  type: string;
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
}

export const createAction = <TPayload>(type: string): CreateAction<TPayload> => {
  let creator: any = <TPayload>(payload?: TPayload) => ({ type, payload });
  creator.matches = <TPayload>(action: ReduxAction): action is Action<TPayload> => action.type === type;
  return <CreateAction<TPayload>>creator;
};

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';

export interface ApiAction<TPayload, TResponse> {
  [propName: string]: {
    endpoint: string;
    method: string;
    types: string[];
    body?: any;
    headers?: any;
  } | string,
}

export interface IApiActionOptions {
  CALL_API: any;
  method: HttpMethod;
  endpoint: string;
}

export interface CreateApiAsyncAction<TPayload, TResponse> {
  (payload?: TPayload): ApiAction<TPayload, TResponse>;
  matches(action: any): action is ApiAction<TPayload, TResponse>;
  matchesPending(action: Action<TPayload>): action is Action<TPayload>;
  matchesSuccessResponse(action: Action<TResponse>): action is Action<TResponse>;
  matchesFailureResponse(action: ErrorAction): action is ErrorAction;
}

export const createApiAction =
  <TPayload, TResponse>(type: string, options: ((payload: TPayload) => IApiActionOptions) | IApiActionOptions): CreateApiAsyncAction<TPayload, TResponse> => {
    const pendingType = `${type}_PENDING`;
    const successType = `${type}_SUCCESS`;
    const failureType = `${type}_FAILURE`;

    let creator: any = (payload: TPayload): ApiAction<TPayload, TResponse> => {
      const { CALL_API, method, endpoint } = typeof (options) === 'function' ? options(payload) : options;
      return {
        [CALL_API]: {
          endpoint,
          method,
          types: [pendingType, successType, failureType],
          body: method === 'POST' || method === 'PUT' ? payload : undefined,
        },
      }
    };
    creator.matchesPending =
      (action: Action<TPayload>): action is Action<TPayload> => action.type === pendingType;
    creator.matchesSuccessResponse =
      (action: Action<TResponse>): action is Action<TResponse> => action.type === successType;
    creator.matchesFailureResponse =
      (action: ErrorAction): action is ErrorAction => action.type === failureType;
    return <CreateApiAsyncAction<TPayload, TResponse>>creator;
  };
