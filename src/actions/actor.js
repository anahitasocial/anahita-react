import { actors as api } from '../api';
import { Actors as ACTORS } from '../constants';

// -- Read

function readRequest() {
  return {
    type: ACTORS.READ.REQUEST,
  };
}

function readSuccess(result) {
  return {
    type: ACTORS.READ.SUCCESS,
    actor: result.data,
  };
}

function readFailure(response) {
  return {
    type: ACTORS.READ.FAILURE,
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
          throw new Error(error);
        });
    });
  };
}

// -- Edit

function editRequest(actor) {
  return {
    type: ACTORS.EDIT.REQUEST,
    actor,
  };
}

function editSuccess(result) {
  return {
    type: ACTORS.EDIT.SUCCESS,
    actor: result.data,
  };
}

function editFailure(response) {
  return {
    type: ACTORS.EDIT.FAILURE,
    error: response.message,
  };
}

function edit(actor) {
  return (dispatch) => {
    dispatch(editRequest(actor));
    return new Promise((resolve, reject) => {
      api.edit(actor)
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
    type: ACTORS.ADD.REQUEST,
    actor,
  };
}

function addSuccess(result) {
  return {
    type: ACTORS.ADD.SUCCESS,
    actor: result.data,
  };
}

function addFailure(response) {
  return {
    type: ACTORS.ADD.FAILURE,
    error: response.message,
  };
}

function add(actor, namespace) {
  return (dispatch) => {
    dispatch(addRequest(actor));
    return new Promise((resolve, reject) => {
      api.add(actor, namespace)
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
    type: ACTORS.DELETE.REQUEST,
    actor,
  };
}

function deleteSuccess(result) {
  return {
    type: ACTORS.DELETE.SUCCESS,
    status: result.status,
  };
}

function deleteFailure(response) {
  return {
    type: ACTORS.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteActor(actor) {
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
    type: ACTORS.AVATAR.ADD.REQUEST,
    actor,
  };
}

function addAvatarSuccess(result) {
  return {
    type: ACTORS.AVATAR.ADD.SUCCESS,
    actor: result.data,
  };
}

function addAvatarFailure(response) {
  return {
    type: ACTORS.AVATAR.ADD.FAILURE,
    error: response.message,
  };
}

function addAvatar(actor, file) {
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
    type: ACTORS.AVATAR.DELETE.REQUEST,
    actor,
  };
}

function deleteAvatarSuccess(result) {
  return {
    type: ACTORS.AVATAR.DELETE.SUCCESS,
    actor: result.data,
  };
}

function deleteAvatarFailure(response) {
  return {
    type: ACTORS.AVATAR.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteAvatar(actor) {
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

// -- Add Cover

function addCoverRequest(actor) {
  return {
    type: ACTORS.COVER.ADD.REQUEST,
    actor,
  };
}

function addCoverSuccess(result) {
  return {
    type: ACTORS.COVER.ADD.SUCCESS,
    actor: result.data,
  };
}

function addCoverFailure(response) {
  return {
    type: ACTORS.COVER.ADD.FAILURE,
    error: response.message,
  };
}

function addCover(actor, file) {
  return (dispatch) => {
    dispatch(addCoverRequest(actor));
    return new Promise((resolve, reject) => {
      api.editCover(actor, file)
        .then((result) => {
          dispatch(addCoverSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(addCoverFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Delete Cover

function deleteCoverRequest(actor) {
  return {
    type: ACTORS.COVER.DELETE.REQUEST,
    actor,
  };
}

function deleteCoverSuccess(result) {
  return {
    type: ACTORS.COVER.DELETE.SUCCESS,
    actor: result.data,
  };
}

function deleteCoverFailure(response) {
  return {
    type: ACTORS.COVER.DELETE.FAILURE,
    error: response.message,
  };
}

function deleteCover(actor) {
  return (dispatch) => {
    dispatch(deleteCoverRequest(actor));
    return new Promise((resolve, reject) => {
      api.editCover(actor)
        .then((result) => {
          dispatch(deleteCoverSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(deleteCoverFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

export {
  read,
  edit,
  add,
  deleteActor,
  addAvatar,
  deleteAvatar,
  addCover,
  deleteCover,
};
