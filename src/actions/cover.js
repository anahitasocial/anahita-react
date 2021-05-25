import apis from '../api';
import { Cover as COVER } from '../constants';

const { cover: api } = apis;

// -- Add Avatar

function addRequest(node) {
  return {
    type: COVER.ADD.REQUEST,
    node,
  };
}

function addSuccess(result) {
  return {
    type: COVER.ADD.SUCCESS,
    node: result.data,
  };
}

function addFailure(response) {
  return {
    type: COVER.ADD.FAILURE,
    error: response.message,
  };
}

function add(node, file) {
  return (dispatch) => {
    dispatch(addRequest(node));
    return new Promise((resolve, reject) => {
      api.edit(node, file)
        .then((result) => {
          dispatch(addSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(addFailure(response));
          return reject(response);
        }).catch((error) => {
          // throw new Error(error);
          console.error(error);
        });
    });
  };
}

// -- Delete Avatar

function deleteRequest(node) {
  return {
    type: COVER.DELETE.REQUEST,
    node,
  };
}

function deleteSuccess(result) {
  return {
    type: COVER.DELETE.SUCCESS,
    node: result.data,
  };
}

function deleteFailure(response) {
  return {
    type: COVER.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteItem(node) {
  return (dispatch) => {
    dispatch(deleteRequest(node));
    return new Promise((resolve, reject) => {
      api.edit(node)
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
  add,
  deleteItem,
};
