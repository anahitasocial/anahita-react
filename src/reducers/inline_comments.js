import _ from 'lodash';
import { InlineComments as INLINE_COMMENTS } from '../constants';
import CommentDefault from '../proptypes/CommentDefault';
import NodeDefault from '../proptypes/NodeDefault';
import utils from './utils';

const CommentsDefault = {
  byId: {},
  allIds: [],
  current: { ...CommentDefault },
};

const setComments = (action, state) => {
  const { parent, comments } = action;
  const { parents } = state;

  return {
    allIds: _.union(parents.allIds, [parent.id]),
    byId: {
      [parent.id]: comments,
      ...parents.byId,
    },
  };
};

const updateComments = (action, state) => {
  const { comment } = action;
  const { parentId } = comment;
  const parents = { ...state.parents };

  parents.byId[parentId] = utils.editItem(
    parents.byId[parentId] ? parents.byId[parentId] : CommentsDefault,
    comment,
  );

  return parents;
};

const deleteComment = (action, state) => {
  const { comment } = action;
  const { parentId } = comment;
  const parents = { ...state.parents };

  parents.byId[parentId] = utils.deleteItem(
    parents.byId[parentId],
    comment,
    NodeDefault,
  );

  return parents;
};

const initState = {
  parents: {
    byId: {},
    allIds: [],
    current: { ...NodeDefault },
  },
  error: '',
  isFetching: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case INLINE_COMMENTS.BROWSE.SET:
      return {
        ...state,
        parents: setComments(action, state),
      };
    case INLINE_COMMENTS.BROWSE.RESET:
      return {
        ...initState,
        parents: setComments({
          parent: action.parent,
          comments: { ...CommentsDefault },
        }, state),
      };
    case INLINE_COMMENTS.BROWSE.REQUEST:
    case INLINE_COMMENTS.EDIT.REQUEST:
    case INLINE_COMMENTS.ADD.REQUEST:
    case INLINE_COMMENTS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case INLINE_COMMENTS.BROWSE.SUCCESS:
      return {
        ...state,
        parents: setComments(action, state),
        isFetching: false,
        error: '',
      };
    case INLINE_COMMENTS.EDIT.SUCCESS:
    case INLINE_COMMENTS.ADD.SUCCESS:
      return {
        ...state,
        parents: updateComments(action, state),
        isFetching: false,
        error: '',
      };
    case INLINE_COMMENTS.DELETE.SUCCESS:
      return {
        ...state,
        parents: deleteComment(action, state),
        isFetching: false,
        error: '',
      };
    case INLINE_COMMENTS.BROWSE.FAILURE:
    case INLINE_COMMENTS.EDIT.FAILURE:
    case INLINE_COMMENTS.ADD.FAILURE:
    case INLINE_COMMENTS.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
