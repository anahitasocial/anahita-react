import { socialgraph as api } from '../api';
import { Socialgraph as SOCIALGRAPH } from '../constants';
import createAction from './create';

const sgActions = createAction('socialgraph')(api);

// -- Follow

function followRequest(actor) {
  return {
    type: SOCIALGRAPH.FOLLOW.REQUEST,
    actor,
  };
}

function followSuccess(response) {
  return {
    type: SOCIALGRAPH.FOLLOW.SUCCESS,
    actor: response.data,
  };
}

function followFailure(error) {
  return {
    type: SOCIALGRAPH.FOLLOW.FAILURE,
    error: error.message,
  };
}

function follow(viewer, actor) {
  return (dispatch) => {
    dispatch(followRequest(actor));
    return new Promise((resolve, reject) => {
      api.follow(viewer, actor)
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

function unfollowRequest(actor) {
  return {
    type: SOCIALGRAPH.UNFOLLOW.REQUEST,
    actor,
  };
}

function unfollowSuccess(response) {
  return {
    type: SOCIALGRAPH.UNFOLLOW.SUCCESS,
    actor: response.data,
  };
}

function unfollowFailure(error) {
  return {
    type: SOCIALGRAPH.UNFOLLOW.FAILURE,
    error: error.message,
  };
}

function unfollow(viewer, actor) {
  return (dispatch) => {
    dispatch(unfollowRequest(actor));
    return new Promise((resolve, reject) => {
      api.unfollow(viewer, actor)
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

// -- Block

function blockRequest(actor) {
  return {
    type: SOCIALGRAPH.BLOCK.REQUEST,
    actor,
  };
}

function blockSuccess(response) {
  return {
    type: SOCIALGRAPH.BLOCK.SUCCESS,
    actor: response.data,
  };
}

function blockFailure(error) {
  return {
    type: SOCIALGRAPH.BLOCK.FAILURE,
    error: error.message,
  };
}

function block(viewer, actor) {
  return (dispatch) => {
    dispatch(blockRequest(actor));
    return new Promise((resolve, reject) => {
      api.block(viewer, actor)
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

function unblockRequest(actor) {
  return {
    type: SOCIALGRAPH.UNBLOCK.REQUEST,
    actor,
  };
}

function unblockSuccess(response) {
  return {
    type: SOCIALGRAPH.UNBLOCK.SUCCESS,
    actor: response.data,
  };
}

function unblockFailure(error) {
  return {
    type: SOCIALGRAPH.UNBLOCK.FAILURE,
    error: error.message,
  };
}

function unblock(viewer, actor) {
  return (dispatch) => {
    dispatch(unblockRequest(actor));
    return new Promise((resolve, reject) => {
      api.unblock(viewer, actor)
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

export default {
  reset: () => {
    return sgActions.reset();
  },
  browse: (params) => {
    return sgActions.browse(params);
  },
  follow,
  unfollow,
  block,
  unblock,
};
