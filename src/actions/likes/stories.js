/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import NodeDefault from '../../proptypes/NodeDefault';
import base from './base';

// -- add like

const addRequest = (story) => {
  return {
    type: 'STORIES_LIKES_ADD_REQUEST',
    story,
  };
};

const addSuccess = (newNode) => {
  const node = { ...newNode };
  node.voteUpCount += 1;
  node.isVotedUp = true;

  return {
    type: 'STORIES_LIKES_ADD_SUCCESS',
    node,
  };
};

const addFailure = (response) => {
  return {
    type: 'STORIES_LIKES_ADD_FAILURE',
    error: response.message,
  };
};

const add = (api) => {
  return (story, node = NodeDefault) => {
    return (dispatch) => {
      dispatch(addRequest(story));
      return new Promise((resolve, reject) => {
        api.add(node)
          .then(() => {
            dispatch(addSuccess(node));
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

const deleteRequest = (story) => {
  return {
    type: 'STORIES_LIKES_DELETE_REQUEST',
    story,
  };
};

const deleteSuccess = (newNode) => {
  const node = { ...newNode };
  node.voteUpCount -= 1;
  node.isVotedUp = false;

  return {
    type: 'STORIES_LIKES_DELETE_SUCCESS',
    node,
  };
};

const deleteFailure = (error) => {
  return {
    type: 'STORIES_LIKES_DELETE_FAILURE',
    error: error.message,
  };
};

const deleteItem = (api) => {
  return (story, node = NodeDefault) => {
    return (dispatch) => {
      dispatch(deleteRequest(story));
      return new Promise((resolve, reject) => {
        api.deleteItem(node)
          .then(() => {
            dispatch(deleteSuccess(node));
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
