import createReducer from './create';
import COMMENT_DEFAULT from '../proptypes/CommentDefault';

export default (namespace) => {
  return (state, action) => {
    return createReducer(namespace, COMMENT_DEFAULT)(state, action);
  };
};
