import {
  Action,
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
    let action: Action<IUser>;
    let url: string;
    let actionCreator: CreateApiAsyncAction<PutApiParams, {}, IUser>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      actionCreator = createApiAsyncAction<{}, IUser>('PUT_USER');
      action = actionCreator({ url, method: 'PUT' }, { name: 'Alan' });
    });

    it('should have expected payload', () => {
      expect(action).toEqual({
        type: 'PUT_USER',
        payload: { name: 'Alan' },
        meta: {
          apiParams: {
            method: 'PUT',
            url,
          },
        },
      });
    });

    it('should recognise itself with matchApiResponse', () => {
      expect(actionCreator.matchApiResponse(action)).toBeTruthy();
    });

    it('should recognise itself with matchApiResponse', () => {
      expect(actionCreator.matchApiResponse(action)).toBeTruthy();
    });
  });

});
