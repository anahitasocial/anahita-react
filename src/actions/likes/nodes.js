/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import base from './base';

/*
import { normalize, schema } from 'normalizr';

const reset = () => {
  return () => {
    return {
      type: 'LIKES_BROWSE_RESET',
    };
  };
};

// -- browse likers

const browseRequest = () => {
  return {
    type: 'LIKES_BROWSE_REQUEST',
  };
};

const browseSuccess = (results) => {
  const { data } = results;

  const person = new schema.Entity('people');
  const people = [person];
  const normalized = normalize(data.data, people);

  return {
    type: 'LIKES_BROWSE_SUCCESS',
    likes: normalized.entities.people,
    ids: normalized.result,
  };
};

const browseFailure = (response) => {
  return {
    type: 'LIKES_BROWSE_FAILURE',
    error: response.message,
  };
};

const browse = (api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(browseRequest());
      return new Promise((resolve, reject) => {
        api.browse(node)
          .then((result) => {
            dispatch(browseSuccess(result));
            return resolve();
          }, (response) => {
            dispatch(browseFailure(response));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};
*/

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
