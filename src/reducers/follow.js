import {
  ACTOR_FOLLOW_REQUEST, ACTOR_FOLLOW_SUCCESS, ACTOR_FOLLOW_FAILURE,
  ACTOR_UNFOLLOW_REQUEST, ACTOR_UNFOLLOW_SUCCESS, ACTOR_UNFOLLOW_FAILURE,
} from '../constants/socialgraph';

export default function (state = {
  actor: {},
  isFollower: undefined,
  isFetching: false,
  isSuccess: false,
  errorMessage: '',
}, action) {
  switch (action.type) {
    case ACTOR_FOLLOW_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR_FOLLOW_SUCCESS:
      return {
        ...state,
        isLeader: action.actor.isLeader,
        isSuccess: true,
        isFetching: false,
      };
    case ACTOR_FOLLOW_FAILURE:
      return {
        ...state,
        isSuccess: false,
        errorMessage: action.errorMessage,
        isFetching: false,
      };
    case ACTOR_UNFOLLOW_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR_UNFOLLOW_SUCCESS:
      return {
        ...state,
        isLeader: action.actor.isLeader,
        isSuccess: true,
        isFetching: false,
      };
    case ACTOR_UNFOLLOW_FAILURE:
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
