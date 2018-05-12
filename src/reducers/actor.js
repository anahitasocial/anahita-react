import { Actor as ACTOR } from '../constants';

export default function (state = {
  isFetching: false,
  isFetchingAvatar: false,
  isFetchingCover: false,
  success: false,
  actor: {},
  error: '',
}, action) {
  switch (action.type) {
    case ACTOR.READ.REQUEST:
      return {
        ...state,
        isFetching: true,
        actor: {},
      };
    case ACTOR.EDIT.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        actor: action.actor,
      };
    case ACTOR.AVATAR.ADD.REQUEST:
    case ACTOR.AVATAR.DELETE.REQUEST:
      return {
        ...state,
        isFetchingAvatar: true,
        success: false,
        actor: action.actor,
      };
    case ACTOR.COVER.ADD.REQUEST:
    case ACTOR.COVER.DELETE.REQUEST:
      return {
        ...state,
        isFetchingCover: true,
        success: false,
        actor: action.actor,
      };
    case ACTOR.ADD.REQUEST:
    case ACTOR.DELETE.REQUEST:
    case ACTOR.FOLLOW.REQUEST:
    case ACTOR.UNFOLLOW.REQUEST:
    case ACTOR.BLOCK.REQUEST:
    case ACTOR.UNBLOCK.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
      };
    case ACTOR.READ.SUCCESS:
    case ACTOR.EDIT.SUCCESS:
    case ACTOR.ADD.SUCCESS:
    case ACTOR.FOLLOW.SUCCESS:
    case ACTOR.UNFOLLOW.SUCCESS:
    case ACTOR.BLOCK.SUCCESS:
    case ACTOR.UNBLOCK.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        actor: action.actor,
        error: '',
      };
    case ACTOR.AVATAR.ADD.SUCCESS:
    case ACTOR.AVATAR.DELETE.SUCCESS:
      return {
        ...state,
        isFetchingAvatar: false,
        success: true,
        actor: action.actor,
        error: '',
      };
    case ACTOR.COVER.ADD.SUCCESS:
    case ACTOR.COVER.DELETE.SUCCESS:
      return {
        ...state,
        isFetchingCover: false,
        success: true,
        actor: action.actor,
        error: '',
      };
    case ACTOR.READ.FAILURE:
    case ACTOR.EDIT.FAILURE:
    case ACTOR.ADD.FAILURE:
    case ACTOR.DELETE.FAILURE:
    case ACTOR.FOLLOW.FAILURE:
    case ACTOR.UNFOLLOW.FAILURE:
    case ACTOR.BLOCK.FAILURE:
    case ACTOR.UNBLOCK.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case ACTOR.AVATAR.ADD.FAILURE:
    case ACTOR.AVATAR.DELETE.FAILURE:
      return {
        ...state,
        isFetchingAvatar: false,
        success: false,
        error: action.error,
      };
    case ACTOR.COVER.ADD.FAILURE:
    case ACTOR.COVER.DELETE.FAILURE:
      return {
        ...state,
        isFetchingCover: false,
        success: false,
        error: action.error,
      };
    case ACTOR.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actor: {},
        success: true,
      };
    default:
      return state;
  }
}
