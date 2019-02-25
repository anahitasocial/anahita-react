import _ from 'lodash';
import { Actors as ACTORS } from '../constants';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';

const updateItem = (state, actor) => {
  const actors = { ...state.actors };
  actors.byId[actor.id] = actor;
  actors.allIds = _.union(actors.allIds, [actor.id]);
  actors.current = actor;
  return actors;
};

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    actors: {
      byId: {},
      allIds: [],
      current: ACTOR_DEFAULT,
    },
    error: '',
    total: 0,
    hasMore: true,
    success: false,
    ...higherOrderState,
  };

  switch (action.type) {
    case ACTORS.BROWSE.RESET:
      return {
        ...state,
        actors: {
          byId: {},
          allIds: [],
          current: ACTOR_DEFAULT,
        },
        total: 0,
        hasMore: true,
        success: false,
      };
    case ACTORS.BROWSE.REQUEST:
    case ACTORS.READ.REQUEST:
    case ACTORS.EDIT.REQUEST:
    case ACTORS.ADD.REQUEST:
    case ACTORS.FOLLOW.REQUEST:
    case ACTORS.UNFOLLOW.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
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
          current: ACTOR_DEFAULT,
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case ACTORS.READ.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: updateItem(state, action.actor),
        success: false,
      };
    case ACTORS.EDIT.SUCCESS:
    case ACTORS.ADD.SUCCESS:
    case ACTORS.FOLLOW.SUCCESS:
    case ACTORS.UNFOLLOW.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: updateItem(state, action.actor),
        success: true,
      };
    case ACTORS.BROWSE.FAILURE:
    case ACTORS.READ.FAILURE:
    case ACTORS.EDIT.FAILURE:
    case ACTORS.ADD.FAILURE:
    case ACTORS.FOLLOW.FAILURE:
    case ACTORS.UNFOLLOW.FAILURE:
      return {
        ...state,
        hasMore: false,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
