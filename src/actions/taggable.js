import { normalize, schema } from 'normalizr';
import apis from '../api';

const { taggables: api } = apis;

// -- Reset

function reset() {
  return {
    type: 'TAGGABLES_BROWSE_RESET',
  };
}

// -- Browse

function browseRequest() {
  return {
    type: 'TAGGABLES_BROWSE_REQUEST',
  };
}

function browseSuccess(results) {
  const { data, pagination } = results.data.taggables;
  const { total, limit } = pagination;

  const taggable = new schema.Entity('taggables');
  const taggables = [taggable];
  const normalized = normalize(data, taggables);
  const hasMore = data.length >= limit;

  return {
    type: 'TAGGABLES_BROWSE_SUCCESS',
    taggables: normalized.entities.taggables,
    ids: normalized.result,
    total,
    hasMore,
  };
}

function browseFailure(error) {
  return {
    type: 'TAGGABLES_BROWSE_FAILURE',
    error: error.message,
  };
}

function browse(tag) {
  return (params) => {
    return (dispatch) => {
      dispatch(browseRequest());
      return new Promise((resolve, reject) => {
        api(tag).browse(params)
          .then((results) => {
            dispatch(browseSuccess(results));
            return resolve();
          }, (response) => {
            dispatch(browseFailure(response));
            return reject(response);
          }).catch((error) => {
            console.error(error);
          });
      });
    };
  };
}

export default (tag) => {
  return {
    reset,
    browse: browse(tag),
  };
};
