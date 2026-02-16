import { normalize, schema } from 'normalizr';
import apis from '../api';

const { inbounds: api } = apis;

// -- Reset

function reset() {
  return {
    type: 'INBOUNDS_BROWSE_RESET',
  };
}

// -- Browse

function browseRequest() {
  return {
    type: 'INBOUNDS_BROWSE_REQUEST',
  };
}

function browseSuccess(results) {
  const { data } = results;
  const { pagination } = data;

  const limit = pagination.limit || 20;
  const start = pagination.offset || 0;
  const total = pagination.total || 0;

  const node = new schema.Entity('inbounds');
  const nodes = [node];
  const normalized = normalize(data.data ? data.data : {}, nodes);

  return {
    type: 'INBOUNDS_BROWSE_SUCCESS',
    inbounds: normalized.entities.inbounds,
    ids: normalized.result,
    total,
    limit,
    start,
  };
}

function browseFailure(error) {
  return {
    type: 'INBOUNDS_BROWSE_FAILURE',
    error: error.message,
  };
}

function browse(tag) {
  return (params) => {
    return (dispatch) => {
      dispatch(browseRequest());
      return new Promise((resolve, reject) => {
        return api(tag).browse(params)
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
