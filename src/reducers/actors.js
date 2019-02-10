import _ from 'lodash';
import { Actors as ACTORS } from '../constants';

const updateItem = (state, item) => {
  const actors = { ...state.actors };
  actors.byId[item.id] = item;
  return actors;
};

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    actors: {
      byId: {},
      allIds: [],
    },
    error: '',
    total: 0,
    ...higherOrderState,
  };

  switch (action.type) {
    case ACTORS.BROWSE.RESET:
      return {
        ...state,
        actors: {
          byId: {},
          allIds: [],
        },
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
        actors: {
          byId: {
            ...state.actors.byId,
            ...action.actors,
          },
          allIds: _.union(state.actors.allIds, action.ids),
        },
        total: action.total,
        isFetching: false,
      };
    case ACTORS.FOLLOW.SUCCESS:
    case ACTORS.UNFOLLOW.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: updateItem(state, action.actor),
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
