import { socialgraph as api } from '../api';
import { Actor as ACTOR } from '../constants';

// -- Follow

function followRequest() {
  return {
    type: ACTOR.FOLLOW.REQUEST,
  };
}

function followSuccess(response) {
  return {
    type: ACTOR.FOLLOW.SUCCESS,
    actor: response.data,
  };
}

function followFailure(error) {
  return {
    type: ACTOR.FOLLOW.FAILURE,
    error: error.message,
  };
}

export function followActor(viewer, actor) {
  return (dispatch) => {
    dispatch(followRequest());
    return new Promise((resolve, reject) => {
      api.followActor(viewer, actor)
        .then((result) => {
          dispatch(followSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(followFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

// -- Unfollow

function unfollowRequest() {
  return {
    type: ACTOR.UNFOLLOW.REQUEST,
  };
}

function unfollowSuccess(response) {
  return {
    type: ACTOR.UNFOLLOW.SUCCESS,
    actor: response.data,
  };
}

function unfollowFailure(error) {
  return {
    type: ACTOR.UNFOLLOW.FAILURE,
    error: error.message,
  };
}

export function unfollowActor(viewer, actor) {
  return (dispatch) => {
    dispatch(unfollowRequest());
    return new Promise((resolve, reject) => {
      api.unfollowActor(viewer, actor)
        .then((result) => {
          dispatch(unfollowSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(unfollowFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
