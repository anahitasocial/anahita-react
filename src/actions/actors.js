import { normalize, schema } from 'normalizr';
import { actors as api } from '../api';
import { Actors as ACTORS } from '../constants';

// -- reset

function reset() {
  return {
    type: ACTORS.BROWSE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: ACTORS.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const actor = new schema.Entity('actors');
  const actors = [actor];
  const normalized = normalize(results.data.data, actors);

  return {
    type: ACTORS.BROWSE.SUCCESS,
    actors: normalized.entities.actors,
    ids: normalized.result,
    total: results.data.pagination.total,
  };
}

function browseFailure(error) {
  return {
    type: ACTORS.BROWSE.FAILURE,
    error: error.message,
  };
}

function browse(params, namespace) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browse(params, namespace)
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

export {
  reset,
  browse,
};
