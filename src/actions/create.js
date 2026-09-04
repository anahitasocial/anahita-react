import { normalize, schema } from 'normalizr';
import stories from './stories';

// Monotonic id stamped on every browse request and every reset, so the reducer
// can drop responses that were issued before the most recent reset. A single
// counter across namespaces is enough — each reducer only ever sees its own
// namespace's actions, and all we need is uniqueness plus dispatch ordering.
let requestSeq = 0;

const nextRequestId = () => {
  requestSeq += 1;
  return requestSeq;
};

// -- Reset

const reset = (namespace) => {
  return () => {
    return {
      type: `${namespace.toUpperCase()}_BROWSE_RESET`,
      resetId: nextRequestId(),
    };
  };
};

// -- Browse

const browseRequest = (namespace, requestId) => {
  return {
    type: `${namespace.toUpperCase()}_BROWSE_REQUEST`,
    requestId,
  };
};

const browseSuccess = (results, namespace, requestId) => {
  const { data } = results;
  const paginationDefault = {
    limit: 20,
    offset: 0,
    total: 0,
  };

  const pagination = { ...paginationDefault, ...data.pagination };

  const limit = pagination.limit || 20;
  const start = pagination.offset || 0;
  const total = pagination.total || 0;

  const node = new schema.Entity(namespace);
  const nodes = [node];
  const normalized = normalize(data.data || [], nodes);
  const ids = normalized.result || [];

  // Endpoints that report a total give an exact answer; the rest fall back to
  // the "a full page probably means there is another one" heuristic.
  const hasMore = total > 0 ? (start + ids.length) < total : ids.length >= limit;

  return {
    type: `${namespace.toUpperCase()}_BROWSE_SUCCESS`,
    [namespace]: normalized.entities[namespace] || {},
    ids,
    total,
    limit,
    start,
    hasMore,
    requestId,
  };
};

const browseFailure = (response, namespace, requestId) => {
  return {
    type: `${namespace.toUpperCase()}_BROWSE_FAILURE`,
    error: response.message,
    requestId,
  };
};

const browse = (namespace, api) => {
  return (params) => {
    return (dispatch) => {
      const requestId = nextRequestId();
      dispatch(browseRequest(namespace, requestId));
      return new Promise((resolve, reject) => {
        return api.browse(params)
          .then((results) => {
            dispatch(browseSuccess(results, namespace, requestId));
            return resolve();
          }, (response) => {
            dispatch(browseFailure(response, namespace, requestId));
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
        return api.read(id)
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
        return api.edit(node)
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

// -- Edit Access
const editAccessRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_ACCESS_REQUEST`,
  };
};

const editAccessSuccess = (result, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_ACCESS_SUCCESS`,
    node: result.data,
  };
};

const editAccessFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_EDIT_ACCESS_FAILURE`,
    error: response.message,
  };
};

const editAccess = (namespace, api) => {
  return (node, owner = null) => {
    return (dispatch) => {
      dispatch(editAccessRequest(namespace));
      return new Promise((resolve, reject) => {
        return api.editAccess(node, owner)
          .then((result) => {
            dispatch(editAccessSuccess(result, namespace));
            return resolve();
          }, (response) => {
            dispatch(editAccessFailure(response, namespace));
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
        return api.add(node, owner)
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
        return api.deleteItem(node)
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

// Undo a deletion within the grace period.
//
// Deliberately does NOT reuse the delete/edit action pair. Reusing DELETE_*
// would leave the reducer believing the actor had just been removed, and EDIT_*
// would have it merge a stale copy over the store. This dispatches nothing but
// its own request/failure; the caller re-reads the actor on success, which is
// the only way the rest of the page learns the group is back.
const restore = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(deleteRequest(node, namespace));
      return new Promise((resolve, reject) => {
        return api.restore(node)
          .then(() => {
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
      restore: restore(namespace, api),
      browse: browse(namespace, api),
      read: read(namespace, api),
      edit: edit(namespace, api),
      editAccess: editAccess(namespace, api),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
