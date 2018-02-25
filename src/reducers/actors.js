import {
  ACTORS_RESET,
  ACTORS_BROWSE_REQUEST, ACTORS_BROWSE_SUCCESS, ACTORS_BROWSE_FAILURE,
} from '../constants/actors';

export default function (state = {
  isFetching: false,
  actors: [],
  errorMessage: '',
  disabledFilter: false,
  offset: 0,
  limit: 20,
  total: 0,
}, action) {
  switch (action.type) {
    case ACTORS_RESET:
      return {
        ...state,
        actors: [],
        offset: 0,
        total: 0,
      };
    case ACTORS_BROWSE_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTORS_BROWSE_SUCCESS:
      return {
        ...state,
        actors: state.actors.concat(...action.actors),
        offset: action.offset + action.limit,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case ACTORS_BROWSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
