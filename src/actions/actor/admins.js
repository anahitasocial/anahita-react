import createAction from '../create';

// -- Add

const addRequest = (namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADMINS_ADD_REQUEST`,
  };
};

const addSuccess = (result, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADMINS_ADD_SUCCESS`,
    node: result.data,
  };
};

const addFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADMINS_ADD_FAILURE`,
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
  const { admin: node } = params;
  return {
    type: `${namespace.toUpperCase()}_ADMINS_DELETE_REQUEST`,
    node,
  };
};

const deleteSuccess = (params, namespace) => {
  const { admin: node } = params;
  return {
    type: `${namespace.toUpperCase()}_ADMINS_DELETE_SUCCESS`,
    node,
  };
};

const deleteFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_ADMINS_DELETE_FAILURE`,
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
      ...createAction(`${namespace}_admins`)(api),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
