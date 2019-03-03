import { Likes as LIKES } from '../constants';

export default (state = {
  error: '',
  isFetching: false,
}, action) => {
  switch (action.type) {
    case LIKES.ADD.REQUEST:
    case LIKES.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case LIKES.ADD.SUCCESS:
    case LIKES.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: '',
      };
    case LIKES.ADD.FAILURE:
    case LIKES.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
