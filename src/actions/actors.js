import { actors as api } from '../api';
import { Actors as ACTORS } from '../constants';

// -- reset

export function resetActors() {
  return {
    type: ACTORS.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: ACTORS.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  return {
    type: ACTORS.BROWSE.SUCCESS,
    actors: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: ACTORS.BROWSE.FAILURE,
    error: error.message,
  };
}

export function browseActors(params, namespace) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browseActors(params, namespace)
        .then((result) => {
          dispatch(browseSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(browseFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}
