import _ from 'lodash';
import { Stories as STORIES } from '../constants';
import storyDefault from '../proptypes/StoryDefault';
import utils from './utils';

export default function (state = {
  isFetching: false,
  stories: {
    byId: {},
    allIds: [],
    current: { ...storyDefault },
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
          current: { ...storyDefault },
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
        stories: {
          ...state.stories,
          current: action.story,
        },
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
          current: { ...storyDefault },
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case STORIES.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        stories: utils.deleteItem(state.stories, state.stories.current, storyDefault),
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
