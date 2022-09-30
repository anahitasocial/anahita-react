import _ from 'lodash';
import { Stories as STORIES } from '../constants';
import storyDefault from '../proptypes/StoryDefault';
import utils from '../utils';

const {
  editItem,
  deleteItem,
} = utils.reducer;

export default (state = {
  isFetching: false,
  stories: {
    byId: {},
    allIds: [],
    current: { ...storyDefault },
  },
  error: '',
  total: 0,
  hasMore: true,
}, action) => {
  switch (action.type) {
    case STORIES.BROWSE.RESET:
      return {
        ...state,
        isFetching: false,
        stories: {
          byId: {},
          allIds: [],
          current: { ...storyDefault },
        },
        error: '',
        total: 0,
        hasMore: true,
      };
    case STORIES.BROWSE.REQUEST:
    case 'STORIES_LIKES_ADD_REQUEST':
    case 'STORIES_LIKES_DELETE_REQUEST':
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
        stories: deleteItem(state.stories, state.stories.current, storyDefault),
        success: true,
      };
    case 'STORIES_LIKES_ADD_SUCCESS':
    case 'STORIES_LIKES_DELETE_SUCCESS': {
      // const { current: story } = state.stories;
      const { node, story } = action;
      story.object = node;
      return {
        ...state,
        isFetching: false,
        stories: editItem(state.stories, story, storyDefault),
        success: true,
      };
    }
    case STORIES.BROWSE.FAILURE:
    case STORIES.DELETE.FAILURE:
    case 'STORIES_LIKES_ADD_FAILURE':
    case 'STORIES_LIKES_DELETE_FAILURE':
      return {
        ...state,
        hasMore: false,
        isFetching: false,
        error: action.error,
      };
    case STORIES.ADD:
      return {
        ...state,
        stories: {
          byId: {
            ...state.stories.byId,
            [action.story.id]: action.story,
          },
          allIds: _.union([action.story.id], state.stories.allIds),
        },
      };
    default:
      return state;
  }
};
