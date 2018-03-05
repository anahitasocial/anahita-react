import { socialgraph as api } from '../api';
import {
  ACTOR_BLOCK_REQUEST, ACTOR_BLOCK_SUCCESS, ACTOR_BLOCK_FAILURE,
  ACTOR_UNBLOCK_REQUEST, ACTOR_UNBLOCK_SUCCESS, ACTOR_UNBLOCK_FAILURE,
} from '../constants/socialgraph';

// -- Block

function blockRequest() {
  return {
    type: ACTOR_BLOCK_REQUEST,
  };
}

function blockSuccess(response) {
  return {
    type: ACTOR_BLOCK_SUCCESS,
    actor: response.data,
  };
}

function blockFailure(error) {
  return {
    type: ACTOR_BLOCK_FAILURE,
    errorMessage: error.message,
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
    type: ACTOR_UNBLOCK_REQUEST,
  };
}

function unblockSuccess(response) {
  return {
    type: ACTOR_UNBLOCK_SUCCESS,
    actor: response.data,
  };
}

function unblockFailure(error) {
  return {
    type: ACTOR_UNBLOCK_FAILURE,
    errorMessage: error.message,
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
