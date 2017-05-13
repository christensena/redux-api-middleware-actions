import { CALL_API, validateRSAA } from 'redux-api-middleware';
import {
  Action,
  ApiAction,
  createAction, createApiAction, CreateApiAsyncAction, CreateAction,
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
    let actionCreator: CreateAction<IUserId>

    beforeEach(() => {
      actionCreator = createAction<IUserId>('ACTION_NAME');
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

    it('should recognise itself', () => {
      expect(actionCreator.matches(action)).toBe(true);
    })
  });

  describe('createApiAsyncAction with typed payload', () => {
    let action: ApiAction<IUser, {}>;
    let endpoint: string;
    let actionCreator: CreateApiAsyncAction<IUser, {}>;
    let payload: IUser;

    beforeEach(() => {
      const id = 123;
      endpoint = `/entity/${id}`;
      actionCreator = createApiAction<IUser, {}>('PUT_USER', { CALL_API, method: 'PUT', endpoint });

      payload = { name: 'Alan' };
      action = actionCreator(payload);
    });

    it('should have expected CALL_API', () => {
      expect(action[CALL_API]).toEqual({
        endpoint: endpoint,
        method: 'PUT',
        types: ['PUT_USER_PENDING', 'PUT_USER_SUCCESS', 'PUT_USER_FAILURE'],
        body: { name: 'Alan' },
      });
    });

    it('should validate as RSAA', () => {
      expect(validateRSAA(action)).toHaveLength(0);
    });

    it('should recognise pending derivative with matchApiResponse', () => {
      const pendingAction = {
        type: 'PUT_USER_PENDING',
        payload,
      }
      expect(actionCreator.matchesPending(pendingAction)).toBe(true);
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

  describe('createApiAsyncAction with typed response', () => {
    let action: ApiAction<{}, IUser>;
    let endpoint: string;
    let actionCreator: CreateApiAsyncAction<{}, IUser>;

    beforeEach(() => {
      const id = 123;
      endpoint = `/entity/${id}`;
      actionCreator = createApiAction<{}, IUser>('GET_USER', { CALL_API, method: 'GET', endpoint });
      action = actionCreator();
    });

    it('should have expected CALL_API', () => {
      expect(action[CALL_API]).toEqual({
        endpoint,
        method: 'GET',
        types: ['GET_USER_PENDING', 'GET_USER_SUCCESS', 'GET_USER_FAILURE'],
      });
    });

    it('should recognise pending derivative with matchesPending', () => {
      const pendingAction = {
        type: 'GET_USER_PENDING',
        payload: {},
      }
      expect(actionCreator.matchesPending(pendingAction)).toBeTruthy();
    });

    it('should recognise success derivative with matchesSuccessResponse', () => {
      const responseAction = {
        type: 'GET_USER_SUCCESS',
        payload: {
          name: 'Alan',
        },
      }
      expect(actionCreator.matchesSuccessResponse(responseAction)).toBeTruthy();
    });

    it('should recognise failure derivative with matchesFailureResponse', () => {
      const responseAction = {
        type: 'GET_USER_FAILURE',
        payload: new Error('Error'),
        error: true,
      }
      expect(actionCreator.matchesFailureResponse(responseAction)).toBeTruthy();
    });
  });

  describe('createApiAsyncAction with function options', () => {
    let action: ApiAction<{ name: string }, IUser>;
    let actionCreator: CreateApiAsyncAction<{ name: string }, IUser>;
    let userName = 'Fred';

    beforeEach(() => {
      actionCreator = createApiAction<{ name: string }, IUser>('GET_USER', ({ name }) => ({
        CALL_API,
        method: 'GET',
        endpoint: `/users/${name}`,
      }));
      action = actionCreator({ name: userName });
    });

    it('should have expected CALL_API', () => {
      expect(action[CALL_API]).toEqual({
        endpoint: `/users/${userName}`,
        method: 'GET',
        types: ['GET_USER_PENDING', 'GET_USER_SUCCESS', 'GET_USER_FAILURE'],
      });
    });
  });
});
