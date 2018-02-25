import { actors as api } from '../api';
import {
  ACTORS_RESET,
  ACTORS_BROWSE_REQUEST, ACTORS_BROWSE_SUCCESS, ACTORS_BROWSE_FAILURE,
} from '../constants/actors';

// -- reset

export function resetActors() {
  return {
    type: ACTORS_RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: ACTORS_BROWSE_REQUEST,
  };
}

function browseSuccess(results) {
  return {
    type: ACTORS_BROWSE_SUCCESS,
    actors: results.data.data,
    offset: results.data.pagination.offset,
    limit: results.data.pagination.limit,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: ACTORS_BROWSE_FAILURE,
    errorMessage: error.message,
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
