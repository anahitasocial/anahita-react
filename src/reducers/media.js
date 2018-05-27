import { Media as MEDIA } from '../constants';

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    media: {
      byId: {},
      allIds: [],
    },
    error: '',
    total: 0,
    ...higherOrderState,
  };

  switch (action.type) {
    case MEDIA.BROWSE.RESET:
      return {
        ...state,
        media: {
          byId: {},
          allIds: [],
        },
        total: 0,
        isFetching: false,
        error: '',
      };
    case MEDIA.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case MEDIA.BROWSE.SUCCESS:
      return {
        ...state,
        media: {
          byId: Object.assign({}, state.media.byId, action.media),
          allIds: state.media.allIds.concat(action.ids),
        },
        total: action.total,
        isFetching: false,
      };
    case MEDIA.BROWSE.FAILURE:
    default:
      return state;
  }
}
