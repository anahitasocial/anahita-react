import { Comments as COMMENTS } from '../constants';

export default (state = {
  comments: {
    byId: {},
    allIds: [],
    current: null,
  },
  error: '',
  isFetching: false,
}, action) => {
  switch (action.type) {
    case COMMENTS.READ.REQUEST:
    case COMMENTS.EDIT.REQUEST:
    case COMMENTS.ADD.REQUEST:
    case COMMENTS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case COMMENTS.READ.SUCCESS:
    case COMMENTS.EDIT.SUCCESS:
    case COMMENTS.ADD.SUCCESS:
    case COMMENTS.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: '',
      };
    case COMMENTS.READ.FAILURE:
    case COMMENTS.EDIT.FAILURE:
    case COMMENTS.ADD.FAILURE:
    case COMMENTS.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
