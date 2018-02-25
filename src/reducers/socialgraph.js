import {
  ACTOR_FOLLOW_REQUEST, ACTOR_FOLLOW_SUCCESS, ACTOR_FOLLOW_FAILURE,
  ACTOR_UNFOLLOW_REQUEST, ACTOR_UNFOLLOW_SUCCESS, ACTOR_UNFOLLOW_FAILURE,
} from '../constants/socialgraph';

export default function (state = {
  isFetching: false,
  followSuccess: false,
  unfollowSuccess: false,
  errorMessage: '',
}, action) {
  switch (action.type) {
    case ACTOR_FOLLOW_REQUEST:
      return {
        ...state,
        followSuccess: false,
        isFetching: true,
      };
    case ACTOR_FOLLOW_SUCCESS:
      return {
        ...state,
        followSuccess: true,
        isFetching: false,
      };
    case ACTOR_FOLLOW_FAILURE:
      return {
        ...state,
        followSuccess: false,
        errorMessage: action.errorMessage,
        isFetching: false,
      };
    case ACTOR_UNFOLLOW_REQUEST:
      return {
        ...state,
        unfollowSuccess: false,
        isFetching: true,
      };
    case ACTOR_UNFOLLOW_SUCCESS:
      return {
        ...state,
        unfollowSuccess: true,
        isFetching: false,
      };
    case ACTOR_UNFOLLOW_FAILURE:
      return {
        ...state,
        unfollowSuccess: false,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
