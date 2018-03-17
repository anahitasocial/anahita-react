import { Actor as ACTOR } from '../constants';

export default function (state = {
  actor: {},
  isFollower: undefined,
  isFetching: false,
  isSuccess: false,
  error: '',
}, action) {
  switch (action.type) {
    case ACTOR.FOLLOW.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTOR.FOLLOW.SUCCESS:
    case ACTOR.UNFOLLOW.SUCCESS:
      return {
        ...state,
        isLeader: action.actor.isLeader,
        actor: action.actor,
        isSuccess: true,
        isFetching: false,
      };
    case ACTOR.FOLLOW.FAILURE:
    case ACTOR.UNFOLLOW.FAILURE:
      return {
        ...state,
        isSuccess: false,
        isFetching: false,
        error: action.error,
      };
    case ACTOR.UNFOLLOW.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    default:
      return state;
  }
}
