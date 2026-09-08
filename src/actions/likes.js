/* eslint-disable no-console */
/* eslint no-console: ["error", { allow: ["log", "error"] }] */
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
  const normalized = normalize(data.data || [], people);

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
  return (node, comment = null) => {
    return (dispatch) => {
      dispatch(browseRequest());
      return new Promise((resolve, reject) => {
        return api.browse(node, comment)
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
  return (node) => {
    return {
      type: `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`,
      node,
    };
  };
};

const addSuccess = (namespace) => {
  return (params) => {
    const {
      results,
      child,
      node,
      comment = null,
    } = params;

    const { data } = results;

    // Merge over what is already in the store rather than replacing it. The
    // like endpoint answers with its own narrower view of the node, which
    // carries no `authorized` block — so replacing the comment wholesale left
    // CommentMenu reading `.edit` on undefined. Unlike has always merged
    // locally; liking was the one that threw the rest of the node away.
    const newNode = {
      ...(comment || node),
      ...data,
      isLikedByViewer: true,
    };

    return {
      type: `${namespace.toUpperCase()}_LIKES_ADD_SUCCESS`,
      node: newNode,
      child,
    };
  };
};

const addFailure = (namespace) => {
  return (response) => {
    return {
      type: `${namespace.toUpperCase()}_LIKES_ADD_FAILURE`,
      error: response.message,
    };
  };
};

const add = (namespace) => {
  return (api) => {
    return ({ child, node, comment = null }) => {
      return (dispatch) => {
        dispatch(addRequest(namespace)(node));
        return new Promise((resolve, reject) => {
          return api.add(node, comment)
            .then((results) => {
              dispatch(addSuccess(namespace)({
                results,
                child,
                node,
                comment,
              }));
              return resolve();
            }, (response) => {
              dispatch(addFailure(namespace)(response));
              return reject(response);
            }).catch((error) => {
              console.error(error);
            });
        });
      };
    };
  };
};

// -- delete like

const deleteRequest = (namespace) => {
  return () => {
    return {
      type: `${namespace.toUpperCase()}_LIKES_DELETE_REQUEST`,
    };
  };
};

const deleteSuccess = (namespace) => {
  return (params) => {
    const {
      node,
      comment = null,
      child,
    } = params;
    const newNode = comment ? { ...comment } : { ...node };

    newNode.likesCount -= 1;
    newNode.isLikedByViewer = false;

    return {
      type: `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`,
      node: newNode,
      child,
    };
  };
};

const deleteFailure = (namespace) => {
  return (error) => {
    return {
      type: `${namespace.toUpperCase()}_LIKES_DELETE_FAILURE`,
      error: error.message,
    };
  };
};

const deleteItem = (namespace) => {
  return (api) => {
    return ({ child, node, comment = null }) => {
      return (dispatch) => {
        dispatch(deleteRequest(namespace)());
        return new Promise((resolve, reject) => {
          return api.deleteItem(node, comment)
            .then(() => {
              dispatch(deleteSuccess(namespace)({
                child,
                node,
                comment,
              }));
              return resolve();
            }, (response) => {
              dispatch(deleteFailure(namespace)(response));
              return reject(response);
            }).catch((error) => {
              console.error(error);
            });
        });
      };
    };
  };
};

export default (namespace) => {
  return (api) => {
    return {
      browse: browse(api),
      reset: reset(),
      add: add(namespace)(api),
      deleteItem: deleteItem(namespace)(api),
    };
  };
};
