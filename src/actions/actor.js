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

function readFailure(response) {
  return {
    type: ACTOR.READ.FAILURE,
    error: response.message,
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

function editRequest(actor) {
  return {
    type: ACTOR.EDIT.REQUEST,
    actor,
  };
}

function editSuccess(result) {
  return {
    type: ACTOR.EDIT.SUCCESS,
    actor: result.data,
  };
}

function editFailure(response) {
  return {
    type: ACTOR.EDIT.FAILURE,
    error: response.message,
  };
}

export function editActor(actor) {
  return (dispatch) => {
    dispatch(editRequest(actor));
    return new Promise((resolve, reject) => {
      api.editActor(actor)
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

function addRequest(actor) {
  return {
    type: ACTOR.ADD.REQUEST,
    actor,
  };
}

function addSuccess(result) {
  return {
    type: ACTOR.ADD.SUCCESS,
    actor: result.data,
  };
}

function addFailure(response) {
  return {
    type: ACTOR.ADD.FAILURE,
    error: response.message,
  };
}

export function addActor(actor, namespace) {
  return (dispatch) => {
    dispatch(addRequest(actor));
    return new Promise((resolve, reject) => {
      api.addActor(actor, namespace)
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

// -- Delete

function deleteRequest(actor) {
  return {
    type: ACTOR.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(result) {
  return {
    type: ACTOR.DELETE.SUCCESS,
    status: result.status,
  };
}

function deleteFailure(response) {
  return {
    type: ACTOR.DELETE.FAILURE,
    error: response.message,
  };
}

export function deleteActor(actor) {
  return (dispatch) => {
    dispatch(deleteRequest(actor));
    return new Promise((resolve, reject) => {
      api.deleteActor(actor)
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

// -- Add Avatar

function addAvatarRequest(actor) {
  return {
    type: ACTOR.AVATAR.ADD.REQUEST,
    actor,
  };
}

function addAvatarSuccess(result) {
  return {
    type: ACTOR.AVATAR.ADD.SUCCESS,
    actor: result.data,
  };
}

function addAvatarFailure(response) {
  return {
    type: ACTOR.AVATAR.ADD.FAILURE,
    error: response.message,
  };
}

export function addAvatar(actor, file) {
  return (dispatch) => {
    dispatch(addAvatarRequest(actor));
    return new Promise((resolve, reject) => {
      api.editAvatar(actor, file)
        .then((result) => {
          dispatch(addAvatarSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(addAvatarFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Delete Avatar

function deleteAvatarRequest(actor) {
  return {
    type: ACTOR.AVATAR.DELETE.REQUEST,
    actor,
  };
}

function deleteAvatarSuccess(result) {
  return {
    type: ACTOR.AVATAR.DELETE.SUCCESS,
    actor: result.data,
  };
}

function deleteAvatarFailure(response) {
  return {
    type: ACTOR.AVATAR.DELETE.FAILURE,
    error: response.message,
  };
}

export function deleteAvatar(actor) {
  return (dispatch) => {
    dispatch(deleteAvatarRequest(actor));
    return new Promise((resolve, reject) => {
      api.editAvatar(actor)
        .then((result) => {
          dispatch(deleteAvatarSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteAvatarFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
