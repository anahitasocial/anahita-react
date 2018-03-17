import { Actor as ACTOR } from '../constants';

export default function (state = {
  isFetching: false,
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
    case ACTOR.ADD.REQUEST:
    case ACTOR.DELETE.REQUEST:
      return {
        ...state,
        actor: action.actor,
        isFetching: true,
        success: false,
      };
    case ACTOR.READ.SUCCESS:
    case ACTOR.EDIT.SUCCESS:
    case ACTOR.ADD.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        actor: action.actor,
        error: '',
      };
    case ACTOR.READ.FAILURE:
    case ACTOR.EDIT.FAILURE:
    case ACTOR.ADD.FAILURE:
    case ACTOR.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    case ACTOR.DELETE.SUCCESS:
      return {
        ...state,
        actor: {},
        success: true,
      };
    default:
      return state;
  }
}
