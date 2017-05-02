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
  creator.matchAction = <TPayload>(action: ReduxAction): action is Action<TPayload> => action.type === type;
  return <CreateAction<TPayload>>creator;
};

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS';

export interface IApiParamsWithMethod {
  method: HttpMethod;
}


// TODO could break this down by method and hence exclude body from GET and DELETE
// TODO flesh out header typing and add it to ApiAction
export interface ApiAction<TPayload, TResponse> extends ReduxAction {
  'CALL_API': {
    endpoint: string;
    method: HttpMethod;
    types: string[];
    body?: any;
    headers?: any;
  },
}

export interface CreateApiAsyncAction<HttpMethod, TBody, TResponse> {
  (method: HttpMethod, payload?: TBody): ApiAction<TBody, TResponse>;
  matches(action: ReduxAction): action is ApiAction<TBody, TResponse>;
  matchesSuccessResponse(action: Action<TResponse>): action is Action<TResponse>;
  matchesFailureResponse(action: ErrorAction): action is ErrorAction;
}

export const createApiAction =
  <TBody, TResponse>(type: string, url: string): CreateApiAsyncAction<HttpMethod, TBody, TResponse> => {
    const successType = `${type}_SUCCESS`;
    const failureType = `${type}_FAILURE`;
    let creator: any = (method: HttpMethod, body: TBody): ApiAction<TBody, TResponse> => ({
      type,
      'CALL_API': {
        endpoint: url,
        method: method,
        types: [type, successType, failureType],
        body,
      },
    });
    creator.matches =
      <TResponse>(action: ReduxAction): action is ApiAction<TBody, TResponse> => action.type === type;
    creator.matchesSuccessResponse =
      (action: Action<TResponse>): action is Action<TResponse> => action.type === successType;
    creator.matchesFailureResponse =
      (action: ErrorAction): action is ErrorAction => action.type === failureType;
    return <CreateApiAsyncAction<HttpMethod, TBody, TResponse>>creator;
  };
