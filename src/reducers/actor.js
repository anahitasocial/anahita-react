import {
  ACTOR_READ_REQUEST, ACTOR_READ_SUCCESS, ACTOR_READ_FAILURE,
  // ACTOR_EDIT_REQUEST, ACTOR_EDIT_SUCCESS, ACTOR_EDIT_FAILURE,
  // ACTOR_ADD_REQUEST, ACTOR_ADD_SUCCESS, ACTOR_ADD_FAILURE,
  ACTOR_DELETE_REQUEST, ACTOR_DELETE_SUCCESS, ACTOR_DELETE_FAILURE,
} from '../constants/actor';

export default function (state = {
  isFetching: false,
  actor: {},
  errorMessage: '',
}, action) {
  switch (action.type) {
    case ACTOR_READ_REQUEST:
      return {
        ...state,
        isFetching: true,
        actor: {},
      };
    case ACTOR_READ_SUCCESS:
      return {
        ...state,
        isFetching: false,
        actor: action.actor,
        errorMessage: '',
      };
    case ACTOR_READ_FAILURE:
      return {
        ...state,
        isFetching: false,
        actor: {},
        errorMessage: action.errorMessage,
      };
    case ACTOR_DELETE_REQUEST:
      return {
        ...state,
        actor: action.actor,
        deleteSuccess: false,
      };
    case ACTOR_DELETE_SUCCESS:
      return {
        ...state,
        actor: {},
        deleteSuccess: true,
      };
    case ACTOR_DELETE_FAILURE:
      return {
        ...state,
        deleteSuccess: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
