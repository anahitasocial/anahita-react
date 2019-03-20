import { cover as api } from '../api';
import { Cover as COVER } from '../constants';

// -- Add Avatar

function addRequest(actor) {
  return {
    type: COVER.ADD.REQUEST,
    actor,
  };
}

function addSuccess(result) {
  return {
    type: COVER.ADD.SUCCESS,
    actor: result.data,
  };
}

function addFailure(response) {
  return {
    type: COVER.ADD.FAILURE,
    error: response.message,
  };
}

function add(actor, file) {
  return (dispatch) => {
    dispatch(addRequest(actor));
    return new Promise((resolve, reject) => {
      api.edit(actor, file)
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
    type: COVER.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(result) {
  return {
    type: COVER.DELETE.SUCCESS,
    actor: result.data,
  };
}

function deleteFailure(response) {
  return {
    type: COVER.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteCover(actor) {
  return (dispatch) => {
    dispatch(deleteRequest(actor));
    return new Promise((resolve, reject) => {
      api.edit(actor)
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
  deleteCover,
};
