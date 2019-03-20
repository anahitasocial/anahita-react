import { Avatar as COVER } from '../constants';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';
import utils from './utils';

const DEFAULT_STATE = {
  isFetching: false,
  actors: {
    byId: {},
    allIds: [],
    current: ACTOR_DEFAULT,
  },
  error: '',
  success: false,
};

export default function (higherOrderState, action) {
  const state = {
    ...DEFAULT_STATE,
    ...higherOrderState,
  };

  switch (action.type) {
    case COVER.ADD.REQUEST:
    case COVER.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case COVER.ADD.SUCCESS:
    case COVER.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        actors: utils.editItem(state.actors, action.actor),
      };
    case COVER.ADD.FAILURE:
    case COVER.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
