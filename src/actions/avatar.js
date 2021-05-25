import apis from '../api';
import { Avatar as AVATAR } from '../constants';

const { avatar: api } = apis;

// -- Add Avatar

function addRequest(node) {
  return {
    type: AVATAR.ADD.REQUEST,
    node,
  };
}

function addSuccess(result) {
  return {
    type: AVATAR.ADD.SUCCESS,
    node: result.data,
  };
}

function addFailure(response) {
  return {
    type: AVATAR.ADD.FAILURE,
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
    type: AVATAR.DELETE.REQUEST,
    node,
  };
}

function deleteSuccess(result) {
  return {
    type: AVATAR.DELETE.SUCCESS,
    node: result.data,
  };
}

function deleteFailure(response) {
  return {
    type: AVATAR.DELETE.FAILURE,
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
