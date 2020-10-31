/* eslint no-console: ["error", { allow: ["log", "error"] }] */

import { normalize, schema } from 'normalizr';
import CommentDefault from '../proptypes/CommentDefault';

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
  return (node, comment = CommentDefault) => {
    return (dispatch) => {
      dispatch(browseRequest());
      return new Promise((resolve, reject) => {
        api.browse(node, comment)
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

// -- add like

const addRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`,
  };
};

const addSuccess = (newNode, comment, namespace) => {
  const node = comment.id > 0 ? { ...comment } : { ...newNode };
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
  return (node, comment = CommentDefault) => {
    return (dispatch) => {
      dispatch(addRequest(namespace));
      return new Promise((resolve, reject) => {
        api.add(node, comment)
          .then(() => {
            dispatch(addSuccess(node, comment, namespace));
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

const deleteRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_LIKES_DELETE_REQUEST`,
  };
};

const deleteSuccess = (newNode, comment, namespace) => {
  const node = comment.id > 0 ? { ...comment } : { ...newNode };
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
  return (node, comment = CommentDefault) => {
    return (dispatch) => {
      dispatch(deleteRequest(namespace));
      return new Promise((resolve, reject) => {
        api.deleteItem(node, comment)
          .then(() => {
            dispatch(deleteSuccess(node, comment, namespace));
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
      browse: browse(api),
      reset: reset(namespace),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
