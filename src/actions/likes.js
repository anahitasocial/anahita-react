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
  return (node, comment = null) => {
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
  return () => {
    return {
      type: `${namespace.toUpperCase()}_LIKES_ADD_REQUEST`,
    };
  };
};

const addSuccess = (namespace) => {
  return (params) => {
    const {
      results,
      node,
      comment = null,
      story,
    } = params;

    const { data } = results;
    const newNode = comment ? { ...comment } : { ...node };

    newNode.voteUpCount = data.data.length;
    newNode.isVotedUp = true;
    newNode.voteups = data.data;

    return {
      type: `${namespace.toUpperCase()}_LIKES_ADD_SUCCESS`,
      node: newNode,
      story,
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
    return ({ story, node, comment = null }) => {
      return (dispatch) => {
        dispatch(addRequest(namespace)());
        return new Promise((resolve, reject) => {
          api.add(node, comment)
            .then((results) => {
              dispatch(addSuccess(namespace)({
                results,
                story,
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
      results,
      node,
      comment = null,
      story,
    } = params;
    const { data } = results;
    const newNode = comment ? { ...comment } : { ...node };

    newNode.voteUpCount = data.data.length;
    newNode.isVotedUp = false;
    newNode.voteups = data.data;

    return {
      type: `${namespace.toUpperCase()}_LIKES_DELETE_SUCCESS`,
      node: newNode,
      story,
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
    return ({ story, node, comment = null }) => {
      return (dispatch) => {
        dispatch(deleteRequest(namespace)());
        return new Promise((resolve, reject) => {
          api.deleteItem(node, comment)
            .then((results) => {
              dispatch(deleteSuccess(namespace)({
                results,
                story,
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
