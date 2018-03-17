import { Actors as ACTORS } from '../constants';

const arrayToObject = (array) => {
  const objects = [];
  array.map((item) => {
    objects[item.id] = item;
    return objects;
  });
  return objects;
};

export default function (state = {
  isFetching: false,
  actors: [],
  error: '',
  disabledFilter: false,
  offset: 0,
  limit: 20,
  total: 0,
}, action) {
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
        actors: state.actors.concat(arrayToObject(action.actors)),
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
