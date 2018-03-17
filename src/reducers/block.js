import { Actor as ACTOR } from '../constants';

export default function (state = {
  isSuccess: false,
  isFetching: false,
  isBlocked: undefined,
  error: '',
}, action) {
  switch (action.type) {
    case ACTOR.BLOCK.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR.BLOCK.SUCCESS:
    case ACTOR.UNBLOCK.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        isBlocked: action.actor.isBlocked,
      };
    case ACTOR.BLOCK.FAILURE:
    case ACTOR.UNBLOCK.FAILURE:
      return {
        ...state,
        isSuccess: false,
        error: action.error,
        isFetching: false,
      };
    case ACTOR.UNBLOCK.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    default:
      return state;
  }
}
