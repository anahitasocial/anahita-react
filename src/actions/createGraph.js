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
  return (parent) => {
    return {
      type: `${namespace.toUpperCase()}_BROWSE_REQUEST`,
      parent,
    };
  };
};

const browseSuccess = (namespace) => {
  return (parent) => {
    return (results) => {
      const { data } = results;
      const { pagination } = data;

      const limit = pagination.limit || 20;
      const total = pagination.total || 0;

      const node = new schema.Entity(namespace);
      const nodes = [node];
      const normalized = normalize(data.data, nodes);
      const hasMore = data.data.length >= limit;

      return {
        type: `${namespace.toUpperCase()}_GRAPH_BROWSE_SUCCESS`,
        [namespace]: normalized.entities[namespace] || {},
        ids: normalized.result || [],
        total,
        hasMore,
        parent,
      };
    };
  };
};

const browseFailure = (namespace) => {
  return (parent) => {
    return (response) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_BROWSE_FAILURE`,
        error: response.message,
        parent,
      };
    };
  };
};

const browse = (namespace, api) => {
  return (parent) => {
    return (params) => {
      return (dispatch) => {
        dispatch(browseRequest(namespace)(parent));
        return new Promise((resolve, reject) => {
          api(parent).browse(params)
            .then((results) => {
              dispatch(browseSuccess(namespace)(parent)(results));
              return resolve();
            }, (response) => {
              dispatch(browseFailure(namespace)(parent)(response));
              return reject(response);
            }).catch((error) => {
              console.error(error);
            });
        });
      };
    };
  };
};

// -- Add

const addRequest = (namespace) => {
  return (parent) => {
    return {
      type: `${namespace.toUpperCase()}_GRAPH_ADD_REQUEST`,
      parent,
    };
  };
};

const addSuccess = (namespace) => {
  return (parent) => {
    return (result) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_ADD_SUCCESS`,
        node: result.data,
        parent,
      };
    };
  };
};

const addFailure = (namespace) => {
  return (parent) => {
    return (response) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_ADD_FAILURE`,
        error: response.message,
        parent,
      };
    };
  };
};

const add = (namespace, api) => {
  return (parent) => {
    return (node) => {
      return (dispatch) => {
        dispatch(addRequest(namespace)(parent));
        return new Promise((resolve, reject) => {
          api(parent).add(node)
            .then((result) => {
              dispatch(addSuccess(namespace)(parent)(result));
              return resolve();
            }, (response) => {
              dispatch(addFailure(namespace)(parent)(response));
              return reject(response);
            }).catch((error) => {
              console.error(error);
            });
        });
      };
    };
  };
};

// -- Delete

const deleteRequest = (namespace) => {
  return (parent) => {
    return (node) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_DELETE_REQUEST`,
        node,
        parent,
      };
    };
  };
};

const deleteSuccess = (namespace) => {
  return (parent) => {
    return (node) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_DELETE_SUCCESS`,
        node,
        parent,
      };
    };
  };
};

const deleteFailure = (namespace) => {
  return (parent) => {
    return (response) => {
      return {
        type: `${namespace.toUpperCase()}_GRAPH_DELETE_FAILURE`,
        error: response.message,
        parent,
      };
    };
  };
};

const deleteItem = (namespace, api) => {
  return (parent) => {
    return (node) => {
      return (dispatch) => {
        dispatch(deleteRequest(namespace)(parent)(node));
        return new Promise((resolve, reject) => {
          api(parent).deleteItem(node)
            .then(() => {
              dispatch(deleteSuccess(namespace)(parent)(node));
              return resolve();
            }, (response) => {
              dispatch(deleteFailure(namespace)(parent)(response));
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
      reset: reset(namespace),
      browse: browse(namespace, api),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
