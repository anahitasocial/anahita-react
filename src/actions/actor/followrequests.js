import createAction from '../create';

// -- Add

const addRequest = (params, namespace) => {
  const { followRequest: node } = params;
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_CONFIRM_REQUEST`,
    node,
  };
};

const addSuccess = (result, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_CONFIRM_SUCCESS`,
    node: result.data,
  };
};

const addFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_CONFIRM_FAILURE`,
    error: response.message,
  };
};

const add = (namespace, api) => {
  return (params) => {
    return (dispatch) => {
      dispatch(addRequest(params, namespace));
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
  const { followRequest: node } = params;
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_IGNORE_REQUEST`,
    node,
  };
};

const deleteSuccess = (params, namespace) => {
  const { followRequest: node } = params;
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_IGNORE_SUCCESS`,
    node,
  };
};

const deleteFailure = (response, namespace) => {
  return {
    type: `${namespace.toUpperCase()}_FOLLOWREQUESTS_IGNORE_FAILURE`,
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
      ...createAction(`${namespace}_followrequests`)(api),
      add: add(namespace, api),
      deleteItem: deleteItem(namespace, api),
    };
  };
};
