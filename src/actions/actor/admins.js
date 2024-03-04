import { normalize, schema } from 'normalizr';

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
  const node = new schema.Entity(namespace);
  const nodes = [node];
  const normalized = normalize(data.data || [], nodes);

  return {
    type: `${namespace.toUpperCase()}_BROWSE_SUCCESS`,
    [namespace]: normalized.entities[namespace] || {},
    ids: normalized.result || [],
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
  return (params) => {
    return (dispatch) => {
      dispatch(addRequest(namespace));
      return new Promise((resolve, reject) => {
        api.add(params)
          .then((result) => {
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

const deleteRequest = (params, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_REQUEST`,
    node: params.admin,
  };
};

const deleteSuccess = (params, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_SUCCESS`,
    node: params.admin,
  };
};

const deleteFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_DELETE_FAILURE`,
    error: response.message,
  };
};

const deleteItem = (namespace, api) => {
  return (params) => {
    return (dispatch) => {
      dispatch(deleteRequest(params, namespace));
      return new Promise((resolve, reject) => {
        api.deleteItem(params)
          .then(() => {
            dispatch(deleteSuccess(params, namespace));
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
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
