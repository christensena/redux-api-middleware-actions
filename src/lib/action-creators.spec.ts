import {
  createAction, createApiAsyncAction,
  CreateApiAsyncAction, Action, ApiAction, GetApiParams
} from './action-creators';

interface IEntityId {
  id: number;
}

interface IEntity {
  name: string;
}

describe('action-creators', () => {

  describe('createAction with typed payload', () => {
    let action: Action<IEntityId>;

    beforeEach(() => {
      const actionCreator = createAction<IEntityId>('ACTION_NAME');
      action = actionCreator({ id: 123 });
    });

    it('should have expected payload', () => {
      expect(action).toEqual({
        type: 'ACTION_NAME',
        payload: {
          id: 123,
        }
      });
    });
  });

  describe('createApiAsyncAction with typed payload', () => {
    let action: Action<{}>;
    let url: string;
    let actionCreator: CreateApiAsyncAction<GetApiParams, {}>;

    beforeEach(() => {
      const id = 123;
      url = `/entity/${id}`;
      actionCreator = createApiAsyncAction<GetApiParams, IEntityId, {}>('GET_ENTITY');
      action = actionCreator({ url, method: 'GET' });
    });

    it('should have expected payload', () => {
      expect(action).toEqual({
        type: 'GET_ENTITY',
        meta: {
          apiParams: {
            method: 'GET',
            url,
          }
        }
      });
    });

    it('should recognise itself with matchApiResponse', () => {
      expect(actionCreator.matchApiResponse(action)).toBeTruthy();
    });
  });

});
