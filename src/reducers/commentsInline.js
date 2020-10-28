import _ from 'lodash';
import { CommentsInline as COMMENTS_INLINE } from '../constants';
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
    case COMMENTS_INLINE.BROWSE.SET:
      return {
        ...state,
        parents: setComments(action, state),
      };
    case COMMENTS_INLINE.BROWSE.RESET:
      return {
        ...initState,
        parents: setComments({
          parent: action.parent,
          comments: { ...CommentsDefault },
        }, state),
      };
    case COMMENTS_INLINE.BROWSE.REQUEST:
    case COMMENTS_INLINE.EDIT.REQUEST:
    case COMMENTS_INLINE.ADD.REQUEST:
    case COMMENTS_INLINE.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case COMMENTS_INLINE.BROWSE.SUCCESS:
      return {
        ...state,
        parents: setComments(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS_INLINE.EDIT.SUCCESS:
    case COMMENTS_INLINE.ADD.SUCCESS:
      return {
        ...state,
        parents: updateComments(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS_INLINE.DELETE.SUCCESS:
      return {
        ...state,
        parents: deleteComment(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS_INLINE.BROWSE.FAILURE:
    case COMMENTS_INLINE.EDIT.FAILURE:
    case COMMENTS_INLINE.ADD.FAILURE:
    case COMMENTS_INLINE.DELETE.FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
