import { Avatar as AVATAR } from '../constants';
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
    case AVATAR.ADD.REQUEST:
    case AVATAR.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case AVATAR.ADD.SUCCESS:
    case AVATAR.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
        actors: utils.editItem(state.actors, action.actor),
      };
    case AVATAR.ADD.FAILURE:
    case AVATAR.DELETE.FAILURE:
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
