import _ from 'lodash';
import { Comments as COMMENTS } from '../constants';
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
  const parents = { ...state.parents };

  parents.allIds = _.union(parents.allIds, [parent.id]);
  parents.byId[parent.id] = { comments };

  return parents;
};

const updateComments = (action, state) => {
  const { comment } = action;
  const { parentId } = comment;
  const parents = { ...state.parents };

  parents.byId[parentId].comments = utils.editItem(
    parents.byId[parentId].comments,
    comment,
  );

  return parents;
};

const deleteComment = (action, state) => {
  const { comment } = action;
  const { parentId } = comment;
  const parents = { ...state.parents };

  parents.byId[parentId].comments = utils.deleteItem(
    parents.byId[parentId].comments,
    comment,
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
    case COMMENTS.BROWSE.SET:
      return {
        ...state,
        parents: setComments(action, state),
      };
    case COMMENTS.BROWSE.RESET:
      return {
        ...initState,
        parents: setComments({
          parent: action.parent,
          comments: { ...CommentsDefault },
        }, state),
      };
    case COMMENTS.BROWSE.REQUEST:
    case COMMENTS.EDIT.REQUEST:
    case COMMENTS.ADD.REQUEST:
    case COMMENTS.DELETE.REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };
    case COMMENTS.BROWSE.SUCCESS:
      return {
        ...state,
        parents: setComments(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS.EDIT.SUCCESS:
    case COMMENTS.ADD.SUCCESS:
      return {
        ...state,
        parents: updateComments(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS.DELETE.SUCCESS:
      return {
        ...state,
        parents: deleteComment(action, state),
        isFetching: false,
        error: '',
      };
    case COMMENTS.BROWSE.FAILURE:
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
