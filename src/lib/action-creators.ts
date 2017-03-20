import * as Redux from 'redux';

export interface Action<TPayload> extends Redux.Action {
  payload: TPayload;
  meta?: any;
}

export interface CreateAction<TPayload> extends Action<TPayload> {
  (payload?: TPayload): Action<TPayload>;
  matches(action: Redux.Action): action is Action<TPayload>;
}

export const createAction = <TPayload>(type: string): CreateAction<TPayload> => {
  let creator: any = <TPayload>(payload?: TPayload) => ({type, payload});
  creator.matchAction = <TPayload>(action: Redux.Action): action is Action<TPayload> => action.type === type;
  return <CreateAction<TPayload>> creator;
}

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface IApiParamsWithMethod {
  method: HttpMethod;
}

export interface IApiParamsWithUrl {
  url: string;
}

export interface IApiParams extends IApiParamsWithMethod, IApiParamsWithUrl {}

export interface GetApiParams extends IApiParams {
  method: 'GET';
}

export interface DeleteApiParams extends IApiParams{
  method: 'DELETE';
}

export interface PutApiParams extends IApiParams {
  method: 'PUT';
}

export interface PostApiParams extends IApiParams {
  method: 'POST';
}

export type ApiParams =
  GetApiParams |
  DeleteApiParams |
  PutApiParams|
  PostApiParams;

export interface ApiAction<TResponse> extends Action<TResponse> {
  meta: {
    apiParams: ApiParams;
  }
}

export interface CreateApiAsyncAction<ApiParams, TResponse, TPayload> {
  (params: ApiParams, payload?: TPayload): Action<TPayload>;
  matches(action: Redux.Action): action is ApiAction<TResponse>
  matchApiResponse(action: Redux.Action): action is ApiAction<TResponse>
}

export const createApiAsyncAction = <TApiParams, TResponse, TPayload>(type: string): CreateApiAsyncAction<TApiParams, TResponse, TPayload> => {
  let creator: any = (apiParams: TApiParams, payload: TPayload): Action<TPayload> => ({
    type,
    payload,
    meta: {
      apiParams,
    },
  });
  creator.matchApiResponse = <TResponse>(action: Redux.Action): action is ApiAction<TResponse> => action.type === type;
  //creator.getApiResponse = (action: Action<TResponse>): (action: Action<TResponse>) => action.payload;
  return <CreateApiAsyncAction<TApiParams, TResponse, TPayload>> creator;
}
