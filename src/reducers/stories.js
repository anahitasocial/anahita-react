import _ from 'lodash';
import { Stories as STORIES } from '../constants';

export default function (state = {
  isFetching: false,
  stories: {
    byId: {},
    allIds: [],
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
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case STORIES.BROWSE.FAILURE:
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
