import { normalize, schema } from 'normalizr';
import stories from './stories';

// -- Reset

const reset = (namespace) => {
  return () => {
    return {
      type: `${namespace.toUpperCase()}_BROWSE_RESET`,
    };
  };
};

// -- Browse

const browseRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_BROWSE_REQUEST`,
  };
};

const browseSuccess = (results, namespace) => {
  const { data } = results;
  const { pagination } = data;

  const limit = pagination.limit || 20;
  const total = pagination.total || 0;

  const node = new schema.Entity(namespace);
  const nodes = [node];
  const normalized = normalize(data.data, nodes);
  const hasMore = data.data.length >= limit;

  return {
    type: `${namespace.toUpperCase()}_BROWSE_SUCCESS`,
    [namespace]: normalized.entities[namespace] || {},
    ids: normalized.result || [],
    total,
    hasMore,
  };
};

const browseFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_BROWSE_FAILURE`,
    error: response.message,
  };
};

const browse = (namespace, api) => {
  return (params) => {
    return (dispatch) => {
      dispatch(browseRequest(namespace));
      return new Promise((resolve, reject) => {
        api.browse(params)
          .then((results) => {
            dispatch(browseSuccess(results, namespace));
            return resolve();
          }, (response) => {
            dispatch(browseFailure(response, namespace));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

// -- Read

const readRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_READ_REQUEST`,
  };
};

const readSuccess = (result, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_READ_SUCCESS`,
    node: result.data,
  };
};

const readFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_READ_FAILURE`,
    error: response.message,
  };
};

const read = (namespace, api) => {
  return (id) => {
    return (dispatch) => {
      dispatch(readRequest(namespace));
      return new Promise((resolve, reject) => {
        api.read(id)
          .then((result) => {
            dispatch(readSuccess(result, namespace));
            return resolve();
          }, (response) => {
            dispatch(readFailure(response, namespace));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

// -- Edit

const editRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_REQUEST`,
  };
};

const editSuccess = (result, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_SUCCESS`,
    node: result.data,
  };
};

const editFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_FAILURE`,
    error: response.message,
  };
};

const edit = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(editRequest(namespace));
      return new Promise((resolve, reject) => {
        api.edit(node)
          .then((result) => {
            dispatch(editSuccess(result, namespace));
            return resolve();
          }, (response) => {
            dispatch(editFailure(response, namespace));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

// -- Add

const addRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADD_REQUEST`,
  };
};

const addSuccess = (result, namespace) => {
  const node = result.data.objectType === 'com.stories.story' ?
    result.data.object :
    result.data;
  return {
    type: `${namespace.toUpperCase()}_ADD_SUCCESS`,
    node,
  };
};

const addFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADD_FAILURE`,
    error: response.message,
  };
};

const add = (namespace, api) => {
  return (node, owner = null) => {
    return (dispatch) => {
      dispatch(addRequest(namespace));
      return new Promise((resolve, reject) => {
        api.add(node, owner)
          .then((result) => {
            if (result.data && result.data.objectType === 'com.stories.story') {
              dispatch(stories.add(result.data));
            }
            dispatch(addSuccess(result, namespace));
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

// -- Delete

const deleteRequest = (node, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_REQUEST`,
    node,
  };
};

const deleteSuccess = (node, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_SUCCESS`,
    node,
  };
};

const deleteFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_FAILURE`,
    error: response.message,
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
      reset: reset(namespace),
      browse: browse(namespace, api),
      read: read(namespace, api),
      edit: edit(namespace, api),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
