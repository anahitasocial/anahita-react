import { Actors as ACTORS } from '../constants';

export default function (state = {
  isFetching: false,
  isFetchingAvatar: false,
  isFetchingCover: false,
  success: false,
  actor: {},
  error: '',
}, action) {
  switch (action.type) {
    case ACTORS.AVATAR.ADD.REQUEST:
    case ACTORS.AVATAR.DELETE.REQUEST:
      return {
        ...state,
        isFetchingAvatar: true,
        actor: action.actor,
        success: false,
        error: '',
      };
    case ACTORS.COVER.ADD.REQUEST:
    case ACTORS.COVER.DELETE.REQUEST:
      return {
        ...state,
        isFetchingCover: true,
        actor: action.actor,
        success: false,
        error: '',
      };
    case ACTORS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case ACTORS.AVATAR.ADD.SUCCESS:
    case ACTORS.AVATAR.DELETE.SUCCESS:
      return {
        ...state,
        isFetchingAvatar: false,
        actor: action.actor,
        success: true,
        error: '',
      };
    case ACTORS.COVER.ADD.SUCCESS:
    case ACTORS.COVER.DELETE.SUCCESS:
      return {
        ...state,
        isFetchingCover: false,
        actor: action.actor,
        success: true,
        error: '',
      };
    case ACTORS.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actor: {},
        success: true,
        error: '',
      };
    case ACTORS.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case ACTORS.AVATAR.ADD.FAILURE:
    case ACTORS.AVATAR.DELETE.FAILURE:
      return {
        ...state,
        isFetchingAvatar: false,
        success: false,
        error: action.error,
      };
    case ACTORS.COVER.ADD.FAILURE:
    case ACTORS.COVER.DELETE.FAILURE:
      return {
        ...state,
        isFetchingCover: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
