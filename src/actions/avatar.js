import { actors as api } from '../api';
import { Avatar as AVATAR } from '../constants';

// -- Add Avatar

function addRequest(actor) {
  return {
    type: AVATAR.ADD.REQUEST,
    actor,
  };
}

function addSuccess(result) {
  return {
    type: AVATAR.ADD.SUCCESS,
    actor: result.data,
  };
}

function addFailure(response) {
  return {
    type: AVATAR.ADD.FAILURE,
    error: response.message,
  };
}

function add(actor, file) {
  return (dispatch) => {
    dispatch(addRequest(actor));
    return new Promise((resolve, reject) => {
      api.editAvatar(actor, file)
        .then((result) => {
          dispatch(addSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(addFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Delete Avatar

function deleteRequest(actor) {
  return {
    type: AVATAR.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(result) {
  return {
    type: AVATAR.DELETE.SUCCESS,
    actor: result.data,
  };
}

function deleteFailure(response) {
  return {
    type: AVATAR.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteAvatar(actor) {
  return (dispatch) => {
    dispatch(deleteRequest(actor));
    return new Promise((resolve, reject) => {
      api.editAvatar(actor)
        .then((result) => {
          dispatch(deleteSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

export default {
  add,
  deleteAvatar,
};
