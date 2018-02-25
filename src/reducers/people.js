import {
  PEOPLE_RESET,
  PEOPLE_BROWSE_REQUEST, PEOPLE_BROWSE_SUCCESS, PEOPLE_BROWSE_FAILURE,
} from '../constants/people';

export default function (state = {
  isFetching: false,
  people: [],
  errorMessage: '',
  keywordFilter: '',
  usertypeFilter: '',
  disabledFilter: false,
  offset: 0,
  limit: 20,
  total: 0,
}, action) {
  switch (action.type) {
    case PEOPLE_RESET:
      return {
        ...state,
        people: [],
        offset: 0,
        total: 0,
      };
    case PEOPLE_BROWSE_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case PEOPLE_BROWSE_SUCCESS:
      return {
        ...state,
        people: state.people.concat(...action.people),
        offset: action.offset + action.limit,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case PEOPLE_BROWSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
