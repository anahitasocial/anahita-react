import createReducer from './create';
import COMMENT_DEFAULT from '../proptypes/CommentDefault';
import utils from '../utils';

const {
  editItem,
} = utils.reducer;

export default (namespace) => {
  return (iniState, action) => {
    const state = createReducer(namespace, COMMENT_DEFAULT)(iniState, action);
    const { type } = action;
    switch (type) {
      case 'COMMENTS_LIKES_ADD_REQUEST':
      case 'COMMENTS_LIKES_DELETE_REQUEST':
        return {
          ...state,
          isFetching: true,
          success: false,
          error: '',
        };
      case 'COMMENTS_LIKES_ADD_SUCCESS':
      case 'COMMENTS_LIKES_DELETE_SUCCESS':
        return {
          ...state,
          [namespace]: editItem(
            state[namespace],
            action.node,
            COMMENT_DEFAULT,
          ),
          isFetching: false,
          success: false,
          error: '',
        };
      case 'COMMENTS_LIKES_ADD_FAILURE':
      case 'COMMENTS_LIKES_DELETE_FAILURE':
        return {
          ...state,
          isFetching: false,
          success: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
};
