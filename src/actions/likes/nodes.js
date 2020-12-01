/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import base from './base';

// -- add like

const addRequest = (node, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`,
    node,
  };
};

const addSuccess = (newNode, namespace) => {
  const node = { ...newNode };
  node.voteUpCount += 1;
  node.isVotedUp = true;

  return {
    type: `${namespace.toUpperCase()}_LIKES_ADD_SUCCESS`,
    node,
  };
};

const addFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_ADD_FAILURE`,
    error: response.message,
  };
};

const add = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(addRequest(node, namespace));
      return new Promise((resolve, reject) => {
        api.add(node)
          .then(() => {
            dispatch(addSuccess(node, namespace));
            return resolve();
          }, (response) => {
            dispatch(addFailure(response, namespace));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

// -- delete like

const deleteRequest = (node, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_DELETE_REQUEST`,
    node,
  };
};

const deleteSuccess = (newNode, namespace) => {
  const node = { ...newNode };
  node.voteUpCount -= 1;
  node.isVotedUp = false;

  return {
    type: `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`,
    node,
  };
};

const deleteFailure = (error, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_DELETE_FAILURE`,
    error: error.message,
  };
};

const deleteItem = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(deleteRequest(node, namespace));
      return new Promise((resolve, reject) => {
        api.deleteItem(node)
          .then(() => {
            dispatch(deleteSuccess(node, namespace));
            return resolve();
          }, (response) => {
            dispatch(deleteFailure(response, namespace));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

export default (namespace) => {
  return (api) => {
    return {
      browse: base.browse(api),
      reset: base.reset(),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
