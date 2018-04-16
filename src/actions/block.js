import { socialgraph as api } from '../api';
import { Actor as ACTOR } from '../constants';

// -- Block

function blockRequest() {
  return {
    type: ACTOR.BLOCK.REQUEST,
  };
}

function blockSuccess(response) {
  return {
    type: ACTOR.BLOCK.SUCCESS,
    actor: response.data,
  };
}

function blockFailure(error) {
  return {
    type: ACTOR.BLOCK.FAILURE,
    error: error.message,
  };
}

export function blockActor(viewer, actor) {
  return (dispatch) => {
    dispatch(blockRequest());
    return new Promise((resolve, reject) => {
      api.blockActor(viewer, actor)
        .then((result) => {
          dispatch(blockSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(blockFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Unblock

function unblockRequest() {
  return {
    type: ACTOR.UNBLOCK.REQUEST,
  };
}

function unblockSuccess(response) {
  return {
    type: ACTOR.UNBLOCK.SUCCESS,
    actor: response.data,
  };
}

function unblockFailure(error) {
  return {
    type: ACTOR.UNBLOCK.FAILURE,
    error: error.message,
  };
}

export function unblockActor(viewer, actor) {
  return (dispatch) => {
    dispatch(unblockRequest());
    return new Promise((resolve, reject) => {
      api.unblockActor(viewer, actor)
        .then((result) => {
          dispatch(unblockSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(unblockFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
