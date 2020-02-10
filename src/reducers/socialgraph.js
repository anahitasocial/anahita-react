import _ from 'lodash';
import { Socialgraph as SOCIALGRAPH } from '../constants';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';
import utils from './utils';

const DEFAULT_STATE = {
  isFetching: false,
  actors: {
    byId: {},
    allIds: [],
    current: { ...ACTOR_DEFAULT },
  },
  total: 0,
  hasMore: true,
  error: '',
  success: false,
};

export default function (state = {
  ...DEFAULT_STATE,
}, action) {
  switch (action.type) {
    case SOCIALGRAPH.BROWSE.RESET:
      return {
        ...DEFAULT_STATE,
      };
    case SOCIALGRAPH.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case SOCIALGRAPH.FOLLOW.REQUEST:
    case SOCIALGRAPH.UNFOLLOW.REQUEST:
    case SOCIALGRAPH.BLOCK.REQUEST:
    case SOCIALGRAPH.UNBLOCK.REQUEST:
      return {
        ...state,
        actors: utils.editItem(state.actors, action.actor),
        isFetching: true,
        success: false,
        error: '',
      };
    case SOCIALGRAPH.BROWSE.SUCCESS:
      return {
        ...state,
        actors: {
          byId: {
            ...state.actors.byId,
            ...action.socialgraph,
          },
          allIds: _.union(state.actors.allIds, action.ids),
          current: { ...ACTOR_DEFAULT },
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case SOCIALGRAPH.FOLLOW.SUCCESS:
    case SOCIALGRAPH.UNFOLLOW.SUCCESS:
    case SOCIALGRAPH.BLOCK.SUCCESS:
    case SOCIALGRAPH.UNBLOCK.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: utils.editItem(state.actors, action.actor),
        success: true,
      };
    case SOCIALGRAPH.BROWSE.FAILURE:
    case SOCIALGRAPH.FOLLOW.FAILURE:
    case SOCIALGRAPH.UNFOLLOW.FAILURE:
    case SOCIALGRAPH.BLOCK.FAILURE:
    case SOCIALGRAPH.UNBLOCK.FAILURE:
      return {
        ...state,
        isFetching: false,
        hasMore: false,
        error: action.error,
        success: false,
      };
    default:
      return state;
  }
}
