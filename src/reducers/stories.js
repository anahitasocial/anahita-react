import _ from 'lodash';
import { Stories as STORIES } from '../constants';
import utils from './utils';

export default function (state = {
  isFetching: false,
  stories: {
    byId: {},
    allIds: [],
    current: null,
  },
  error: '',
  total: 0,
  hasMore: true,
}, action) {
  switch (action.type) {
    case STORIES.BROWSE.RESET:
      return {
        ...state,
        stories: {
          byId: {},
          allIds: [],
          current: null,
        },
        total: 0,
        isFetching: false,
        error: '',
        hasMore: true,
      };
    case STORIES.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case STORIES.DELETE.REQUEST:
      return {
        ...state,
        current: action.current,
        isFetching: true,
        success: false,
        error: '',
      };
    case STORIES.BROWSE.SUCCESS:
      return {
        ...state,
        stories: {
          byId: {
            ...state.stories.byId,
            ...action.stories,
          },
          allIds: _.union(state.stories.allIds, action.ids),
          current: null,
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case STORIES.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        stories: utils.deleteItem(state.stories, state.current),
        success: true,
      };
    case STORIES.BROWSE.FAILURE:
    case STORIES.DELETE.FAILURE:
      return {
        ...state,
        hasMore: false,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
}
