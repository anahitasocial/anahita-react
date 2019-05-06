/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/*
* DO NOT USE this module yet. It is an experiment.
*/

import { normalize, schema } from 'normalizr';

const createResetAction = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_BROWSE_RESET`,
  };
};

const createBrowseAction = (namespace, api) => {
  return (params) => {
    return (dispatch) => {
      dispatch(() => {
        return {
          type: `${namespace.toUpperCase()}_BROWSE_REQUEST`,
        };
      });
      return new Promise((resolve, reject) => {
        api.browse(params)
          .then((results) => {
            dispatch(() => {
              const { data } = results;
              const { pagination } = data;

              const actor = new schema.Entity('actors');
              const actors = [actor];
              const normalized = normalize(data.data, actors);
              const hasMore = data.data.length >= pagination.limit;

              return {
                type: `${namespace.toUpperCase()}_BROWSE_SUCCESS`,
                actors: normalized.entities.actors,
                ids: normalized.result,
                total: results.data.pagination.total,
                hasMore,
              };
            });
            return resolve();
          }, (response) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_BROWSE_FAILURE`,
                error: response.message,
              };
            });
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

const createReadAction = (namespace, api) => {
  return (id) => {
    return (dispatch) => {
      dispatch(() => {
        return {
          type: `${namespace.toUpperCase()}_READ_REQUEST`,
        };
      });
      return new Promise((resolve, reject) => {
        api.read(id)
          .then((result) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_READ_SUCCESS`,
                node: result.data,
              };
            });
            return resolve();
          }, (response) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_READ_FAILURE`,
                error: response.message,
              };
            });
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

const createEditAction = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(() => {
        return {
          type: `${namespace.toUpperCase()}_EDIT_REQUEST`,
        };
      });
      return new Promise((resolve, reject) => {
        api.edit(node)
          .then((result) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_EDIT_SUCCESS`,
                node: result.data,
              };
            });
            return resolve();
          }, (response) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_EDIT_FAILURE`,
                error: response.message,
              };
            });
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

const createAddAction = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(() => {
        return {
          type: `${namespace.toUpperCase()}_ADD_REQUEST`,
        };
      });
      return new Promise((resolve, reject) => {
        api.add(node)
          .then((result) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_ADD_SUCCESS`,
                node: result.data,
              };
            });
            return resolve();
          }, (response) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_ADD_FAILURE`,
                error: response.message,
              };
            });
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

const createDeleteAction = (namespace, api) => {
  return (node) => {
    return (dispatch) => {
      dispatch(() => {
        return {
          type: `${namespace.toUpperCase()}_DELETE_REQUEST`,
          node,
        };
      });
      return new Promise((resolve, reject) => {
        api.deleteItem(node)
          .then((result) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_DELETE_SUCCESS`,
                status: result.status,
                node,
              };
            });
            return resolve();
          }, (response) => {
            dispatch(() => {
              return {
                type: `${namespace.toUpperCase()}_DELETE_FAILURE`,
                error: response.message,
              };
            });
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
};

export default {
  createResetAction,
  createBrowseAction,
  createReadAction,
  createEditAction,
  createAddAction,
  createDeleteAction,
};
