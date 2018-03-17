import { People as PEOPLE } from '../constants';

export default function (state = {
  isFetching: false,
  people: [],
  error: '',
  keywordFilter: '',
  usertypeFilter: '',
  disabledFilter: false,
  offset: 0,
  limit: 20,
  total: 0,
}, action) {
  switch (action.type) {
    case PEOPLE.RESET:
      return {
        ...state,
        people: [],
        offset: 0,
        total: 0,
      };
    case PEOPLE.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case PEOPLE.BROWSE.SUCCESS:
      return {
        ...state,
        people: state.people.concat(...action.people),
        offset: action.offset + action.limit,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case PEOPLE.BROWSE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
