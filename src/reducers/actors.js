import { Actors as ACTORS } from '../constants';

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    actors: [],
    error: '',
    offset: 0,
    limit: 20,
    total: 0,
    ...higherOrderState,
  };

  switch (action.type) {
    case ACTORS.RESET:
      return {
        ...state,
        actors: [],
        offset: 0,
        total: 0,
      };
    case ACTORS.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTORS.BROWSE.SUCCESS:
      return {
        ...state,
        actors: state.actors.concat(action.actors),
        offset: action.offset + action.limit,
        limit: action.limit,
        total: action.total,
        isFetching: false,
      };
    case ACTORS.BROWSE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
