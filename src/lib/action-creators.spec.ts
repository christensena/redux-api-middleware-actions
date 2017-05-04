import {
  Action,
  ApiAction,
  createAction, createApiAction, CreateApiAsyncAction,
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
    let putUserActionCreator: CreateApiAsyncAction<'PUT', IUser, {}>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      putUserActionCreator = createApiAction<IUser, {}>('PUT_USER', url);
      action = putUserActionCreator('PUT', { name: 'Alan' });
    });

    it('should have expected CALL_API', () => {
      expect(action).toEqual({
        type: 'PUT_USER',
        CALL_API: {
          endpoint: url,
          method: 'PUT',
          types: ['PUT_USER_PENDING', 'PUT_USER_SUCCESS', 'PUT_USER_FAILURE'],
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
    let getUserActionCreator: CreateApiAsyncAction<'GET', {}, IUser>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      getUserActionCreator = createApiAction<{}, IUser>('GET_USER', url);
      action = getUserActionCreator('GET');
    });

    it('should have expected CALL_API', () => {
      expect(action).toEqual({
        type: 'GET_USER',
        CALL_API: {
          endpoint: url,
          method: 'GET',
          types: ['GET_USER_PENDING', 'GET_USER_SUCCESS', 'GET_USER_FAILURE'],
        },
      });
    });

    it('should recognise own direct offspring with matches', () => {
      expect(getUserActionCreator.matches(action)).toBeTruthy();
    });

    it('should recognise pending derivative with matchesPending', () => {
      const pendingAction = {
        type: 'GET_USER_PENDING',
        payload: {},
      }
      expect(getUserActionCreator.matchesPending(pendingAction)).toBeTruthy();
    });

    it('should recognise success derivative with matchesSuccessResponse', () => {
      const responseAction = {
        type: 'GET_USER_SUCCESS',
        payload: {
          name: 'Alan',
        },
      }
      expect(getUserActionCreator.matchesSuccessResponse(responseAction)).toBeTruthy();
    });

    it('should recognise failure derivative with matchesFailureResponse', () => {
      const responseAction = {
        type: 'GET_USER_FAILURE',
        payload: new Error('Error'),
        error: true,
      }
      expect(getUserActionCreator.matchesFailureResponse(responseAction)).toBeTruthy();
    });
  });
});
