import {
  Actors as ACTORS,
  Actor as ACTOR,
} from '../constants';

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
    case ACTOR.FOLLOW.REQUEST:
    case ACTOR.UNFOLLOW.REQUEST:
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
    case ACTOR.FOLLOW.SUCCESS:
    case ACTOR.UNFOLLOW.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: state.actors.map((actor) => {
          return (actor.id === action.actor.id) ? action.actor : actor;
        }),
      };
    case ACTORS.BROWSE.FAILURE:
    case ACTOR.FOLLOW.FAILURE:
    case ACTOR.UNFOLLOW.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
