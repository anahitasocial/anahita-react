import { actors as api } from '../api';
import { Actor as ACTOR } from '../constants';

// -- Read

function readRequest() {
  return {
    type: ACTOR.READ.REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: ACTOR.READ.SUCCESS,
    actor: result.data,
  };
}

function readFailure(error) {
  return {
    type: ACTOR.READ.FAILURE,
    error: error.message,
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

function editRequest() {
  return {
    type: ACTOR.EDIT.REQUEST,
  };
}

function editSuccess(response) {
  return {
    type: ACTOR.EDIT.SUCCESS,
    actor: response.data,
  };
}

function editFailure(error) {
  return {
    type: ACTOR.EDIT.FAILURE,
    error: error.message,
  };
}

export function editActor(actor, namespace) {
  return (dispatch) => {
    dispatch(editRequest(actor));
    return new Promise((resolve, reject) => {
      api.editActor(actor, namespace)
        .then((result) => {
          dispatch(editSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(editFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Add

// -- Delete

function deleteRequest(actor) {
  return {
    type: ACTOR.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(response) {
  return {
    type: ACTOR.DELETE.SUCCESS,
    response,
  };
}

function deleteFailure(error) {
  return {
    type: ACTOR.DELETE.FAILURE,
    error: error.message,
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
