import {
  Action,
  ApiAction,
  createAction, createApiAsyncAction, CreateApiAsyncAction,
  PutApiParams, GetApiParams,
} from './action-creators';

interface IUserId {
  id: number;
}

interface IUser {
  name: string;
}

describe('action-creators', () => {

  describe('createAction with typed payload', () => {
    let action: Action<IUserId>;

    beforeEach(() => {
      const actionCreator = createAction<IUserId>('ACTION_NAME');
      action = actionCreator({ id: 123 });
    });

    it('should have expected payload', () => {
      expect(action).toEqual({
        type: 'ACTION_NAME',
        payload: {
          id: 123,
        },
      });
    });
  });

  describe('createApiAsyncAction with typed payload', () => {
    let action: ApiAction<IUser, {}>;
    let url: string;
    let putUserActionCreator: CreateApiAsyncAction<PutApiParams, IUser, {}>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      putUserActionCreator = createApiAsyncAction<IUser, {}>('PUT_USER');
      action = putUserActionCreator({ url, method: 'PUT' }, { name: 'Alan' });
    });

    it('should have expected CALL_API', () => {
      expect(action).toEqual({
        type: 'PUT_USER',
        CALL_API: {
          endpoint: url,
          method: 'PUT',
          types: ['PUT_USER', 'PUT_USER_SUCCESS', 'PUT_USER_FAILURE'],
          body: { name: 'Alan' },
        },
      });
    });

    it('should recognise itself with matches', () => {
      expect(putUserActionCreator.matches(action)).toBeTruthy();
    });

    it('should recognise success derivative with matchApiResponse', () => {
      const responseAction = {
        type: 'PUT_USER_SUCCESS',
        payload: {},
      }
      expect(putUserActionCreator.matchesSuccessResponse(responseAction)).toBeTruthy();
    });

    it('should recognise failure derivative with matchesSuccessResponse', () => {
      const responseAction = {
        type: 'PUT_USER_FAILURE',
        payload: new Error('Error'),
        error: true,
      }
      expect(putUserActionCreator.matchesFailureResponse(responseAction)).toBeTruthy();
    });
  });

  describe('createApiAsyncAction with typed response', () => {
    let action: ApiAction<{}, IUser>;
    let url: string;
    let getUserActionCreator: CreateApiAsyncAction<GetApiParams, {}, IUser>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      getUserActionCreator = createApiAsyncAction<{}, IUser>('GET_USER');
      action = getUserActionCreator({ url, method: 'GET' });
    });

    it('should have expected CALL_API', () => {
      expect(action).toEqual({
        type: 'GET_USER',
        CALL_API: {
          endpoint: url,
          method: 'GET',
          types: ['GET_USER', 'GET_USER_SUCCESS', 'GET_USER_FAILURE'],
        },
      });
    });

    it('should recognise itself with matches', () => {
      expect(getUserActionCreator.matches(action)).toBeTruthy();
    });

    it('should recognise success derivative with matchApiResponse', () => {
      const responseAction = {
        type: 'GET_USER_SUCCESS',
        payload: {
          name: 'Alan',
        },
      }
      expect(getUserActionCreator.matchesSuccessResponse(responseAction)).toBeTruthy();
    });

    it('should recognise failure derivative with matchesSuccessResponse', () => {
      const responseAction = {
        type: 'GET_USER_FAILURE',
        payload: new Error('Error'),
        error: true,
      }
      expect(getUserActionCreator.matchesFailureResponse(responseAction)).toBeTruthy();
    });
  });
});
