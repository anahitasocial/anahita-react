import { Actors as ACTORS } from '../constants';

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    actors: [],
    error: '',
    offset: 0,
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
    case ACTORS.FOLLOW.REQUEST:
    case ACTORS.UNFOLLOW.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case ACTORS.BROWSE.SUCCESS:
      return {
        ...state,
        actors: state.actors.concat(action.actors),
        offset: action.offset + action.limit,
        total: action.total,
        isFetching: false,
      };
    case ACTORS.FOLLOW.SUCCESS:
    case ACTORS.UNFOLLOW.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: state.actors.map((actor) => {
          return (actor.id === action.actor.id) ? action.actor : actor;
        }),
      };
    case ACTORS.BROWSE.FAILURE:
    case ACTORS.FOLLOW.FAILURE:
    case ACTORS.UNFOLLOW.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
