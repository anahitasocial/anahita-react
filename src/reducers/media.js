import { Media as MEDIA } from '../constants';

export default function (higherOrderState, action) {
  const state = {
    isFetching: false,
    media: [],
    error: '',
    offset: 0,
    total: 0,
    ...higherOrderState,
  };

  switch (action.type) {
    case MEDIA.RESET:
      return {
        ...state,
        media: [],
        offset: 0,
        total: 0,
      };
    case MEDIA.BROWSE.REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case MEDIA.BROWSE.SUCCESS:
      return {
        ...state,
        media: state.media.concat(action.media),
        offset: action.offset + action.limit,
        total: action.total,
        isFetching: false,
      };
    case MEDIA.BROWSE.FAILURE:
    default:
      return state;
  }
}
