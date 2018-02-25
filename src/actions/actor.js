import { actors as api } from '../api';
import {
  ACTOR_READ_REQUEST, ACTOR_READ_SUCCESS, ACTOR_READ_FAILURE,
  // ACTOR_EDIT_REQUEST, ACTOR_EDIT_SUCCESS, ACTOR_EDIT_FAILURE,
  // ACTOR_ADD_REQUEST, ACTOR_ADD_SUCCESS, ACTOR_ADD_FAILURE,
  ACTOR_DELETE_REQUEST, ACTOR_DELETE_SUCCESS, ACTOR_DELETE_FAILURE,
} from '../constants/actor';

// -- Read

function readRequest() {
  return {
    type: ACTOR_READ_REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: ACTOR_READ_SUCCESS,
    actor: result.data,
  };
}

function readFailure(error) {
  return {
    type: ACTOR_READ_FAILURE,
    errorMessage: error.message,
  };
}

export function readActor(id, namespace) {
  return (dispatch) => {
    dispatch(readRequest());
    return new Promise((resolve, reject) => {
      api.readActor(id, namespace)
        .then((result) => {
          dispatch(readSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(readFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Edit

// -- Add

// -- Delete

function deleteRequest(actor) {
  return {
    type: ACTOR_DELETE_REQUEST,
    actor,
  };
}

function deleteSuccess(response) {
  return {
    type: ACTOR_DELETE_SUCCESS,
    response,
  };
}

function deleteFailure(error) {
  return {
    type: ACTOR_DELETE_FAILURE,
    errorMessage: error.message,
  };
}

export function deleteActor(actor) {
  return (dispatch) => {
    dispatch(deleteRequest(actor));
    return new Promise((resolve, reject) => {
      api.readActor()
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
