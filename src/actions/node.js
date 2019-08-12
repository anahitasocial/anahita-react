import { node as api } from '../api';
import { Node as NODE } from '../constants';

// -- Read

function readRequest() {
  return {
    type: NODE.READ.REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: NODE.READ.SUCCESS,
    node: result.data,
  };
}

function readFailure(response) {
  return {
    type: NODE.READ.FAILURE,
    error: response.message,
  };
}

function read(id, namespace) {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.read(id, namespace)
        .then((result) => {
          dispatch(readSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(readFailure(response));
          return reject(response);
        }).catch((error) => {
          // throw new Error(error);
          console.error(error);
        });
    });
  };
}

// -- Delete

function deleteRequest(node) {
  return {
    type: NODE.DELETE.REQUEST,
    node,
  };
}

function deleteSuccess(result) {
  return {
    type: NODE.DELETE.SUCCESS,
    status: result.status,
    node: null,
  };
}

function deleteFailure(response) {
  return {
    type: NODE.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteItem(node) {
  return (dispatch) => {
    dispatch(deleteRequest(node));
    return new Promise((resolve, reject) => {
      api.deleteItem(node)
        .then((result) => {
          dispatch(deleteSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteFailure(response));
          return reject(response);
        }).catch((error) => {
          // throw new Error(error);
          console.error(error);
        });
    });
  };
}

export default {
  read,
  deleteItem,
};
