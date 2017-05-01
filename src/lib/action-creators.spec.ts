import {
  Action,
  ApiAction,
  createAction, createApiAsyncAction, CreateApiAsyncAction,
  PutApiParams,
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
    let action: ApiAction<{}, IUser>;
    let url: string;
    let actionCreator: CreateApiAsyncAction<PutApiParams, {}, IUser>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      actionCreator = createApiAsyncAction<{}, IUser>('PUT_USER');
      action = actionCreator({ url, method: 'PUT' }, { name: 'Alan' });
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
      expect(actionCreator.matches(action)).toBeTruthy();
    });

    it('should recognise success derivative with matchApiResponse', () => {
      const responseAction = {
        type: 'PUT_USER_SUCCESS',
        payload: {},
      }
      expect(actionCreator.matchesSuccessResponse(responseAction)).toBeTruthy();
    });

    it('should recognise failure derivative with matchesSuccessResponse', () => {
      const responseAction = {
        type: 'PUT_USER_FAILURE',
        payload: new Error('Error'),
        error: true,
      }
      expect(actionCreator.matchesFailureResponse(responseAction)).toBeTruthy();
    });
  });

});
