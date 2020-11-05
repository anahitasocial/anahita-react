/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import CommentDefault from '../../proptypes/CommentDefault';
import base from './base';

// -- add like

const addRequest = (node) => {
  return {
    type: 'COMMENTS_INLINE_LIKES_ADD_REQUEST',
    node,
  };
};

const addSuccess = (newComment) => {
  const comment = { ...newComment };
  comment.voteUpCount += 1;
  comment.isVotedUp = true;

  return {
    type: 'COMMENTS_INLINE_LIKES_ADD_SUCCESS',
    node: comment,
  };
};

const addFailure = (response) => {
  return {
    type: 'COMMENTS_INLINE_LIKES_ADD_FAILURE',
    error: response.message,
  };
};

const add = (api) => {
  return (node, comment = CommentDefault) => {
    return (dispatch) => {
      dispatch(addRequest(node));
      return new Promise((resolve, reject) => {
        api.add(node, comment)
          .then(() => {
            dispatch(addSuccess(comment));
            return resolve();
          }, (response) => {
            dispatch(addFailure(response));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

// -- delete like

const deleteRequest = (node) => {
  return {
    type: 'COMMENTS_INLINE_LIKES_DELETE_REQUEST',
    node,
  };
};

const deleteSuccess = (newComment) => {
  const comment = { ...newComment };
  comment.voteUpCount -= 1;
  comment.isVotedUp = false;

  return {
    type: 'COMMENTS_INLINE_LIKES_DELETE_SUCCESS',
    node: comment,
  };
};

const deleteFailure = (error) => {
  return {
    type: 'COMMENTS_INLINE_LIKES_DELETE_FAILURE',
    error: error.message,
  };
};

const deleteItem = (api) => {
  return (node, comment = CommentDefault) => {
    return (dispatch) => {
      dispatch(deleteRequest(node));
      return new Promise((resolve, reject) => {
        api.deleteItem(node, comment)
          .then(() => {
            dispatch(deleteSuccess(comment));
            return resolve();
          }, (response) => {
            dispatch(deleteFailure(response));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

export default (api) => {
  return {
    browse: base.browse(api),
    reset: base.reset(),
    add: add(api),
    deleteItem: deleteItem(api),
  };
};
