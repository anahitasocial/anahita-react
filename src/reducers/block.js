import {
  ACTOR_BLOCK_REQUEST, ACTOR_BLOCK_SUCCESS, ACTOR_BLOCK_FAILURE,
  ACTOR_UNBLOCK_REQUEST, ACTOR_UNBLOCK_SUCCESS, ACTOR_UNBLOCK_FAILURE,
} from '../constants/socialgraph';

export default function (state = {
  isSuccess: false,
  isFetching: false,
  isBlocked: undefined,
  errorMessage: '',
}, action) {
  switch (action.type) {
    case ACTOR_BLOCK_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR_BLOCK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        isBlocked: action.actor.isBlocked,
      };
    case ACTOR_BLOCK_FAILURE:
      return {
        ...state,
        isSuccess: false,
        errorMessage: action.errorMessage,
        isFetching: false,
      };
    case ACTOR_UNBLOCK_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR_UNBLOCK_SUCCESS:
      return {
        ...state,
        isBlocked: action.actor.isBlocked,
        isSuccess: true,
        isFetching: false,
      };
    case ACTOR_UNBLOCK_FAILURE:
      return {
        ...state,
        isSuccess: false,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
