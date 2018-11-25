import { Stories as STORIES } from '../constants';

export default function (state = {
  isFetching: false,
  stories: {
    byId: {},
    allIds: [],
  },
  error: '',
  total: 0,
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
          byId: Object.assign({}, state.stories.byId, action.stories),
          allIds: state.stories.allIds.concat(action.ids),
        },
        total: action.total,
        isFetching: false,
      };
    case STORIES.BROWSE.FAILURE:
    default:
      return state;
  }
}
